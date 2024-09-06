"use client";

import {useParams} from 'next/navigation';
import React, {useEffect, useState} from 'react';
import FormattedDate from "@/components/formatDate";
import {useAuth} from '@/context/authContext';
import MusicPlayerWithImageManageSound from "@/components/MusicPlayerWithImageManageSound";
import MusicPlayerWithImage from "@/components/MusicPlayerWithImage";

interface CommentCounts {
    instrumentals: { [key: string]: number };
    voices: { [key: string]: number };
}

export default function ProfilePage() {
    // Récupérer le nom de l'utilisateur dans l'URL
    const {name} = useParams();

    // Référence au contexte d'authentification
    const {user: loggedInUser} = useAuth();

    const [user, setUser] = useState<any>(null);
    const [isUserNotFound, setIsUserNotFound] = useState(false);
    const [commentsCount, setCommentsCount] = useState<CommentCounts>({
        instrumentals: {},
        voices: {}
    });
    // Permet de vérifier si l'utilisateur connecté est le même que l'utilisateur dont on affiche le profil
    const [isCurrentUser, setIsCurrentUser] = useState(false);

    useEffect(() => {
        // Fonction pour récupérer les informations de l'utilisateur
        async function fetchUser() {
            // Vérifier si le nom de l'utilisateur est défini
            if (name) {
                try {
                    // Récupérer les informations de l'utilisateur
                    const res = await fetch(`/api/user/${name}`);

                    // Vérifier si la requête a réussi
                    if (res.ok) {
                        const data = await res.json();
                        setUser(data);

                        // Vérifier si l'utilisateur connecté est le même que l'utilisateur dont on affiche le profil
                        if (loggedInUser && data && loggedInUser.name === data.userName)
                            setIsCurrentUser(true);
                        else
                            setIsCurrentUser(false);

                        // Récupérer le nombre de commentaires pour chaque post
                        const instrumentalsCounts = await Promise.all(data.postsWithInstrumentals.map(async (post) => {
                            const response = await fetch(`/api/posts/${post.id}/comments/?publish=false`);
                            const commentsData = await response.json();
                            return {
                                id: post.id,
                                count: Array.isArray(commentsData.comments) ? commentsData.comments.length : 0
                            };
                        }));

                        // Récupérer le nombre de commentaires pour chaque post
                        const voicesCounts = await Promise.all(data.postsWithVoices.map(async (post) => {
                            const response = await fetch(`/api/posts/${post.id}/comments/?publish=false`);
                            const commentsData = await response.json();
                            return {
                                id: post.id,
                                count: Array.isArray(commentsData.comments) ? commentsData.comments.length : 0
                            };
                        }));

                        // Mettre à jour le nombre de commentaires pour chaque post
                        setCommentsCount({
                            instrumentals: instrumentalsCounts.reduce((acc, {id, count}) => ({
                                ...acc,
                                [id]: count
                            }), {}),
                            voices: voicesCounts.reduce((acc, {id, count}) => ({...acc, [id]: count}), {}),
                        });
                    } else {
                        setIsUserNotFound(true);
                        setUser(null);
                    }
                } catch (error) {
                    console.error('Error fetching user:', error);
                    setIsUserNotFound(true);
                }
            }
        }

        fetchUser();
    }, [name, loggedInUser]);

    // Fonction pour gérer l'upload de l'image de profil
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // Récupérer le fichier sélectionné
        const file = e.target.files?.[0];

        // Vérifier si le fichier est défini
        if (file) {
            // Créer un objet FormData pour envoyer le fichier
            const formData = new FormData();
            formData.append('profilePicture', file);

            try {
                // Envoyer la requête pour mettre à jour l'image de profil
                const response = await fetch(`/api/user/${name}/picture`, {
                    method: 'POST',
                    body: formData,
                } as Response);

                // Vérifier si la requête a réussi
                if (response.ok)
                    window.location.reload();
                else
                    console.error('Failed to upload profile picture');
            } catch (error) {
                console.error('Error uploading profile picture:', error);
            }
        }
    };

    // Fonction pour gérer la suppression d'un post
    const handlePostDeleted = (postId: string) => {
        if (user) {
            setUser(prevUser => ({
                ...prevUser,
                postsWithInstrumentals: prevUser.postsWithInstrumentals.filter(post => post.id !== postId),
                postsWithVoices: prevUser.postsWithVoices.filter(post => post.id !== postId)
            }));
        }
    };

    // Afficher un message si l'utilisateur n'existe pas
    if (isUserNotFound) {
        return (
            <div className="flex flex-col justify-center items-center h-screen text-5xl text-white">
                <div className="mb-4">
                    <img
                        src="/assets/sad-background.png"
                        alt="User not found"
                        style={{width: '700px', height: 'auto'}}
                    />
                </div>
                <div>
                    Oh no! This user does not exist.
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen flex flex-col">
            <div className="flex-grow bg-[#404040] px-4 lg:px-36 py-4">
                <div className="max-w-7xl mx-auto">
                    {/* User profile section */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start pt-6">
                        <div
                            className="flex flex-col sm:flex-row sm:items-start items-center sm:space-x-4 mb-4 sm:mb-0 w-full sm:w-auto">

                            {/* Profile picture */}
                            <div className="flex-none flex items-center justify-center">
                                <div
                                    className="w-full max-w-[150px] aspect-square bg-gray-400 rounded-3xl flex justify-center items-center">
                                    <img
                                        src={user?.profilePicture}
                                        alt="Profile picture"
                                        className="object-cover w-full h-full rounded-3xl"
                                    />
                                </div>
                            </div>

                            { /* User information */}
                            <div className="flex flex-col ml-0 sm:ml-4 text-white text-center sm:text-left">
                                <div className="text-3xl w-full max-w-xs p-1">
                                    {user?.userName}
                                </div>
                                <div className="w-full max-w-xs p-1">
                                    Joined on the <FormattedDate dateString={user?.joinDate}/><br/>
                                    Instrumentals posted: {user?.instrumentalCount}<br/>
                                    Voice-over posted: {user?.voiceOverCount}
                                </div>
                            </div>
                        </div>

                        { /* Edit profile picture and add instrumental buttons */}
                        {isCurrentUser && (
                            <div className="flex flex-col space-y-2 sm:w-auto sm:ml-auto">
                                <label className="w-full max-w-xs bg-[#C162EA] hover:bg-[#9732C2] text-white rounded-full
                                text-lg cursor-pointer text-center flex items-center justify-center py-2 px-4">
                                    Edit profile picture
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                                <a href="/post-upload" className="w-full max-w-xs">
                                    <button
                                        className="w-full bg-[#C162EA] text-white rounded-full text-lg
                                       hover:bg-[#9732C2] focus:outline-none focus:ring-2 focus:ring-green-300
                                        py-2 px-4 flex items-center justify-center">
                                        Add new post
                                    </button>
                                </a>
                            </div>
                        )}
                    </div>

                    { /* Instrumentals of User with map */}
                    <div className="bg-[#C162EA] text-white p-4 rounded-3xl mt-10">
                        <div className="text-4xl ml-5 mt-2">
                            Instrumental
                        </div>
                        <div className="mt-4 space-y-4">
                            {user?.postsWithInstrumentals.length > 0 ? (
                                user?.postsWithInstrumentals.map((post) => (
                                    <div key={post?.id} className="w-full">
                                        {isCurrentUser ? (
                                            <MusicPlayerWithImageManageSound
                                                post={post}
                                                onPostDeleted={handlePostDeleted}
                                                userName={user?.userName}
                                                commentsCount={commentsCount.instrumentals[post?.id] || 0}
                                            />
                                        ) : (
                                            <MusicPlayerWithImage
                                                post={post}
                                            />
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="ml-5 mt-3">No instrumentals available.</p>
                            )}
                        </div>
                    </div>

                    { /* Voice-over of User with map */}
                    <div className="bg-[#C162EA] text-white p-4 rounded-3xl mt-10">
                        <div className="text-4xl ml-5 mt-2">
                            Voice-over
                        </div>
                        <div className="mt-4 space-y-4">
                            {user?.postsWithVoices.length > 0 ? (
                                user?.postsWithVoices.map((post) => (
                                    <div key={post?.id} className="w-full">
                                        {isCurrentUser ? (
                                            <MusicPlayerWithImageManageSound
                                                post={post}
                                                onPostDeleted={handlePostDeleted}
                                                userName={user?.userName}
                                                commentsCount={commentsCount.voices[post?.id] || 0}
                                            />
                                        ) : (
                                            <MusicPlayerWithImage
                                                post={post}
                                            />
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="ml-5 mt-3">No voice-overs available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
