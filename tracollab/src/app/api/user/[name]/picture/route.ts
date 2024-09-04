import { PrismaClient } from '@prisma/client';
import {SaveOptions, Storage} from '@google-cloud/storage';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getUserData} from "@/app/lib/getUserData";
import path from 'path';

const serviceAccountKeyFile = path.join(process.cwd(), process.env.GC_KEY_PATH);
const bucketName = 'tracollab-storage';

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
        contentType: file.type,
    } as SaveOptions);

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${filePath}`;

    return publicUrl;
}

export async function POST(req: NextRequest) {
    const form = await req.formData();
    const imageFile = form.get("profilePicture") as File;

    try {
        const userId = await getUserData(req) as string;

        if (imageFile.size < 1) {
            return new NextResponse(JSON.stringify(
                { error: "Please upload a valid picture." }
            ), { status: 400 });
        }

        // Upload image to GC
        const url = await uploadToGc(imageFile, 'images');

        // Update user
        const user = await prisma.user.update({
            where: { id: userId },
            data: { profilePicture: url },
        });

        return NextResponse.json({ user, profilePicture: url });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        return NextResponse.json(
            { error: 'Failed to upload profile picture' },
            { status: 500 }
        );
    }
}
