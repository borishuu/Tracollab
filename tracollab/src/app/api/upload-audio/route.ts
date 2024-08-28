import { Storage } from '@google-cloud/storage';
import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
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

    const buffer = await file.arrayBuffer();
    const storage = new Storage({ keyFilename: serviceAccountKeyFile });
    console.log('before bucket');
    await storage.bucket(bucketName).file(file.name).save(Buffer.from(buffer));
    console.log('after bucket');

    return new NextResponse(JSON.stringify(
        { message: "Audio uploaded" }),
        { status: 200 }
    );

    //const form = new formidable.IncomingForm();


  /*form.parse(request, async (err, fields, files) => {
    if (err) {
      return new NextResponse(JSON.stringify({ error: 'Error parsing the file' }), { status: 500 });
    }

    const file = files.file[0] as formidable.File;

    try {
      // Upload file to Google Cloud Storage
      await uploadFileToGCS(file);

      return new NextResponse(JSON.stringify({ message: 'File uploaded successfully!' }), { status: 200 });
    } catch (error) {
      console.error('Error uploading file:', error);
      return new NextResponse(JSON.stringify({ error: 'Error uploading file' }), { status: 500 });
    }
  });*/
}

/*async function uploadFileToGCS(file: formidable.File) {
  const bucket = storage.bucket(bucketName);
  const gcsFile = bucket.file(file.originalFilename || file.newFilename);

  return new Promise((resolve, reject) => {
    fs.createReadStream(file.filepath)
      .pipe(gcsFile.createWriteStream({ resumable: false, contentType: file.mimetype }))
      .on('finish', resolve)
      .on('error', reject);
  });
}*/
