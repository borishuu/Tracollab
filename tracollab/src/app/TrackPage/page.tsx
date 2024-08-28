import MusicPlayerWithImage from "@/components/MusicPlayerWithImage";
import LikeReport from "@/components/LikeReport";
import React from "react";
import PostButton from "@/components/PostButton";
import DownloadButton from "@/components/DownloadButton";
import LikeReportDownload from "@/components/LikeReportDownload";
import Comment from "@/components/Comment"
import UploadSection from "@/components/UploadSection ";

export default function Home() {
    return (
        <main>
            <div className="pl-12 pr-12 pt-4 pb-12 bg-[#404040] h-full">
                <div className="lg:pl-12 lg:ml-24 sm:ml-0 sm:mr-0 lg:mr-24 lg:pr-12 lg:pt-3">
                    <div className="w-full flex flex-col md:flex-row mb-4">
                        <div className="w-full md:w-10/12">
                            <MusicPlayerWithImage/>
                        </div>

                        <div className="md:w-2/12">
                            <LikeReportDownload/>
                        </div>
                    </div>

                    <div className="w-full bg-[#9732C2] flex p-2 rounded-3xl">
                        <div className="w-1/12 flex items-center justify-center">
                            <img
                                src="/assets/sort.png"
                                className="h-6 object-contain"
                            />
                        </div>

                        <div className="sm:w-10/12 w-6/12">
                            <UploadSection/>
                        </div>

                        <div className="w-1/12 ml-auto flex items-center justify-center">
                            <PostButton/>
                        </div>
                    </div>

                    <Comment/>
                    <Comment hasMusic={true}/>
                    <Comment/>


                </div>
            </div>
        </main>
    );
}
