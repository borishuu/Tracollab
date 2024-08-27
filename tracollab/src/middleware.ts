import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
const secret = new TextEncoder().encode(process.env.SECRET_KEY);

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isPublicPath = path === '/' || path === '/register';
    const token = req.cookies.get('authToken')?.value;

    if (!token && !isPublicPath) {
        return NextResponse.redirect(new URL('/', req.url));
    } else if (token) {
        try {
            const { payload } = await jwtVerify(token, secret);
            const tokenExpiration = new Date(payload.exp * 1000);

            if (tokenExpiration <= new Date()) {
                return NextResponse.redirect(new URL('/', req.url));
            }
        
            if (isPublicPath) {
                return NextResponse.next();
            }
        } catch (error) {
            return NextResponse.redirect(new URL('/', req.url));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/', '/register'
    ]
}