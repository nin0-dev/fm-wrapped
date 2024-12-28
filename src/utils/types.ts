export type Scrobble = {
    artist: {
        id: string;
        name: string;
    };
    album: {
        id: string;
        name: string;
        art?: string;
    };
    id: string;
    name: string;
    url: string;
};
