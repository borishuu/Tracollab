"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import FormattedDate from "@/components/formatDate";
import CommentValidate from "@/components/CommentValidate";

export default function CommentsManagement() {
    const { name, id } = useParams(); // Get the name and id from the URL
    const { user: loggedInUser } = useAuth(); // Get user logged from the context of authentication
    const router = useRouter();

    const [post, setPost] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const nameStr = Array.isArray(name) ? name[0] : name;
        const decodedName = nameStr ? decodeURIComponent(nameStr) : '';

        if (!loggedInUser || loggedInUser.name !== decodedName) {
             router.push('/login');
             return;
         }

        const fetchData = async () => {
            try {
                // Fetch post data
                const postResponse = await fetch(`/api/posts/${id}`);
                const postData = await postResponse.json();

                if (postData.error) {
                    setError(postData.error);
                    return;
                }

                setPost(postData.fetchedPost);

                // Fetch comments
                const commentsResponse = await fetch(`/api/posts/${id}/comments/?publish=false`);
                const commentsData = await commentsResponse.json();

                if (commentsData.error) {
                    setError(commentsData.error);
                    return;
                }
                setComments(commentsData.comments || []); // Ensure comments is always an array

            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <main className="min-h-screen flex flex-col">
            <div className="flex-grow bg-[#404040] px-4 lg:px-36 py-4">
                <div className="max-w-7xl mx-auto">
                    { /* Display the information of the sound */ }
                    <div className="flex flex-col sm:flex-row items-center sm:items-start pt-6 w-full">
                        <div className="flex flex-col sm:flex-row items-center sm:space-x-4 mb-4 sm:mb-0 w-full">
                            {/* Display the cover of the sound */}
                            <div className="flex-none flex items-center justify-center w-full sm:w-auto">
                                <div
                                    className="w-full max-w-[150px] aspect-square bg-red-400 rounded-3xl flex justify-center items-center">
                                    <img
                                        src={post && post.sound?.picture}
                                        alt="Profile picture"
                                        className="object-cover w-full h-full rounded-3xl"
                                    />
                                </div>
                            </div>

                            {/* Display the title and date of the sound */}
                            <div className="flex flex-col ml-0 sm:ml-4 text-white w-full">
                                <div className="text-3xl w-full p-1">
                                    <a href={`/TrackPage/${post?.id}`} className="hover:underline">
                                        {post && post.sound?.title}
                                    </a>
                                </div>
                                <div className="w-full p-1">
                                    Published on the <FormattedDate dateString={post?.date}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Display the comments */}
                    <div className="bg-[#C162EA] text-white p-4 rounded-3xl mt-10">
                        <div className="mt-4 space-y-4">
                            {loading ? (
                                <p>Loading comments...</p>
                            ) : error ? (
                                <p>{error}</p>
                            ) : comments.length > 0 ? (
                                comments.map((comment) => (
                                    <CommentValidate key={comment.id} comment={comment}/>
                                ))
                            ) : (
                                <p>There are currently no comments</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
