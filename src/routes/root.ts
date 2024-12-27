import { FastifyInstance } from "fastify";

export default (app: FastifyInstance) => {
    app.get("/:user", async (req, res) => {
        res.send({ msg: "Hello, World!" });
    });
};
