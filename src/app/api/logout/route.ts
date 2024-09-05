import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { SignJWT } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

const secret = process.env.SECRET_KEY;
const prisma = new PrismaClient();

export async function GET() {
    
    /*const response = new NextResponse(JSON.stringify(
        { message: "Logout Successful" }),
        { status: 200 }
    );*/

    const response = NextResponse.json({ message: "Logout Successful "});

    response.cookies.delete("authToken");

    return response;
}

