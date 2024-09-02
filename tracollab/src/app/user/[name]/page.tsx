"use client";

import { useParams } from 'next/navigation';
import MusicPlayerWithImageManageSound from "@/components/MusicPlayerWithImageManageSound";
import React, { useEffect, useState, useRef } from 'react';
import FormattedDate from "@/components/formatDate";
import { useAuth } from '@/context/authContext';
import MusicPlayerWithImage from "@/components/MusicPlayerWithImage";

export default function ProfilePage() {
    const { name } = useParams();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);  // State to handle loading
    const [isUserNotFound, setIsUserNotFound] = useState(false);  // State to handle if user not found
    const fileInputRef = useRef(null);
    const { user: loggedInUser } = useAuth();
    const [isCurrentUser, setIsCurrentUser] = useState(false);  // Check if it's the profile of current logged user

    useEffect(() => {
        async function fetchUser() {
            setIsLoading(true);

            if (name) {
                try {
                    const res = await fetch(`/api/user/${name}`);
                    if (res.ok) {
                        const data = await res.json();
                        setUser(data);

                        if (loggedInUser && data && loggedInUser.name === data.userName) setIsCurrentUser(true);
                        else setIsCurrentUser(false);
                    } else {
                        setIsUserNotFound(true);
                        setUser(null);
                    }
                } catch (error) {
                    console.error('Error fetching user:', error);
                    setIsUserNotFound(true);
                }
            }
            setIsLoading(false);  // Stop loading
        }

        fetchUser();
    }, [name, loggedInUser]);

    const handleEditProfilePictureClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('profilePicture', file);

            try {
                const response = await fetch('/api/uploadProfilePicture', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    console.log('Profile picture uploaded successfully');
                } else {
                    console.error('Failed to upload profile picture');
                }
            } catch (error) {
                console.error('Error uploading profile picture:', error);
            }
        }
    };

    const handlePostDeleted = (postId) => {
        if (user) {
            setUser(prevUser => ({
                ...prevUser,
                postsWithInstrumentals: prevUser.postsWithInstrumentals.filter(post => post.id !== postId),
                postsWithVoices: prevUser.postsWithVoices.filter(post => post.id !== postId)
            }));
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen text-5xl">
                Loading...
            </div>
        );
    }

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
                    <div className="flex flex-col sm:flex-row items-center sm:items-start pt-6">
                        <div
                            className="flex flex-col sm:flex-row items-center sm:space-x-4 mb-4 sm:mb-0 w-full sm:w-auto">
                            <div className="flex-none flex items-center justify-center">
                                <div
                                    className="w-full max-w-[150px] aspect-square bg-red-400 rounded-3xl flex justify-center items-center">
                                    <img
                                        src={user.profilePictureUrl || '/assets/default-profile.jpg'}
                                        alt="Profile picture"
                                        className="object-cover w-full h-full rounded-3xl"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col ml-0 sm:ml-4 text-white">
                                <div className="text-3xl w-full max-w-xs p-1">
                                    {user.userName}
                                </div>
                                <div className="w-full max-w-xs p-1">
                                    Joined on the <FormattedDate dateString={user.joinDate} /><br/>
                                    Instrumentals posted: {user.instrumentalCount}<br/>
                                    Voice-over posted: {user.voiceOverCount}
                                </div>
                            </div>
                        </div>
                        {isCurrentUser && (
                            <div className="flex flex-col space-y-2 sm:w-auto sm:ml-auto">
                                <button
                                    className="w-full px-6 py-2 bg-[#C162EA] text-white rounded-full hover:bg-[#9732C2] focus:outline-none focus:ring-2 focus:ring-green-300"
                                    onClick={handleEditProfilePictureClick}
                                >
                                    Edit profile picture
                                </button>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{display: 'none'}}
                                    accept=".jpg, .jpeg, .png"
                                    onChange={handleFileChange}
                                />
                                <a href="/post-upload" className="inline-block">
                                    <button
                                        className="w-full px-6 py-2 bg-[#C162EA] text-white rounded-full hover:bg-[#9732C2] focus:outline-none focus:ring-2 focus:ring-green-300">
                                        Add instrumental
                                    </button>
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="bg-[#C162EA] text-white p-4 rounded-3xl mt-10">
                        <div className="text-4xl ml-5 mt-2">
                            Instrumental
                        </div>
                        <div className="mt-4 space-y-4">
                            {user.postsWithInstrumentals.length > 0 ? (
                                user.postsWithInstrumentals.map((post) => (
                                    <div key={post.id} className="w-full">
                                        {isCurrentUser ? (
                                            <MusicPlayerWithImageManageSound
                                                post={post}
                                                onPostDeleted={handlePostDeleted}
                                                userName={user.userName}
                                            />
                                        ) : (
                                            <MusicPlayerWithImage post={post} />
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="ml-5 mt-3">No instrumentals available.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-[#C162EA] text-white p-4 rounded-3xl mt-10">
                        <div className="text-4xl ml-5 mt-2">
                            Voice-over
                        </div>
                        <div className="mt-4 space-y-4">
                            {user.postsWithVoices.length > 0 ? (
                                user.postsWithVoices.map((post) => (
                                    <div key={post.id} className="w-full">
                                        {isCurrentUser ? (
                                            <MusicPlayerWithImageManageSound
                                                post={post}
                                                onPostDeleted={handlePostDeleted}
                                                userName={user.userName}
                                            />
                                        ) : (
                                            <MusicPlayerWithImage post={post} />
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
