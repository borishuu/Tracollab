import CommentValidate from "@/components/CommentValidate";
import MusicPlayer from "@/components/MusicPlayer";
import React from "react";
import {Comme} from "next/dist/compiled/@next/font/dist/google";

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


                <CommentValidate hasMusic={true}/>
                <CommentValidate hasMusic={false}/>

            </div>
        </div>
      </main>
  );
}
