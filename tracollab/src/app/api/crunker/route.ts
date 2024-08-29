import {Storage} from '@google-cloud/storage';
import {PrismaClient} from '@prisma/client';
import {v4 as uuidv4} from 'uuid';
import path from "path";
import {NextRequest} from "next/server";
import {Lame} from "node-lame";

const prisma = new PrismaClient();

const serviceAccountKeyFile = path.join(process.cwd(), process.env.GC_KEY_PATH || '');
const bucketName = 'tracollab-storage';

export const config = {
    api: {
        bodyParser: false,
    },
};

async function uploadToGc(file: any, folder: string): Promise<string> {
    const timestamp = Date.now();
    const fileExtension = path.extname(file.name);
    const uniqueId = uuidv4();
    const newFileName = `${timestamp}-${uniqueId}${fileExtension}`;
    const buffer = await file.arrayBuffer();

    const storage = new Storage({keyFilename: serviceAccountKeyFile});
    const filePath = `${folder}/${newFileName}`;

    // Construction des options avec typecast
    const options = {
        resumable: false,
        contentType: file.type as string, // Cast explicite du type
    };

    // Utilisation de `as any` pour forcer l'assignation
    await storage.bucket(bucketName).file(filePath).save(Buffer.from(buffer), options as any);

    return `https://storage.googleapis.com/${bucketName}/${filePath}`;
}

export async function POST(req: NextRequest) {
    // Manipule la requête et appelle `uploadToGc`
    const form = await req.formData();

    // Utilisation de `as File` pour forcer le type
    const file = form.get('file') as File;

    // Récupération du buffer du fichier
    const buffer = Buffer.from(await file.arrayBuffer());

    const Lame = require("node-lame").Lame;

    // Création de l'encodeur Lame avec les options souhaitées (bitrate, etc.)
    const encoder = new Lame({
        output: "buffer",
        bitrate: 192,
    }).setBuffer(buffer);

    const output = await encoder.encode();

    const newFile = new File([output], 'merged-audio.mp3', {
        type: 'audio/mp3'
    });

    console.log('Uploading to GC...');

    await uploadToGc(newFile, 'voices');
}
