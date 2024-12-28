export async function queryLastFm(method: string, args: object) {
    const value = await fetch(
        "https://ws.audioscrobbler.com/2.0/?" +
            new URLSearchParams({
                method,
                api_key: process.env.LASTFM_API_KEY || "",
                format: "json",
                ...args
            } as Record<string, string>).toString(),
        {
            method: "GET"
        }
    );

    if (!value.ok) {
        console.error(value);
        throw new Error(`Failed to query Last.fm API: ${value.statusText}`);
    }

    return await value.json();
}
