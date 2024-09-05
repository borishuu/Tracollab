import {PrismaClient} from '@prisma/client';
import {NextRequest, NextResponse} from 'next/server';
import {cookies} from "next/headers";
import {jwtVerify} from "jose";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        let userId;

        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        const token = req.cookies.get('authToken')?.value;

        try {
            const {payload} = await jwtVerify(token, secret);
            userId = payload.userId;
        } catch (error) {
            console.error("Error getting user data");
            return new NextResponse(JSON.stringify(
                {error: "User not authenticated"}
            ), {status: 400});
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            }
        });

        return NextResponse.json(user, {status: 200} as Response);
    } catch (error) {
        console.error("Unable to fetch user data: ", error);
        return NextResponse.json({error: "Error fetching user "});
    }
}
