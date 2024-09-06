import {NextResponse} from "next/server";

export async function GET(req: Request) {
    return new NextResponse(JSON.stringify({ message: 'Hello, world!' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      } as Response);
}
