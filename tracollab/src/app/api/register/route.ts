import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { SignJWT } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import { request } from 'http';

const secret = process.env.SECRET_KEY;
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const { email, username, password } = await req.json();
    
    try {
        if (!email || !username || !password ) {
            return new NextResponse(JSON.stringify(
                { error: "Please provide Credentials" }),
                { status: 400 }
            );
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return new NextResponse(JSON.stringify(
                { error: "Invalid email format" }),
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return new NextResponse(JSON.stringify(
                { error: "User already exists, please login" }),
                { status: 400 }
            );
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email: email,
                name: username,
                password: hashPassword,
                profilePicture: 'https://example.com/profile.jpg',
                joinDate: new Date()
            },
         });
      
          //const token = jwt.sign({ user: newUser }, SECRET_KEY, { expiresIn: '10h' });
      
          return new NextResponse(JSON.stringify(
            { message: "Profile created" }),
            { status: 200 }
        );

    } catch (error) {
        console.error("Registration Error:", error);
        return new NextResponse(JSON.stringify(
            { error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}