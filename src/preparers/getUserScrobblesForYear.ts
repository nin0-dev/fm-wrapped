import { queryLastFm } from "../utils/lastfm";
import { Scrobble } from "../utils/types";

export default async function getUserScrobblesForYear(
    username: string,
    year: string
): Promise<Scrobble[]> {
    const pushTrack = (track: any) => {
        scrobbles.push({
            artist: {
                id: track.artist.mbid,
                name: track.artist["#text"]
            },
            album: {
                id: track.album.mbid,
                name: track.album["#text"],
                art: track.image[track.image.length - 1]["#text"]
            },
            id: track.mbid,
            name: track.name,
            url: track.url
        });
    };

    const scrobbles: Scrobble[] = [];
    const req = await queryLastFm("user.getRecentTracks", {
        username,
        limit: 200,
        from: new Date(`${year}-01-01T00:00:00Z`).getTime() / 1000,
        extended: true
    });

    // process initial page
    for (const track of req.recenttracks.track) {
        if (!track["@attr"]) pushTrack(track);
    }

    let currentPage = parseInt(req.recenttracks["@attr"].page);
    while (currentPage < parseInt(req.recenttracks["@attr"].totalPages)) {
        console.log(`Fetching page ${currentPage + 1} for user ${username}`);
        currentPage++;
        const nextPageReq = await queryLastFm("user.getRecentTracks", {
            username,
            limit: 200,
            page: currentPage,
            from: new Date(`${year}-01-01T00:00:00Z`).getTime() / 1000,
            to: new Date(`${year}-12-31T23:59:59Z`).getTime() / 1000,
            extended: true
        });

        for (const track of nextPageReq.recenttracks.track) {
            if (!track["@attr"]) pushTrack(track);
        }

        await new Promise(resolve => setTimeout(resolve, 300));
    }
    return scrobbles;
}
