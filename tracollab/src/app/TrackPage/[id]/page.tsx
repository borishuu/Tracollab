'use client';

import {useParams} from 'next/navigation';
import {useEffect, useState} from 'react';
import PostButton from "@/components/PostButton";
import CommentWithInteraction from "@/components/CommentWithInteraction";
import LikeReport from "@/components/LikeReport";
import MusicPlayerWithImage from "@/components/MusicPlayerWithImage";
import {useAuth} from '@/context/authContext';

export default function PostPage() {
    const {id} = useParams();
    const [post, setPost] = useState<any>(null);
    const [likesCount, setLikesCount] = useState<number | null>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState('');
    const {user} = useAuth();
    const [audio, setAudio] = useState<File | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        const fetchData = async () => {
            try {


                const postResponse = await fetch(`/api/posts/${id}`);
                const postData = await postResponse.json();

                if (postData.error) {
                    setError(postData.error);
                    return;
                }

                setPost(postData);
                console.log('Post récupéré:', postData);

                const likesResponse = await fetch(`/api/posts/likes/${id}`);
                const likesData = await likesResponse.json();

                console.log('test likesResponse: ', likesResponse);
                console.log('test likesData: ', likesData);

                if (likesData.error) {
                    setError(likesData.error);
                    return;
                }


                setLikesCount(likesData.likesCount);

                const commentsResponse = await fetch(`/api/posts/comments/${id}`);
                const commentsData = await commentsResponse.json();

                if (commentsData.error) {
                    setError(commentsData.error);
                    return;
                }

                const sortedComments = commentsData.comments.sort((a: any, b: any) =>
                    sortOrder === 'desc'
                        ? b.id.localeCompare(a.id)
                        : a.id.localeCompare(b.id)
                );

                setComments(sortedComments);
                console.log('Commentaires récupérés:', sortedComments);
            } catch (err) {
                setError('Error fetching data');
                console.error('Erreur lors de la récupération des données:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id, sortOrder]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const fetchComments = async () => {
        try {

            const commentsResponse = await fetch(`/api/posts/comments/${id}`);
            const commentsData = await commentsResponse.json();

            if (commentsData.error) {
                setError(commentsData.error);
                return;
            }

            // Trier les commentaires en fonction de l'état de tri
            const sortedComments = commentsData.comments.sort((a: any, b: any) =>
                sortOrder === 'desc'
                    ? b.id.localeCompare(a.id)
                    : a.id.localeCompare(b.id)
            );

            setComments(sortedComments);
            console.log('Commentaires récupérés:', sortedComments);
        } catch (err) {
            setError('Error fetching data');
            console.error('Erreur lors de la récupération des données:', err);
        }
    };


    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setAudio(file ?? null);
        console.log('Fichier MP3 sélectionné:', file);
    }

    const handlePostComment = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!user) {
            alert("You must be logged in to post a comment.");
            return;
        }

        const sanitizedContent = inputValue.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        try {
            const formData = new FormData();
            formData.append('userId', user.id);
            formData.append('content', sanitizedContent);
            if (audio) {
                formData.append('audioFile', audio);
            }

            const response = await fetch(`/api/posts/${id}/comments`, {
                method: 'POST',
                body: formData as unknown as BodyInit,
            });

            if (!response.ok) {
                throw new Error('Failed to post comment');
            }

            // Après la création du commentaire, on récupère de nouveau tous les commentaires
            fetchComments();

            setInputValue('');
            setAudio(null); // Réinitialiser l'audio après l'envoi
        } catch (error) {
            console.error('Erreur lors de la publication du commentaire:', error);
        }
    };


    const handleSortToggle = () => {
        setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
    };

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
                            {post && user && (
                                <LikeReport
                                    postId={post.id}
                                    initialLikesCount={likesCount || 0}
                                    userId={user.id}
                                />
                            )}


                        </div>
                    </div>
                    <div className="text-white bg-[#C162EA] mb-4 p-4 rounded-3xl break-words">
                        <p>{post?.description}</p>
                    </div>




                    <div className="w-full bg-[#9732C2] flex rounded-3xl">
                        <div className="w-1/12 flex items-center justify-center">
                            <img
                                src="/assets/sort.png"
                                className="h-6 object-contain cursor-pointer"
                                onClick={handleSortToggle}
                                alt="Sort"
                            />
                        </div>

                        <form onSubmit={handlePostComment} className="flex-1 h-full pt-2 pb-2">
                            <div className="sm:w-11/12 md:w-11/12">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    className="w-full h-8 mb-2 pl-4 rounded-full"
                                />


                            <div className="flex items-center">
                                <input
                                    type="text"
                                    className="flex-grow  pl-4 h-8 border border-gray-300 rounded-bl-full rounded-tl-full shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-700"
                                    readOnly
                                    value={audio ? audio.name : ''}
                                />
                                <label
                                    className="flex items-center justify-center px-4 py-2 bg-[#E5D5D5] text-white rounded-tr-full rounded-br-full hover:bg-[#c9a7a7] focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer transition-transform transform hover:scale-105">
                                    <img
                                        src="/assets/upload.png"
                                        alt="Upload file"
                                        className="h-4 w-6 object-contain"
                                    />
                                    <input
                                        type="file"
                                        accept="audio/mp3"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        name="audioFile"
                                    />
                                </label>
                                <button
                                    className="ml-2 px-6 py-2 bg-[#C162EA] text-white rounded-full hover:bg-[#7716a1] focus:outline-none focus:ring-2 focus:ring-green-300">
                                    Post
                                </button>
                            </div>
                            </div>




                        </form>
                    </div>

                    {post ? (
                        <div className="text-white mt-4">
                            {comments.length > 0 ? (
                                comments.map((comment) => (
                                    <CommentWithInteraction key={comment.id} comment={comment}/>
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
