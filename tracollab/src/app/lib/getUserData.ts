import {NextRequest} from "next/server";
import {jwtVerify} from "jose";
import {cookies} from "next/headers";

export async function getUserData(req: NextRequest) {

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = cookies["authToken"];

    try {
      const { payload } = await jwtVerify(token, secret);
      return payload.userId;
    } catch(error) {
      console.error("Error getting user data");
      return null;
    }
}
