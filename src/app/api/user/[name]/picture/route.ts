import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getUserData} from "@/app/lib/getUserData";
import {uploadToGc} from "@/app/lib/gcUpload";

const prisma = new PrismaClient();

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
