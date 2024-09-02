"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import FormattedDate from "@/components/formatDate";
import MusicPlayerWithImageManageSound from "@/components/MusicPlayerWithImageManageSound";
import MusicPlayerWithImage from "@/components/MusicPlayerWithImage";
import CommentValidate from "@/components/CommentValidate";
import CommentWithInteraction from "@/components/CommentWithInteraction";  // Assurez-vous que ce hook d'authentification fonctionne

export default function CommentsManagement() {
    const { name, id } = useParams();  // Utiliser `useParams()` correctement pour obtenir les paramètres
    const { user: loggedInUser } = useAuth();    // Récupération de l'utilisateur connecté
    const router = useRouter();                  // Pour rediriger si nécessaire

    const [post, setPost] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]); // État pour les commentaires
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
       /* if (!loggedInUser || loggedInUser.name !== name) {
            router.push('/login');
            return; // Assurez-vous de retourner ici pour éviter d'exécuter le reste du code.
        }*/

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

                // Fetch comments
                const commentsResponse = await fetch(`/api/posts/comments/${id}?publish=false`);
                const commentsData = await commentsResponse.json();

                if (commentsData.error) {
                    setError(commentsData.error);
                    return;
                }

                setComments(commentsData.comments);

            } catch (err) {
                console.error('Error fetching data:', err); // Log des erreurs dans la console
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }

        };

        fetchData(); // Appel de la fonction fetchData
    }, [loggedInUser, name, router]);


    return (
        <main className="min-h-screen flex flex-col">
            <div className="flex-grow bg-[#404040] px-4 lg:px-36 py-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start pt-6 w-full">
                        <div className="flex flex-col sm:flex-row items-center sm:space-x-4 mb-4 sm:mb-0 w-full">
                            <div className="flex-none flex items-center justify-center w-full sm:w-auto">
                                <div
                                    className="w-full max-w-[150px] aspect-square bg-red-400 rounded-3xl flex justify-center items-center">
                                    <img
                                        src={'/assets/default-profile.jpg'}
                                        alt="Profile picture"
                                        className="object-cover w-full h-full rounded-3xl"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col ml-0 sm:ml-4 text-white w-full">
                                <div className="text-3xl w-full p-1">
                                    {post?.sound.title ? post.sound.title : 'Unknown title'}
                                </div>
                                <div className="w-full p-1">
                                    Published on the {post?.date ?
                                    <FormattedDate dateString={post.date}/> : 'Unknown date'}
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="bg-[#C162EA] text-white p-4 rounded-3xl mt-10">
                        <div className="mt-4 space-y-4">
                            {post ? (
                                <div className="text-white mt-4">
                                    {post ? (
                                        <div className="text-white mt-4">
                                            {comments.length > 0 ? (
                                                comments.map((comment) => (
                                                    <CommentValidate key={comment.id} comment={comment}/>
                                                ))
                                            ) : (
                                                <p>No comments yet.</p>
                                            )}
                                        </div>
                                    ) : (
                                        <p>Loading comments...</p>
                                    )}
                                </div>
                            ) : (
                                <p>Loading comments...</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
