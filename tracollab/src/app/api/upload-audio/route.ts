import { Storage } from '@google-cloud/storage';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const serviceAccountKeyFile = path.join(process.cwd(), process.env.GC_KEY_PATH);
const bucketName = 'tracollab-storage'; // Update with your bucket name

// Disable body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  
    const form = await request.formData();
    const file = form.get("audioFile") as File;

    console.log(file);

    if (file.size < 1) {
        return new NextResponse(JSON.stringify(
            { error: "Audio file is empty" }),
            { status: 400 }
        );
    }

    try {
        const timestamp = Date.now();
        const fileExtension = path.extname(file.name);
        const uniqueId = uuidv4();
        const newFileName = `${timestamp}-${uniqueId}${fileExtension}`;
    
        const buffer = await file.arrayBuffer();
        const storage = new Storage({ keyFilename: serviceAccountKeyFile });
    
        const filePath = `instrumentals/${newFileName}`;
    
        // Upload the file to the specified folder in the bucket
        await storage.bucket(bucketName).file(filePath).save(Buffer.from(buffer), {
          resumable: false,
          contentType: file.type, // Set the correct MIME type
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

