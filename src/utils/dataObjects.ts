import { UserMeasurements } from '../Context/UserContext';

/* eslint-disable import/prefer-default-export */
export type Seasons = "autumn" | "winter" | "spring" | "summer";

export interface PostObject extends UserMeasurements {
    author: string;
    created: number;
    commentId: string;
    body: string;
    permalink: string;
    imageUrls: string[];
    timestamp: string;
    tags: string[] | undefined,
    country: string | undefined,
    season: Seasons | undefined,
    // height: number,
    // chest: number,
    // waist: number,
}
