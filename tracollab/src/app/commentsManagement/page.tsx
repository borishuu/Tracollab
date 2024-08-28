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
                                My beautiful music
                            </div>
                            <div className="w-full max-w-xs p-1">
                                Published on the 19/08/2024<br/>
                                Genre: Classic
                            </div>
                        </div>
                    </div>
                </div>


                <div className="bg-[#C162EA] text-white p-4 rounded-3xl mt-10">
                    <div className="flex items-center justify-between mt-4">
                        <MusicPlayerWithImage/>
                        <div className="flex flex-col space-y-2">
                            <img
                                src="assets/validate.png"
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
