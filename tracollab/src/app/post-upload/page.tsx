'use client';

import { useState } from 'react';
import SearchBar from "@/components/SearchBar";
import DropDownList from "@/components/DropDownList";
import MusicPlayerWithImage from "@/components/MusicPlayerWithImage";

export default function Home() {
    const [pic, setPic] = useState('');
    const [audio, setAudio] = useState(null);
    const [title, setTitle] = useState('');
    const [type, setType] = useState('');
    const [text, setText] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("submit");
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setAudio(file);
        console.log('MP3 file selected:', file);

        setUploading(true);

        try {

            const formData = new FormData();
            formData.append('audioFile', file);

            // Step 1: Request signed URL from the backend
            const response = await fetch('/api/upload-audio', {
              method: 'POST',        
              body: formData,
            });

            await response.json();
      
            //const { signedUrl } = await response.json();
      
            // Step 2: Upload file to GCS using signed URL
            /*const uploadResponse = await fetch(signedUrl, {
              method: 'PUT',
              headers: {
                'Content-Type': 'audio/mpeg',
              },
              body: file,
            });
      
            if (!uploadResponse.ok) {
              throw new Error('Failed to upload file');
            }*/
      
            // The file has been uploaded successfully
            /*const fileUrl = signedUrl.split('?')[0]; // Public URL of the uploaded file
            setFileUrl(fileUrl);*/
      
            // Step 3: Send the file URL to your API
            // Example: await sendFileUrlToAPI(fileUrl);
          } catch (error) {
            console.error('Error uploading file:', error);
          } finally {
            setUploading(false);
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
                            </div>
                            <button className="w-full max-w-xs py-2 bg-[#C162EA] hover:bg-[#9732C2] text-white rounded-full text-lg">
                                Upload pic
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 h-full p-4">
                            <div className="h-1/6 mb-4">
                                <label className="block text-sm font-medium text-white">Title</label>
                                <input type="text"
                                       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-700"
                                       onChange={(e) => setText(e.target.value)}/>
                            </div>

                            <div className="h-1/6 mb-4">
                                <label className="block text-sm font-medium text-white">Genre</label>
                                <DropDownList/>
                            </div>

                            <div className="h-1/6 mb-4">
                                <label className="block text-sm font-medium text-white">Type</label>
                                <input type="text"
                                       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-700"/>
                            </div>

                            <div className="h-1/3 mb-4">
                                <label className="block text-sm font-medium text-white">Text</label>
                                <input type="text"
                                       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-700"/>
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
                    </div>
                </div>
            </div>
        </main>
    );
}
