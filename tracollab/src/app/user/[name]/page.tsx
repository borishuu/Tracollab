"use client";

import { useParams } from 'next/navigation';
import MusicPlayerWithImageManageSound from "@/components/MusicPlayerWithImageManageSound";
import { useEffect, useState, useRef } from 'react';

export default function ProfilePage() {
    const { name } = useParams();
    const [user, setUser] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        async function fetchUser() {
            if (name) {
                const res = await fetch(`/api/user/${name}`);
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                } else {
                    // Handle error
                    console.error('User not found');
                }
            }
        }
        fetchUser();
    }, [name]);

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
                    // Here you might want to update the profile picture on the page
                } else {
                    console.error('Failed to upload profile picture');
                }
            } catch (error) {
                console.error('Error uploading profile picture:', error);
            }
        }
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen text-6xl">
                Loading...
            </div>
        );
    }

    return (
        <main className="min-h-screen flex flex-col">
            <div className="flex-grow bg-[#404040] pl-12 pr-12 pt-4 pb-12">
                <div className="lg:pl-12 lg:ml-24 md:ml-12 sm:ml-0 sm:mr-0 md:mr-12 lg:mr-24 lg:pr-24 lg:pt-3">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start pt-6">
                        <div className="flex flex-col sm:flex-row items-center sm:space-x-4 mb-4 sm:mb-0 w-full sm:w-auto">
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
                                    {user.name}
                                </div>
                                <div className="w-full max-w-xs p-1">
                                    Joined on the {user.joinDate}<br/>
                                    Instrumentals posted: {user.instrumentalCount}<br/>
                                    Voice-over posted: {user.voiceOverCount}
                                </div>
                            </div>
                        </div>
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
                                style={{ display: 'none' }}
                                accept=".jpg, .jpeg, .png"
                                onChange={handleFileChange}
                            />
                            <a href="/postUpload" className="inline-block">
                                <button
                                    className="w-full px-6 py-2 bg-[#C162EA] text-white rounded-full hover:bg-[#9732C2] focus:outline-none focus:ring-2 focus:ring-green-300">
                                    Add instrumental
                                </button>
                            </a>
                        </div>
                    </div>

                    <div className="bg-[#C162EA] text-white p-4 rounded-3xl mt-10">
                        <div className="text-4xl ml-5 mt-2">
                            Instrumental
                        </div>
                        <div>
                            {user.instrumentals.length > 0 ? (
                                user.instrumentals.map((instrumental) => (
                                    <div key={instrumental.id}>
                                        {/* Affichage du player avec les infos */}
                                        <MusicPlayerWithImageManageSound sound={instrumental.sound} />
                                    </div>
                                ))
                            ) : (
                                <p className="ml-5 mt-3">No instrumental posted yet.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-[#C162EA] text-white p-4 rounded-3xl mt-10">
                        <div className="text-4xl ml-5 mt-2">
                            Voice-over
                        </div>
                        <div>
                            {user.voices.length > 0 ? (
                                user.voices.map((voice) => (
                                    <div key={voice.id}>
                                        {/* Affichage du player avec les infos */}
                                        <MusicPlayerWithImageManageSound sound={voice.sound} />
                                    </div>
                                ))
                            ) : (
                                <p className="ml-5 mt-3">No voice-over posted yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
