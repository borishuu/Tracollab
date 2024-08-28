import MusicPlayerWithImage from "@/components/MusicPlayerWithImage";

export default function Home() {
  return (
      <main className="min-h-screen flex flex-col">
        <div className="flex-grow bg-[#404040] pl-12 pr-12 pt-4 pb-12">
            <div className="lg:pl-12 lg:ml-24 sm:ml-0 sm:mr-0 lg:mr-12 lg:pr-24 lg:pt-3">

                <div className="flex flex-col sm:flex-row items-center sm:items-start pt-6">

                    <div className="flex flex-col sm:flex-row items-center sm:space-x-4 mb-4 sm:mb-0 w-full sm:w-auto">

                        <div className="flex-none flex items-center justify-center">
                            <div
                                className="w-full max-w-xs aspect-square min-w-[150px] bg-red-400 rounded-3xl flex justify-center items-center">
                            </div>
                        </div>

                        <div className="flex flex-col ml-0 sm:ml-4 text-white">
                            <div className="text-3xl w-full max-w-xs p-1">
                                MusicLover34
                            </div>
                            <div className="w-full max-w-xs p-1">
                                Joined on the 19/08/2024<br/>
                                Instrumentals posted: 1<br/>
                                Voice-over posted: 7
                            </div>
                        </div>
                    </div>


                    <div className="flex flex-col space-y-2 sm:w-auto sm:ml-auto">
                        <button
                            className="w-full px-6 py-2 bg-[#C162EA] text-white rounded-full hover:bg-[#9732C2] focus:outline-none focus:ring-2 focus:ring-green-300">
                            Edit profile picture
                        </button>
                        <a href="/postUpload" className="inline-block">
                            <button
                                className="w-full px-6 py-2 bg-[#C162EA] text-white rounded-full hover:bg-[#9732C2] focus:outline-none focus:ring-2 focus:ring-green-300">
                                Add instrumental
                            </button>
                        </a>
                    </div>
                </div>


                <div className="bg-[#C162EA] text-white p-4 rounded-3xl mt-10">
                    <div className="text-3xl p-1">
                        Instrumental
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <MusicPlayerWithImage/>
                        <div className="flex flex-col space-y-2">
                            <img
                                src="assets/bell.png"
                                alt="Notification icon"
                                className="w-8 h-8 object-cover rounded-lg shadow-md"
                            />
                            <img
                                src="assets/remove.png"
                                alt="Delete icon"
                                className="w-8 h-8 object-cover rounded-lg shadow-md"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-[#C162EA] text-white p-4 rounded-3xl mt-10">
                    <div className="text-3xl p-1">
                        Voice-over
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <MusicPlayerWithImage/>
                        <div className="flex flex-col space-y-2">
                            <img
                                src="assets/bell.png"
                                alt="Notification icon"
                                className="w-8 h-8 object-cover rounded-lg shadow-md"
                            />
                            <img
                                src="assets/remove.png"
                                alt="Delete icon"
                                className="w-8 h-8 object-cover rounded-lg shadow-md"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </main>
  );
}
