import Fastify from "fastify";
import cors from "@fastify/cors";
import { ApolloServer } from "@apollo/server";
import fastifyApollo, {
  fastifyApolloDrainPlugin,
} from "@as-integrations/fastify";
import { typeDefs } from "./schema/typeDefs";
import { resolvers } from "./resolvers";
import dotenv from "dotenv";
import { RepositoryModel } from "./models/repository.model";
import { logger } from "./utils/logger";

dotenv.config();

const PORT = parseInt(process.env.PORT || "4000", 10);
const NODE_ENV = process.env.NODE_ENV || "development";

const fastify = Fastify({
  logger: true,
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [fastifyApolloDrainPlugin(fastify)],
});

async function startServer() {
  try {
    await fastify.register(cors, {
      origin: NODE_ENV === "production" ? false : true,
      credentials: true,
    });

    await server.start();
    await fastify.register(fastifyApollo(server));

    fastify.get("/health", async () => {
      return { status: "ok", timestamp: new Date().toISOString() };
    });

    fastify.get("/", async (request, reply) => {
      reply.redirect("/graphql");
    });

    await fastify.listen({ port: PORT, host: "0.0.0.0" });

    logger.info(`Server ready at http://localhost:${PORT}/graphql`, {
      port: PORT,
      nodeEnv: NODE_ENV,
    });

    setInterval(async () => {
      logger.info("Starting periodic repository refresh");
      try {
        await RepositoryModel.refreshAll();
        logger.info("Periodic refresh completed");
      } catch (error) {
        logger.error("Periodic refresh failed", error);
      }
    }, 24 * 60 * 60 * 1000); // 24 hours (1 day)
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

startServer();
