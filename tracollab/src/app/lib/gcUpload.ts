import {SaveOptions, Storage} from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const serviceAccountKeyFile = path.join(process.cwd(), process.env.GC_KEY_PATH || '');
const bucketName = 'tracollab-storage';

export async function uploadToGc(file: File, folder: string): Promise<string> {
    const timestamp = Date.now();
    const fileExtension = path.extname(file.name);
    const uniqueId = uuidv4();
    const newFileName = `${timestamp}-${uniqueId}${fileExtension}`;

    // Convertir le fichier en Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const storage = new Storage({ keyFilename: serviceAccountKeyFile });

    const filePath = `${folder}/${newFileName}`;

    // Enregistrer le fichier dans le bucket
    await storage.bucket(bucketName).file(filePath).save(buffer, {
        resumable: false,
        contentType: file.type,
    } as SaveOptions);

    // Retourner l'URL du fichier
    return `https://storage.googleapis.com/${bucketName}/${filePath}`;
}
