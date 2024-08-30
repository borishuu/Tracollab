'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PostButton from "@/components/PostButton";
import CommentWithInteraction from "@/components/CommentWithInteraction";
import LikeReport from "@/components/LikeReport";
import MusicPlayerWithImage from "@/components/MusicPlayerWithImage";
import UploadSection from "@/components/UploadSection ";

export default function PostPage() {
    const { id } = useParams();
    const [post, setPost] = useState<any>(null);
    const [likesCount, setLikesCount] = useState<number | null>(null);
    const [comments, setComments] = useState<any[]>([]); // État pour les commentaires
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch post data
                const postResponse = await fetch(`/api/posts/${id}`);
                const postData = await postResponse.json();

                if (postData.error) {
                    setError(postData.error);
                    return;
                }

                setPost(postData);

                // Fetch likes count
                const likesResponse = await fetch(`/api/posts/likes/${id}`);
                const likesData = await likesResponse.json();

                if (likesData.error) {
                    setError(likesData.error);
                    return;
                }

                setLikesCount(likesData.likesCount);

                // Fetch comments
                const commentsResponse = await fetch(`/api/posts/comments/${id}`);
                const commentsData = await commentsResponse.json();

                if (commentsData.error) {
                    setError(commentsData.error);
                    return;
                }

                setComments(commentsData.comments);

            } catch (err) {
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <main>
            <div className="pl-12 pr-12 pt-4 pb-12 bg-[#404040] h-full">
                <div className="lg:pl-12 lg:ml-24 sm:ml-0 sm:mr-0 lg:mr-24 lg:pr-12 lg:pt-3">
                    <div className="w-full flex flex-row">
                        <div className="w-full md:w-10/12">
                            {post && <MusicPlayerWithImage post={post}/>}
                        </div>

                        <div
                            className="flex justify-center items-center sm:justify-center sm:items-center md:w-2/12 md:mt-12 md:justify-start md:items-start lg:mt-12 sm:mt-2">
                            {post && <LikeReport likesCount={likesCount ?? 0}/>}
                        </div>


                    </div>

                    <div className="text-white bg-[#C162EA] mb-4 p-4 rounded-3xl break-words">
                        <p>Description: {post?.description}</p>
                    </div>

                    <div className="w-full bg-[#9732C2] flex p-2 rounded-3xl">
                        <div className="w-1/12 flex items-center justify-center">
                            <img
                                src="/assets/sort.png"
                                className="h-6 object-contain"
                            />
                        </div>

                        <div className="sm:w-12/12 md:w-10/12">
                            <UploadSection />
                        </div>

                        <div className="w-2/12 ml-auto flex items-center justify-center">
                            <PostButton />
                        </div>
                    </div>

                    {post ? (
                        <div className="text-white mt-4">
                            {comments.length > 0 ? (
                                comments.map((comment) => (
                                    <Comment key={comment.id} comment={comment} />
                                ))
                            ) : (
                                <p>No comments yet.</p>
                            )}
                        </div>
                    ) : (
                        <p>Loading comments...</p>
                    )}
                </div>
            </div>
        </main>
    );
}
