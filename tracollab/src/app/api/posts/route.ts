import {PrismaClient} from '@prisma/client';
import {NextRequest, NextResponse} from 'next/server';
import {uploadToGc} from '@/app/lib/gcUpload';
import {cookies} from "next/headers";
import {jwtVerify} from "jose";

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        const posts = await prisma.post.findMany({
            include: {
                sound: {
                    include: {
                        genre: true,
                    },
                },
                user: true,
                comments: true,
                likes: true,
                reports: true
            },
        });

        // Send the posts data back as a JSON response
        return new Response(JSON.stringify(posts), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        return new Response(JSON.stringify({error: 'Internal Server Error'}), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } finally {
        await prisma.$disconnect();
    }
}

export async function POST(req: NextRequest) {
    const form = await req.formData();
    const audioFile = form.get("audioFile") as File;
    const imageFile = form.get("imageFile") as File;
    const title = form.get('title') as string;
    const type = form.get('type') as string;
    const genreName = form.get('genre') as string;
    const text = form.get('text') as string;

    try {
        let userId;

        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        const token = req.cookies.get('authToken')?.value;

        try {
            const {payload} = await jwtVerify(token, secret);
            userId = payload.userId;
        } catch (error) {
            console.error("Error getting user data");
            return new NextResponse(JSON.stringify(
                {error: "User not authenticated"}
            ), {status: 400});
        }

        const genre = await prisma.genre.findFirst({where: {name: genreName}});

        if (!title) {
            return new NextResponse(JSON.stringify(
                    {error: "A title is required."}),
                {status: 400} as Response
            );
        }

        if (!genre) {
            return new NextResponse(JSON.stringify(
                    {error: "Please select a genre."}),
                {status: 400} as Response
            );
        }

        if (type !== "Instrumental" && type !== "Voice") {
            return new NextResponse(JSON.stringify(
                    {error: "Please select a type."}),
                {status: 400} as Response
            );
        }

        if (!audioFile || !(audioFile instanceof File)) {
            return new NextResponse(JSON.stringify(
                    {error: "An audio file (MP3) is required."}),
                {status: 400} as Response
            );
        }

        const audioUrl = await uploadToGc(audioFile, 'instrumentals');
        let imgUrl;

        if (!imageFile || !(imageFile instanceof File)) {
            imgUrl = "https://storage.googleapis.com/tracollab-storage/images/default-sound.jpg";
        } else {
            imgUrl = await uploadToGc(imageFile, 'images');
        }

        const sound = await prisma.sound.create({
            data: {
                title: title,
                audioPath: audioUrl,
                picture: imgUrl,
                genreId: genre.id,
            },
        });

        switch (type) {
            case "Instrumental":
                await prisma.instrumental.create({
                    data: {
                        soundId: sound.id,
                    },
                });
                break;
            case "Voice":
                await prisma.voice.create({
                    data: {
                        soundId: sound.id,
                    },
                });
                break;
        }

        const post = await prisma.post.create({
            data: {
                description: text,
                user: {connect: {id: userId}},
                sound: {connect: {id: sound.id}},
            },
        });

        return new NextResponse(JSON.stringify(
                {message: "Audio uploaded"}),
            {status: 200}
        );
    } catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify(
                {error: "Server error"}),
            {status: 500}
        );

    }
}
