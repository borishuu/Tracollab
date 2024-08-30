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
  try {
    const posts = await prisma.post.findMany({
      include: {
          sound: {
              include: {
                  genre: true,
              },
          },
          user: true,
          comments: true,
          likes: true,
          reports: true
      },
    });

    console.log("genre: ", posts[0]);

    // Send the posts data back as a JSON response
    return new Response(JSON.stringify(posts), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
  } catch (error) {
      console.error('Error fetching posts:', error);
      return new Response(JSON.stringify({error: 'Internal Server Error'}), {
          status: 500,
          headers: {
              'Content-Type': 'application/json',
          },
      });
  } finally {
      await prisma.$disconnect();
  }
}

export async function POST(req: NextRequest) {
    const form = await req.formData();
    const audioFile = form.get("audioFile") as File;
    const imageFile = form.get("imageFile") as File;
    const title = form.get('title') as string;
    const type = form.get('type') as string;
    const genreName = form.get('genre') as string;
    const text = form.get('text') as string;

    try {
      const userId = await getUserData(req) as string;

      if (audioFile.size < 1 || imageFile.size < 1) {
        return new NextResponse(JSON.stringify(
            { error: "Some files are empty" }),
            { status: 500 }
        );
      }

      const genre = await prisma.genre.findFirst({where: {name: genreName}});

      if (!genre) {
        return new NextResponse(JSON.stringify(
          { error: "Invalid genre selected" }),
          { status: 400 }
        );
      }

      if (type !== "Instrumental" && type !== "Voice") {
        return new NextResponse(JSON.stringify(
          { error: "Invalid type selected" }),
          { status: 400 }
        );
      }

      const audioUrl = await uploadToGc(audioFile, 'instrumentals');
      const imgUrl = await uploadToGc(imageFile, 'images');

      const sound = await prisma.sound.create({
        data: {
          title: title,
          audioPath: audioUrl,
          picture: imgUrl,
          genreId: genre.id,
        },
      });

      switch(type) {
        case "Instrumental":
          await prisma.instrumental.create({
            data: {
              soundId: sound.id,
            },
          });
          break;
        case "Voice":
          await prisma.voice.create({
            data: {
              soundId: sound.id,
            },
          });
          break;
      }

      const post = await prisma.post.create({
        data: {
          description: text,
          user: { connect: { id: userId } },
          sound: { connect: { id: sound.id } },
        },
      });

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
