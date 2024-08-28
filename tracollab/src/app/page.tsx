"use client";

import React, {useEffect, useState} from "react";
import SearchBar from "@/components/SearchBar";
import DropDownList from "@/components/DropDownList";
import MusicPlayerWithImage from "@/components/MusicPlayerWithImage";

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState("");

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
        getPosts();
    }, []);

    // console.log("posts: ", posts);

    const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedGenre(event.target.value);
    };

    const filteredPosts = selectedGenre
        ? posts.filter(post => post.sound.genre.name === selectedGenre)
        : posts;

    return (
        <main>
            <div className="w-full bg-red-500 flex flex-wrap">
                <div className="w-full lg:w-1/2 bg-yellow-500" style={{backgroundColor: '#D3C3C3'}}>
                    <SearchBar/>
                </div>
                <div className="w-1/2 lg:w-1/4 bg-blue-500" style={{backgroundColor: '#D3C3C3'}}>
                    <DropDownList name={"All Genres"} genres={genres} onChange={handleGenreChange}/>
                </div>
                <div className="w-1/2 lg:w-1/4 bg-green-500" style={{backgroundColor: '#D3C3C3'}}>
                    <DropDownList name={"Sort by"}/>
                </div>
            </div>

            <div className="pl-12 pr-12 pt-3" style={{backgroundColor: '#404040'}}>
                <h1 className="text-white text-5xl mb-2">Trends</h1>
                <div className="grid gap-y-4 gap-x-8 min-[1280px]:grid-cols-2 min-[1880px]:grid-cols-3">
                    {filteredPosts.map((post, index) => (
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
