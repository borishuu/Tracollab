import React from 'react';
import LikeReport from "@/components/LikeReport";
import DownloadButton from "@/components/DownloadButton";

export default function LikeReportDownload() {
    return (
        <div className="flex flex-row space-x-2 md:flex-col md:space-x-0 md:space-y-2 lg:space-y-2">
            <div className="w-full md:w-auto">
                <LikeReport/>
            </div>
            <div className="w-full md:w-auto">
                <DownloadButton/>
            </div>
        </div>


    );
}
