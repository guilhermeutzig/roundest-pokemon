import { useState } from "react";
import type { NextPage } from "next";

import Loading from "@/components/Loading";
import PokemonListing from "@/components/PokemonListing";
import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { trpc } from "@/utils/trpc";
import Head from "next/head";

const Home: NextPage = () => {
  const [ids, setIds] = useState(getOptionsForVote());
  const [first, second] = ids;

  const firstPokemon = trpc.useQuery(["get-pokemon-by-id", { id: first }]);
  const secondPokemon = trpc.useQuery(["get-pokemon-by-id", { id: second }]);
  const isLoading = firstPokemon.isLoading || secondPokemon.isLoading;

  const voteMutation = trpc.useMutation(["cast-vote"]);

  if (isLoading) return <Loading />;

  const voteForRoundest = (selected: number) => {
    const votedFor = selected === first ? first : second;
    const votedAgainst = selected === first ? second : first;
    voteMutation.mutate({ votedFor, votedAgainst });
    setIds(getOptionsForVote());
  };

  return (
    <>
      <Head>
        <title>Roundest Pokémon | guilhermeutzig</title>
      </Head>
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <div className="text-2xl text-center">
          Which pokemon is the roundest?
        </div>
        <div className="p-4"></div>
        <div className="border rounded p-8 flex justify-between max-w-2xl items-center">
          <PokemonListing
            pokemon={firstPokemon.data}
            vote={() => voteForRoundest(first)}
          />
          <div className="p-8">Vs.</div>
          <PokemonListing
            pokemon={secondPokemon.data}
            vote={() => voteForRoundest(second)}
          />
        </div>
        <div className="absolute bottom-0 w-full text-xl text-center pb-2">
          <a
            href="https://github.com/guilhermeutzig/roundest-pokemon"
            target="__blank"
          >
            Github
          </a>
        </div>
      </div>
    </>
  );
};

export default Home;
