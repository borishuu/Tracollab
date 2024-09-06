import {PrismaClient} from '@prisma/client';
import {NextRequest, NextResponse} from 'next/server';
import {uploadToGc} from '@/lib/gcUpload';
import {jwtVerify} from "jose";

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        // Récupérer tous les posts de la base de données
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

        return new NextResponse(JSON.stringify(posts), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        } as Response);
    } catch (error) {
        return new NextResponse(JSON.stringify({error: 'Internal Server Error'}), {status: 500} as Response);
    } finally {
        // Déconnecter le client Prisma
        await prisma.$disconnect();
    }
}

export async function POST(req: NextRequest) {
    // Récupérer les données du formulaire
    const form = await req.formData();
    const audioFile = form.get("audioFile") as File;
    const imageFile = form.get("imageFile") as File;
    const title = form.get('title') as string;
    const type = form.get('type') as string;
    const genreName = form.get('genre') as string;
    const text = form.get('text') as string;

    try {
        let userId;

        // Récupérer le token JWT de l'utilisateur
        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        const token = req.cookies.get('authToken')?.value;

        try {
            // Vérifier le token JWT
            const {payload} = await jwtVerify(token, secret);
            userId = payload.userId;
        } catch (error) {
            return new NextResponse(JSON.stringify(
                {error: "User not authenticated"}
            ), {status: 400} as Response);
        }

        const genre = await prisma.genre.findFirst({where: {name: genreName}});

        // Vérifier si les champs obligatoires sont remplis
        if (!title)
            return new NextResponse(JSON.stringify(
                    {error: "A title is required."}),
                {status: 400} as Response
            );

        if (!genre)
            return new NextResponse(JSON.stringify(
                    {error: "Please select a genre."}),
                {status: 400} as Response
            );

        // Vérifier si le type est valide
        if (type !== "Instrumental" && type !== "Voice")
            return new NextResponse(JSON.stringify(
                    {error: "Please select a type."}),
                {status: 400} as Response
            );

        // Vérifier si un fichier audio est fourni
        if (!audioFile || !(audioFile instanceof File))
            return new NextResponse(JSON.stringify(
                    {error: "An audio file (MP3) is required."}),
                {status: 400} as Response
            );

        // Uploader le fichier sur Google Cloud Storage et récupérer l'URL
        const audioUrl = await uploadToGc(audioFile, 'instrumentals');
        let imgUrl;

        // Vérifier si un fichier image est fourni et l'uploader sur Google Cloud Storage
        if (!imageFile || !(imageFile instanceof File))
            imgUrl = "https://storage.googleapis.com/tracollab-storage/images/default-sound.jpg";
        else
            imgUrl = await uploadToGc(imageFile, 'images');

        // Créer un nouveau son dans la base de données
        const sound = await prisma.sound.create({
            data: {
                title: title,
                audioPath: audioUrl,
                picture: imgUrl,
                genreId: genre.id,
            },
        });

        // Créer un nouvel enregistrement dans la base de données en fonction du type
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
            default:
                return new NextResponse(JSON.stringify(
                        {error: "Invalid type."}),
                    {status: 400} as Response
                );
        }

        // Créer un nouveau post dans la base de données
        await prisma.post.create({
            data: {
                description: text,
                user: {connect: {id: userId}},
                sound: {connect: {id: sound.id}},
            },
        });

        return new NextResponse(JSON.stringify({error: "Audio uploaded"}), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            } as Response
        );
    } catch (error) {
        return new NextResponse(JSON.stringify(
                {error: "Server error"}),
            {status: 500} as Response
        );
    }
}
