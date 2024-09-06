"use client";

import React, {useEffect, useState} from "react";
import SearchBar from "@/components/SearchBar";
import DropDownList from "@/components/DropDownList";
import MusicPlayerWithImage from "@/components/MusicPlayerWithImage";

const sortingOptions = [
    {name: "Newest"},
    {name: "Oldest"},
    {name: "Most Liked"},
];

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [query, setQuery] = useState("");
    const [searchResults, setResults] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedSort, setSelectedSort] = useState("");

    useEffect(() => {
        // Récupération des posts
        async function getPosts() {
            try {
                const response = await fetch("/api/posts");
                const postsData = await response.json();
                setPosts(postsData);
            } catch (error) {
                console.error("Error fetching posts: ", error);
            }
        }

        // Récupération des genres
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

    // Fonction gérant le changement de genre
    const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedGenre(event.target.value);
    };

    // Fonction gérant le changement de tri
    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSort(event.target.value);
    };

    // Combinaison du genre et des résultats de recherche
    const getFilteredPosts = () => {
        let filtered = searchResults.length > 0 || query.length > 0 ? searchResults : posts;

        if (selectedGenre) {
            filtered = filtered.filter(post => post.sound.genre?.name === selectedGenre);
        }

        return filtered;
    };

    const filteredPosts = getFilteredPosts();

    // Tri des posts
    const sortedPosts = [...filteredPosts].sort((a, b) => {
        if (selectedSort === "Newest") {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        } else if (selectedSort === "Oldest") {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        } else if (selectedSort === "Most Liked") {
            return b.likes?.length - a.likes?.length;
        }
        return 0;
    });

    return (
        <main>
            <div className="w-full bg-red-500 flex flex-wrap">
                <div className="w-full lg:w-1/2 bg-yellow-500" style={{backgroundColor: '#D3C3C3'}}>
                    <SearchBar query={query} setQuery={setQuery} posts={posts} onSearchResults={setResults}/>
                </div>
                <div className="p-1 w-1/2 lg:w-1/4 bg-blue-500" style={{backgroundColor: '#D3C3C3'}}>
                    <DropDownList name={"All Genres"} data={genres} value={selectedGenre} onChange={handleGenreChange}/>
                </div>
                <div className="p-1 w-1/2 lg:w-1/4 bg-green-500" style={{backgroundColor: '#D3C3C3'}}>
                    <DropDownList name={"Sort by"} data={sortingOptions} value={selectedSort}
                                  onChange={handleSortChange}/>
                </div>
            </div>

            <div className="pl-12 pr-12 pt-3" style={{backgroundColor: '#404040'}}>
                <h1 className="text-white text-5xl mb-2">Trends</h1>
                <div className="grid gap-y-4 gap-x-8 min-[1280px]:grid-cols-2 min-[1880px]:grid-cols-3">
                    {sortedPosts.map((post, index) => (
                        <div key={index} className="rounded-lg overflow-hidden flex flex-col">
                            <MusicPlayerWithImage post={post}/>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}