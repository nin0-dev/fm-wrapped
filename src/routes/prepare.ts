import { FastifyInstance } from "fastify";
import { db } from "../utils/database";
import { queryLastFm } from "../utils/lastfm";
import { Scrobble } from "../utils/types";
import getUserScrobblesForYear from "../preparers/getUserScrobblesForYear";

const currentlyGettingPreparedUsers: {
    year: number;
    username: string;
}[] = [];

export default (app: FastifyInstance) => {
    app.get("/prepare/:year/:username", async (req, res) => {
        const { username, year } = req.params as any;
        if (
            (
                await db
                    .selectFrom("wrappedInfo")
                    .select("username")
                    .where("username", "=", username)
                    .where("year", "=", year)
                    .execute()
            ).length > 0
        )
            if (
                parseInt(
                    (
                        await db
                            .selectFrom("wrappedInfo")
                            .select("username")
                            .select("lastPreparedTime")
                            .where("username", "=", username)
                            .where("year", "=", year)
                            .execute()
                    )[0].lastPreparedTime
                ) +
                    86400000 >
                Date.now()
            ) {
                return res.code(429).send({
                    message: `Account has already been queried for this year in the past 24 hours, try again later`
                });
            }
        if (
            currentlyGettingPreparedUsers.find(
                u => u.username === username && u.year === parseInt(year)
            )
        )
            return res.code(429).send({
                message:
                    "Account is already being queried for this year, please wait"
            });

        currentlyGettingPreparedUsers.push({ year: parseInt(year), username });
        res.code(204).send();

        const scrobbles = await getUserScrobblesForYear(username, year);
    });
};
