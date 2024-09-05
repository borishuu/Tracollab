import {PrismaClient} from '@prisma/client';
import {NextRequest, NextResponse} from 'next/server';
import {uploadToGc} from "@/app/lib/gcUpload";
import {cookies} from "next/headers";
import {jwtVerify} from "jose";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const form = await req.formData();
    const imageFile = form.get("profilePicture") as File;

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

        if (imageFile.size < 1) {
            return new NextResponse(JSON.stringify(
                {error: "Please upload a valid picture."}
            ), {status: 400});
        }

        // Upload image to GC
        const url = await uploadToGc(imageFile, 'images');

        // Update user
        const user = await prisma.user.update({
            where: {id: userId},
            data: {profilePicture: url},
        });

        return NextResponse.json({user, profilePicture: url});
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        return NextResponse.json(
            {error: 'Failed to upload profile picture'},
            {status: 500}
        );
    }
}
