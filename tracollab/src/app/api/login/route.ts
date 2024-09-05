import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { SignJWT } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

const secret = process.env.SECRET_KEY;
const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    const {email, password} = await request.json();

    try {
        if (!email || !password) {
            return new NextResponse(JSON.stringify(
                { error: "Please provice Credentials" }),
                { status: 400 } as Response
            );
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return new NextResponse(JSON.stringify(
                { error: 'Email or password incorrect' }),
                { status: 400 } as Response
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return new NextResponse(JSON.stringify(
                { error: 'Email or password incorrect' }),
                { status: 400 } as Response
            );
        }

        const jwtSecret = new TextEncoder().encode(secret);
        const token = await new SignJWT({ userId: user.id })
            .setProtectedHeader({ alg:"HS256" })
            .setExpirationTime('1h')
            .sign(jwtSecret);
        
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
        console.log(error);
        return new NextResponse(JSON.stringify(
            { error: 'Server Error' }),
            { status: 500 }
        );
    }
}

