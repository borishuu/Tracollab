import SearchBar from "@/components/SearchBar";
import DropDownList from "@/components/DropDownList";
import MusicPlayerWithImage from "@/components/MusicPlayerWithImage";

export default function Home() {
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

                        <div className="flex-1 h-full p-4">
                            <div className="h-1/6 mb-4">
                                <label className="block text-sm font-medium text-white">Title</label>
                                <input type="text"
                                       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
                            </div>

                            <div className="h-1/6 mb-4">
                                <label className="block text-sm font-medium text-white">Genre</label>
                                <DropDownList/>
                            </div>

                            <div className="h-1/6 mb-4">
                                <label className="block text-sm font-medium text-white">Type</label>
                                <input type="text"
                                       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
                            </div>

                            <div className="h-1/3 mb-4">
                                <label className="block text-sm font-medium text-white">Text</label>
                                <input type="text"
                                       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
                            </div>

                            <div className="h-1/6 mb-4 flex items-center space-x-0">
                                <input
                                    type="text"
                                    className="block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />

                                <button
                                    className="px-6 py-2 w-1/3 bg-[#E5D5D5] text-white rounded-md hover:bg-[#c9a7a7] focus:outline-none focus:ring-2 focus:ring-blue-300 -ml-px">
                                    Upload file
                                </button>

                                <div className="lg:w-10 sm:w-0"></div>

                                <button
                                    className="px-4 py-2 ml-2 bg-[#C162EA] text-white rounded-md hover:bg-[#9732C2] focus:outline-none focus:ring-2 focus:ring-green-300">
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
