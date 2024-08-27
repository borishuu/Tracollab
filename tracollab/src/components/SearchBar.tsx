export default function SearchBar() {
    return (
        <div className="w-full max-w-md mx-auto mt-1 mb-1">
            <div className="relative">
                <input
                    type="text"
                    className="w-full h-6 px-4 pr-10 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search..."
                />
                <button className="absolute top-0 right-0 mt-1 mr-4">
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
