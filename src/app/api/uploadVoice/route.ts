import {NextRequest, NextResponse} from "next/server";
import {uploadToGc} from "@/app/lib/gcUpload";

export async function POST(req: NextRequest) {
    try {
        const form = await req.formData();
        const audioFile = form.get('audioFile') as File;

        if (!audioFile) {
            return NextResponse.json({ error: 'File not found' }, { status: 400 } as Response);
        }

        // Appeler la fonction d'upload et obtenir l'URL
        const fileUrl = await uploadToGc(audioFile, 'voices');

        // Retourner l'URL dans la réponse JSON
        return NextResponse.json({ url: fileUrl }, { status: 200 } as Response);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 } as Response);
    }
}
