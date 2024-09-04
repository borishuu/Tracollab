"use client";

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import FormattedDate from "@/components/formatDate";
import { useAuth } from '@/context/authContext';
import MusicPlayerWithImageManageSound from "@/components/MusicPlayerWithImageManageSound";
import MusicPlayerWithImage from "@/components/MusicPlayerWithImage";

interface CommentCounts {
    instrumentals: { [key: string]: number };  // Mapping from post ID to comment count for instrumentals
    voices: { [key: string]: number };         // Mapping from post ID to comment count for voices
}

export default function ProfilePage() {
    const { name } = useParams(); // Get the username from the URL

    // State to store the user data
    const [user, setUser] = useState<any>(null);
    const [isUserNotFound, setIsUserNotFound] = useState(false); // Check if the user is found or not
    const [commentsCount, setCommentsCount] = useState<CommentCounts>({
        instrumentals: {},
        voices: {}
    }); // State to store the comment counts for each post
    const { user: loggedInUser } = useAuth(); // Get user logged from the context of authentication
    const [isCurrentUser, setIsCurrentUser] = useState(false); //Check if the logged user is the same as the viewed user


    useEffect(() => {
        async function fetchUser() {
            if (name) {
                try {
                    const res = await fetch(`/api/user/${name}`);
                    if (res.ok) {
                        const data = await res.json();
                        setUser(data);
                        if (loggedInUser && data && loggedInUser.name === data.userName) setIsCurrentUser(true);
                        else setIsCurrentUser(false);

                        // Fetch comment counts for each post
                        const instrumentalsCounts = await Promise.all(data.postsWithInstrumentals.map(async (post) => {
                            const response = await fetch(`/api/posts/comments/${post.id}?publish=false`);
                            const commentsData = await response.json();
                            return { id: post.id, count: Array.isArray(commentsData.comments) ? commentsData.comments.length : 0 };
                        }));

                        const voicesCounts = await Promise.all(data.postsWithVoices.map(async (post) => {
                            const response = await fetch(`/api/posts/comments/${post.id}?publish=false`);
                            const commentsData = await response.json();
                            return { id: post.id, count: Array.isArray(commentsData.comments) ? commentsData.comments.length : 0 };
                        }));

                        // Store the comment counts in the state
                        setCommentsCount({
                            instrumentals: instrumentalsCounts.reduce((acc, { id, count }) => ({ ...acc, [id]: count }), {}),
                            voices: voicesCounts.reduce((acc, { id, count }) => ({ ...acc, [id]: count }), {}),
                        });

                    } else {
                        setIsUserNotFound(true); // Set the user state if the user is not found
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

    // Handle the profile picture upload by user
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('profilePicture', file);

            try {
                const response = await fetch(`/api/user/${name}/picture`, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) window.location.reload();
                else console.error('Failed to upload profile picture');
            } catch (error) {
                console.error('Error uploading profile picture:', error);
            }
        }
    };

    // Handle the post deletion by the user
    const handlePostDeleted = (postId: string) => {
        if (user) {
            setUser(prevUser => ({
                ...prevUser,
                postsWithInstrumentals: prevUser.postsWithInstrumentals.filter(post => post.id !== postId),
                postsWithVoices: prevUser.postsWithVoices.filter(post => post.id !== postId)
            }));
        }
    };

    // If the user is not found, display a message
    if (isUserNotFound) {
        return (
            <div className="flex flex-col justify-center items-center h-screen text-5xl text-white">
                <div className="mb-4">
                    <img
                        src="/assets/sad-background.png"
                        alt="User not found"
                        style={{ width: '700px', height: 'auto' }}
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
                        <div className="flex flex-col sm:flex-row sm:items-start items-center sm:space-x-4 mb-4 sm:mb-0 w-full sm:w-auto">

                            {/* Display profile picture */ }
                            <div className="flex-none flex items-center justify-center">
                                <div className="w-full max-w-[150px] aspect-square bg-gray-400 rounded-3xl flex justify-center items-center">
                                    <img
                                        src={user?.profilePicture}
                                        alt="Profile picture"
                                        className="object-cover w-full h-full rounded-3xl"
                                    />
                                </div>
                            </div>

                            { /* Display user information */ }
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

                        { /* Display the edit profile picture and add instrumental buttons */ }
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
                                       Add instrumental
                                   </button>
                               </a>
                            </div>
                        )}
                    </div>

                    { /* Display instumentals of user with map */ }
                    <div className="bg-[#C162EA] text-white p-4 rounded-3xl mt-10">
                        <div className="text-4xl ml-5 mt-2">
                            Instrumental
                        </div>
                        <div className="mt-4 space-y-4">
                            {user?.postsWithInstrumentals.length > 0 ? (
                                user?.postsWithInstrumentals.map((post) => (
                                    <div key={post?.id} className="w-full">
                                        { isCurrentUser ? (
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

                    { /* Display voice-over of user with map */ }
                    <div className="bg-[#C162EA] text-white p-4 rounded-3xl mt-10">
                        <div className="text-4xl ml-5 mt-2">
                            Voice-over
                        </div>
                        <div className="mt-4 space-y-4">
                            {user?.postsWithVoices.length > 0 ? (
                                user?.postsWithVoices.map((post) => (
                                    <div key={post?.id} className="w-full">
                                        { isCurrentUser ? (
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
