'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DropDownList from "@/components/DropDownList";

export default function Home() {
    const router = useRouter();
    const [pic, setPic] = useState(null);
    const [audio, setAudio] = useState(null);
    const [title, setTitle] = useState('');
    const [type, setType] = useState('');
    const [text, setText] = useState('');
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState("");
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        async function getGenres() {
            try {
                const response = await fetch("/api/genres");
                const genresData = await response.json();
                setGenres(genresData);
            } catch (error) {
                console.error("Error fetching genres: ", error);
            }
        }
        getGenres();
    }, []);

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
            formData.append('genre', selectedGenre);

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

                        <div className="flex-none w-full lg:w-1/3 flex flex-col items-center pl-12 pr-12 pt-6">
                            <div className="w-full max-w-xs aspect-square bg-gray-400 rounded-3xl flex justify-center items-center mb-4 relative">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Uploaded Image"
                                        className="absolute inset-0 w-full h-full object-cover rounded-3xl"
                                    />
                                ) : (
                                    <span className="text-white">No image uploaded</span>
                                )}
                            </div>

                            <label
                                className="w-full max-w-xs py-2 bg-[#C162EA] hover:bg-[#9732C2] text-white rounded-full text-lg cursor-pointer text-center">
                                Upload Pic
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 h-full p-4 flex flex-col">
                            <div className="h-1/6 mb-4 w-full">
                                <label className="block text-lg font-medium text-white">Title</label>
                                <input type="text"
                                       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                       onChange={(e) => setTitle(e.target.value)}/>
                            </div>

                            <div className="h-1/6 mb-4 w-full">
                                <label className="block text-lg font-medium text-white">Genre</label>
                                <DropDownList name={"All Genres"} data={genres} onChange={(e) => setSelectedGenre(e.target.value)}/>
                            </div>

                            <div className="h-1/6 mb-4 w-full">
                                <label className="block text-lg font-medium text-white">Type</label>
                                <DropDownList name={"Type"} data={[{ name: "Instrumental" }, { name: "Voice" }]} onChange={(e) => setType(e.target.value)} />
                            </div>

                            <div className="h-1/3 mb-4 w-full">
                                <label className="block text-lg font-medium text-white">Text</label>
                                <input type="text"
                                       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                       onChange={(e) => setText(e.target.value)}/>
                            </div>

                            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-4">
                                <input
                                    type="text"
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                    readOnly
                                    value={audio ? audio.name : ''}
                                />

                                <div className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-4 w-full lg:w-auto">
                                    <label
                                        className="px-6 py-2 min-w-[130px] bg-[#C162EA] text-white rounded-md hover:bg-[#c9a7a7] focus:outline-none focus:ring-2 focus:ring-blue-300 text-center cursor-pointer w-full lg:w-auto"
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

                                    <button
                                        className="px-4 py-2 bg-[#C162EA] text-white rounded-md hover:bg-[#9732C2] focus:outline-none focus:ring-2 focus:ring-green-300 w-full lg:w-auto"
                                        type="submit">
                                        Post
                                    </button>
                                </div>
                            </div>

                            {error && <p className="text-red-500 text-xl font-bold mb-4 mt-4">{error}</p>}
                            {uploading && (
                                <div className="flex justify-center mt-4">
                                    <img
                                        src="https://i.gifer.com/ZKZg.gif"
                                        alt="Loading..."
                                        style={{ width: '50px', height: '50px' }}
                                    />
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}