import {PrismaClient} from '@prisma/client';
import { Storage } from '@google-cloud/storage';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getUserData } from '../user/route';
import path from 'path';

const serviceAccountKeyFile = path.join(process.cwd(), process.env.GC_KEY_PATH);
const bucketName = 'tracollab-storage';

export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

async function uploadToGc(file, folder) {
  const timestamp = Date.now();
  const fileExtension = path.extname(file.name);
  const uniqueId = uuidv4();
  const newFileName = `${timestamp}-${uniqueId}${fileExtension}`;

  const buffer = await file.arrayBuffer();
  const storage = new Storage({ keyFilename: serviceAccountKeyFile });

  const filePath = `${folder}/${newFileName}`;

  await storage.bucket(bucketName).file(filePath).save(Buffer.from(buffer), {
    resumable: false,
    contentType: file.type, // Set the correct MIME type
  });

  const publicUrl = `https://storage.googleapis.com/${bucketName}/${filePath}`;

  return publicUrl;
}

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
    const form = await req.formData();
    const audioFile = form.get("audioFile") as File;
    const imageFile = form.get("imageFile") as File;
    const title = form.get('title');
    const type = form.get('type');
    const text = form.get('text');

    try {
      const userId = await getUserData(req) as string;

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        }
      });

      if (audioFile.size < 1 || imageFile.size < 1) {
        return new NextResponse(JSON.stringify(
            { error: "Some files are empty" }),
            { status: 500 }
        );
      }

      const audioUrl = await uploadToGc(audioFile, 'instrumentals');
      const imgUrl = await uploadToGc(imageFile, 'images');

      return new NextResponse(JSON.stringify(
          { message: "Audio uploaded" }),
          { status: 200 }
      );
    } catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify(
            { error: "Server error" }),
            { status: 500 }
        );

    }
}