import bcrypt from 'bcrypt';
import {PrismaClient} from '@prisma/client';
import {SignJWT} from 'jose';
import {NextRequest, NextResponse} from 'next/server';

const secret = process.env.SECRET_KEY;
const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    // Récupérer les informations de connexion de la requête
    const {email, password} = await request.json();

    try {
        // Vérifier si les informations de connexion sont fournies
        if (!email || !password)
            return new NextResponse(JSON.stringify(
                    {error: "Please provice Credentials"}),
                {status: 400} as Response
            );

        // Récupérer l'utilisateur de la base de données
        const user = await prisma.user.findUnique({
            where: {email},
        });

        // Vérifier si l'utilisateur existe
        if (!user)
            return new NextResponse(JSON.stringify(
                    {error: 'Email or password incorrect'}),
                {status: 400} as Response
            );

        // Vérifier si le mot de passe est valide
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // Retourner une erreur si le mot de passe n'est pas valide
        if (!isPasswordValid)
            return new NextResponse(JSON.stringify(
                    {error: 'Email or password incorrect'}),
                {status: 400} as Response
            );

        // Créer un token JWT pour l'utilisateur
        const jwtSecret = new TextEncoder().encode(secret);
        const token = await new SignJWT({userId: user.id})
            .setProtectedHeader({alg: "HS256"})
            .setExpirationTime('1h')
            .sign(jwtSecret);

        // Retourner une réponse avec le token JWT
        const response = NextResponse.json({message: "Login Successful!"});
        response.cookies.set({
            name: "authToken",
            value: token,
            path: '/',
            httpOnly: true,
            maxAge: 3600,
            secure: true
        } as any);

        return response;
    } catch (error) {
        return new NextResponse(JSON.stringify({error: 'Internal server error'}),
            {status: 500} as Response,
        );
    }
}
