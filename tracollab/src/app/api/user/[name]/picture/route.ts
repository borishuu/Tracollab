import {PrismaClient} from '@prisma/client';
import {NextRequest, NextResponse} from 'next/server';
import {uploadToGc} from "@/lib/gcUpload";
import {jwtVerify} from "jose";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    // Récupérer l'image envoyée par l'utilisateur
    const form = await req.formData();
    const imageFile = form.get("profilePicture") as File;

    try {
        let userId;

        // Récupérer le token de l'utilisateur
        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        const token = req.cookies.get('authToken')?.value;

        try {
            // Vérifier le token
            const {payload} = await jwtVerify(token, secret);
            userId = payload.userId;
        } catch (error) {
            return new NextResponse(JSON.stringify(
                {error: "User not authenticated"}
            ), {status: 400} as Response);
        }

        if (imageFile.size < 1)
            return new NextResponse(JSON.stringify(
                {error: "Please upload a valid picture."}
            ), {status: 400} as Response);

        // Upload l'image sur Google Cloud Storage et récupérer l'url
        const url = await uploadToGc(imageFile, 'images');

        // Mettre à jour l'url de l'image de profil de l'utilisateur
        const user = await prisma.user.update({
            where: {id: userId},
            data: {profilePicture: url},
        });

        return NextResponse.json({user, profilePicture: url});
    } catch (error) {
        return NextResponse.json({error: 'Failed to upload profile picture'}, {status: 500} as Response);
    } finally {
        // Déconnecter le client Prisma
        await prisma.$disconnect();
    }
}
