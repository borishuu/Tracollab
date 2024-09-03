import {PrismaClient} from '@prisma/client';
import { getUserData } from '../../user/route';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

type Params = {
    id: string
}

const REPORTS_TO_DELETE = 5;

export async function GET(req: NextRequest, context: { params: Params }) {
    const postId = context.params.id;

    try {
        const userId = await getUserData(req) as string;
  
        const retrievedPost = await prisma.post.findFirst({
          where: { id: postId },
          include: {
            reports: true,
        },
        });
      
        if (!retrievedPost) {
            return new NextResponse(JSON.stringify(
                { error: 'Post not found' }),
                { status: 404 }
            ); 
        }

        const userReport = await prisma.userReport.create({
          data: {
            user: { connect: { id: userId } },
            post: { connect: { id: postId } },
          }
        });

        const postReports = retrievedPost.reports.length + 1; // + 1 for the current report

        if (postReports >= REPORTS_TO_DELETE) {
          await prisma.post.delete({
            where: { id: postId }
          });

          return new NextResponse(JSON.stringify(
            { message: "Post reported and deleted due to excessive reports" }),
            { status: 200 }
          );
        }
        
        return new NextResponse(JSON.stringify(
            { message: "Post reported" }),
            { status: 200 }
        );
      } catch (error) {
          console.log(error);
          return new NextResponse(JSON.stringify(
              { error: "Server error" }),
              { status: 500 }
          );
  
      }
}