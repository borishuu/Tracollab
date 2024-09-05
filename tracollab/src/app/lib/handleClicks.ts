import {router} from "next/client";

export const handleUserClick = (name: string) => {
    router.push(`/user/${name}`);
}

export const handlePostClick = (postId: string) => {
    router.push(`/TrackPage/${postId}`);
};
