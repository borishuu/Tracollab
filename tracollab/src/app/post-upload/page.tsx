'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from "@/components/SearchBar";
import DropDownList from "@/components/DropDownList";
import MusicPlayerWithImage from "@/components/MusicPlayerWithImage";

export default function Home() {
    const router = useRouter();
    const [pic, setPic] = useState(null);
    const [audio, setAudio] = useState(null);
    const [title, setTitle] = useState('');
    const [type, setType] = useState('');
    const [text, setText] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("submit");

        try {
            setUploading(true);

            const formData = new FormData();
            formData.append('audioFile', audio);
            formData.append('imageFile', pic);
            formData.append('title', title);
            formData.append('type', type);
            formData.append('text', text);

            const response = await fetch('/api/posts', {
              method: 'POST',        
              body: formData,
            });

            const data = await response.json();

            setUploading(false);

            if (response.status === 200) {
                router.push('/');
            } else {
                setError(data.error);
            }
        } catch (error) {
          console.error('Error uploading file:', error);
          setError(error);
        } finally {
          setUploading(false);
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setAudio(file);
        console.log('MP3 file selected:', file);
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setPic(file);

        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);
        }
    }

    return (
        <main>
            <div className="pl-12 pr-12 pt-4 pb-12 bg-[#404040] h-full">
                <div className="lg:pl-12 lg:ml-24 sm:ml-0 sm:mr-0 lg:mr-24 lg:pr-12 lg:pt-3">
                    <div className="flex flex-col lg:flex-row h-full">

                        <div
                            className="flex-none w-full lg:w-1/3 flex flex-col items-center pl-12 pr-12 pt-6">
                            <div
                                className="w-full max-w-xs aspect-square bg-red-400 rounded-3xl flex justify-center items-center mb-4">                            
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Uploaded Image" className="rounded-3xl object-cover" />
                                ) : (
                                    <span className="text-white">No image uploaded</span>
                                )}
                            </div>
                            <label className="w-full max-w-xs py-2 bg-[#C162EA] hover:bg-[#9732C2] text-white rounded-full text-lg cursor-pointer text-center">
                                Upload Pic
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 h-full p-4">
                            <div className="h-1/6 mb-4">
                                <label className="block text-sm font-medium text-white">Title</label>
                                <input type="text"
                                       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-700"
                                       onChange={(e) => setTitle(e.target.value)}/>
                            </div>

                            <div className="h-1/6 mb-4">
                                <label className="block text-sm font-medium text-white">Genre</label>
                                <DropDownList/>
                            </div>

                            <div className="h-1/6 mb-4">
                                <label className="block text-sm font-medium text-white">Type</label>
                                <input type="text"
                                       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-700"
                                       onChange={(e) => setType(e.target.value)}/>
                            </div>

                            <div className="h-1/3 mb-4">
                                <label className="block text-sm font-medium text-white">Text</label>
                                <input type="text"
                                       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-700"
                                       onChange={(e) => setText(e.target.value)}/>
                            </div>

                            <div className="h-1/6 mb-4 flex items-center space-x-0">
                                <input
                                    type="text"
                                    className="block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-700"
                                    readOnly
                                    value={audio ? audio.name : ''}
                                />

                                <label
                                    className="px-6 py-2 w-1/3 bg-[#E5D5D5] text-white rounded-md hover:bg-[#c9a7a7] focus:outline-none focus:ring-2 focus:ring-blue-300 -ml-px text-center cursor-pointer"
                                >
                                    Upload file
                                    <input
                                        type="file"
                                        accept="audio/mp3"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        name='audioFile'
                                    />
                                </label>

                                <div className="lg:w-10 sm:w-0"></div>

                                <button
                                    className="px-4 py-2 ml-2 bg-[#C162EA] text-white rounded-md hover:bg-[#9732C2] focus:outline-none focus:ring-2 focus:ring-green-300"
                                    type="submit">
                                    Post
                                </button>
                            </div>
                        </form>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        {uploading && (
                            <div>
                            <img
                                src="https://i.gifer.com/ZKZg.gif"
                                alt="Loading..."
                                style={{ width: '50px', height: '50px' }}
                            />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
