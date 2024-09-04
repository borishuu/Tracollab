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
      console.error("Error getting user data:", error);
      return null;
    }

    /*const instrumentals = await prisma.instrumental.findMany();
    console.log(instrumentals);
    await prisma.$disconnect();

    return new Response(JSON.stringify(instrumentals), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });*/
}

export async function GET(req: NextRequest) {
  const userId = await getUserData(req) as string;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error fetching user "});
  }
}