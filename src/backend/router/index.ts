import * as trpc from "@trpc/server";
import { PokemonClient } from "pokenode-ts";
import { z } from "zod";

import { prisma } from "@/backend/utils/prisma";

export const appRouter = trpc
  .router()
  .query("get-pokemon-by-id", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      const pokeApiConnection = new PokemonClient();
      const pokemon = await pokeApiConnection.getPokemonById(input.id);
      return { name: pokemon.name, sprites: pokemon.sprites };
    },
  })
  .mutation("cast-vote", {
    input: z.object({
      votedFor: z.number(),
      votedAgainst: z.number(),
    }),
    async resolve({ input }) {
      const voteInDb = await prisma.vote.create({
        data: {
          votedFor: input.votedFor,
          votedAgainst: input.votedAgainst,
        },
      });
      return {
        success: true,
        vote: voteInDb,
      };
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;
