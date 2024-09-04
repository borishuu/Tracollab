import {PrismaClient} from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import {getUserData} from "@/app/lib/getUserData";

const prisma = new PrismaClient();

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
