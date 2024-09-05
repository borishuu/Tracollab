import React, { useState, useEffect } from "react";

export default function SearchBar({query, setQuery, posts, onSearchResults }) {
    useEffect(() => {
        if (query.length === 0) {
            onSearchResults([]);
            return;
        }

        const fetchResults = async () => {
            // try {
            //     const response = await fetch('/api/search', {
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': 'application/json',
            //         },
            //         body: JSON.stringify({ query }),
            //     });
            //     const data = await response.json();
            //     onSearchResults(data);
            // } catch (error) {
            //     console.error("Error fetching search results:", error);
            // }

            // Filter the results
            const results = posts.filter((post) => {
                return post.sound.title.toLowerCase().includes(query.toLowerCase()) || post.user.name.toLowerCase().includes(query.toLowerCase());
            });
            onSearchResults(results);
        };

        fetchResults();
    }, [query]);

    return (
        <div className="w-full max-w-md mx-auto mt-2">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full h-8 px-4 pr-10 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Search..."
                />
                <button className="absolute top-1 right-0 mt-1 mr-4">
                    <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                        ></path>
                    </svg>
                </button>
            </div>
        </div>
    );
}
