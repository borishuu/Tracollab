import SearchBar from "@/components/SearchBar";
import DropDownList from "@/components/DropDownList";
import MusicPlayerWithImage from "@/components/MusicPlayerWithImage";

export default function Home() {
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
                <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 lg:grid-rows-3">
                    {[...Array(6)].map((_, index) => (
                        <div
                            key={index}
                            className="rounded-lg overflow-hidden flex flex-col"
                        >
                            <MusicPlayerWithImage/>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
