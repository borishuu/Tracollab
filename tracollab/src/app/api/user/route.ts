import {PrismaClient} from '@prisma/client';
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function getUserData(req: NextRequest) {
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = req.cookies.get('authToken')?.value;

    try {
      const { payload } = await jwtVerify(token, secret);
      return payload.userId;
    } catch(error) {
      console.error("Error getting user data:");
      return NextResponse.json({error: "Error getting user data"});
    }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserData(req) as string;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Unable to fetch user data");
    return NextResponse.json({ error: "Error fetching user "});
  }
}