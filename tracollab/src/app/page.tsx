"use client";

import {useEffect, useState} from "react";
import SearchBar from "@/components/SearchBar";
import DropDownList from "@/components/DropDownList";
import MusicPlayerWithImage from "@/components/MusicPlayerWithImage";

export default function Home() {
    const [posts, setPosts] = useState([]);
    // const [genres, setGenres] = useState([]);

    // This is a side effect that runs when the component mounts or when the sounds state changes
    useEffect(() => {
        async function getPosts() {
            try {
                const response = await fetch("/api/posts");
                const postsData = await response.json();
                // console.log("postsData: ", postsData);
                setPosts(postsData);
            } catch (error) {
                console.error("Error fetching posts: ", error);
            }
        }

        getPosts();
    }, []);

    // console.log("posts: ", posts);

    return (
        <main>
            <div className="w-full bg-red-500 flex flex-wrap">
                <div className="w-full lg:w-1/2 bg-yellow-500" style={{backgroundColor: '#D3C3C3'}}>
                    <SearchBar/>
                </div>
                <div className="w-1/2 lg:w-1/4 bg-blue-500" style={{backgroundColor: '#D3C3C3'}}>
                    <DropDownList/>
                </div>
                <div className="w-1/2 lg:w-1/4 bg-green-500" style={{backgroundColor: '#D3C3C3'}}>
                    <DropDownList/>
                </div>
            </div>

            <div className="pl-12 pr-12 pt-3" style={{backgroundColor: '#404040'}}>
                <h1 className="text-white text-5xl mb-2">Trends</h1>
                <div className="grid gap-y-4 gap-x-8 min-[1280px]:grid-cols-2 min-[1880px]:grid-cols-3">
                    {posts.map((post, index) => (
                        <div
                            key={index}
                            className="rounded-lg overflow-hidden flex flex-col"
                        >
                            <MusicPlayerWithImage post={post}/>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
