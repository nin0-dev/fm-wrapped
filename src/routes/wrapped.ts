import { FastifyInstance } from "fastify";
import { db } from "../utils/database";

export default (app: FastifyInstance) => {
    app.get("/wrapped/:year/:username", async (req, res) => {
        const username = (req.params as any).username;
        if (
            !(
                await db
                    .selectFrom("wrappedInfo")
                    .select("username")
                    .where("username", "=", username)
                    .execute()
            ).length
        ) {
            return res.code(404).send({
                message: `User not found, use the /prepare/:year/${username} call to query lastfm info.`
            });
        }
    });
};
