import bcrypt from 'bcrypt';
import {PrismaClient} from '@prisma/client';
import {NextRequest, NextResponse} from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    // Récupérer les données de la requête
    const {email, username, password} = await req.json();

    try {
        // Vérifier si les données sont présentes
        if (!email || !username || !password)
            return new NextResponse(JSON.stringify(
                    {error: "Please provide Credentials"}),
                {status: 400} as Response
            );

        // Vérifier si l'email est valide
        if (!/^\S+@\S+\.\S+$/.test(email))
            return new NextResponse(JSON.stringify(
                    {error: "Invalid email format"}),
                {status: 400} as Response
            );

        // Vérifier si un compte avec cet email existe déjà
        const existingUser = await prisma.user.findUnique({
            where: {email},
        });

        // Si un utilisateur existe déjà, retourner une erreur
        if (existingUser)
            return new NextResponse(JSON.stringify(
                    {error: "User already exists, please login"}),
                {status: 400} as Response
            );

        // Hasher le mot de passe
        const hashPassword = await bcrypt.hash(password, 10);

        // Créer un nouvel utilisateur
        await prisma.user.create({
            data: {
                email: email,
                name: username,
                password: hashPassword,
                profilePicture: 'https://storage.googleapis.com/tracollab-storage/images/default-profile.jpg',
                joinDate: new Date()
            },
        });

        return new NextResponse(JSON.stringify(
                {error: "Profile created"}), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            } as Response
        );
    } catch (error) {
        return new NextResponse(JSON.stringify(
                {error: "Internal Server Error"}),
            {status: 500} as Response
        );
    }
}
