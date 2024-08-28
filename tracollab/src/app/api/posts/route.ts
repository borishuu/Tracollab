import {PrismaClient} from '@prisma/client';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient();

const storageFolder = "https://storage.googleapis.com/tracollab-storage/",
    instrumentalsFolder = storageFolder + "instrumentals/",
    imagesFolder = storageFolder + "images/";

export async function GET(req: Request) {
    
    const instrumentals = await prisma.post.findMany();
    await prisma.$disconnect();

    return new Response(JSON.stringify(instrumentals), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
}

export async function POST(req: NextRequest) {
  const postData = await req.json();
  const pic = postData.picture;
  const genreId = postData.genreId;
  const type = postData.type;
  const text = postData.text;
  const audio = postData.audio;
}