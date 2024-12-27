import Fastify from "fastify";
import { Yapper } from "./utils/Yapper";
import { readdir } from "fs/promises";

const server = Fastify({
    loggerInstance: new Yapper()
});

server.log.debug("Loading routes...");
(async () => {
    (
        await readdir(
            process.env.NODE_ENV === "development"
                ? "./src/routes"
                : "./dist/routes"
        )
    ).forEach(async file => {
        if (file.endsWith(".ts") || file.endsWith(".js")) {
            const route = await import(
                process.env.NODE_ENV === "development"
                    ? `./routes/${file}`
                    : `./dist/routes/${file}`
            );
            route.default(server);
            server.log.debug(`Registered ${file}`);
        }
    });

    await server.listen({ port: 3000 }, async (err, address) => {
        if (err) {
            server.log.error(err);
            process.exit(1);
        }
        address && server.log.info(`Server listening at ${address}`);
    });
})();
