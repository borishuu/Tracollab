import {NextRequest, NextResponse} from "next/server";
import {uploadToGc} from "@/lib/gcUpload";

export async function POST(req: NextRequest) {
    try {
        // Récupérer le fichier audio depuis le formulaire
        const form = await req.formData();
        const audioFile = form.get('audioFile') as File;

        // Vérifier si le fichier existe
        if (!audioFile)
            return NextResponse.json({error: 'File not found'}, {status: 400} as Response);

        // Uploader le fichier sur Google Cloud Storage et récupérer l'URL
        const fileUrl = await uploadToGc(audioFile, 'voices');

        // Retourner l'URL dans la réponse JSON
        return NextResponse.json({url: fileUrl}, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        } as Response);
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500} as Response);
    }
}
