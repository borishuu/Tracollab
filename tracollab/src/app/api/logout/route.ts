import { NextResponse } from 'next/server';

export async function GET() {
    // Récupérer le cookie d'authentification
    const response = NextResponse.json({ message: "Logout Successful "});

    // Supprimer le cookie d'authentification
    response.cookies.delete("authToken");

    return response;
}
