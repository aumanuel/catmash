"use client";
import Image from 'next/image';
import BottomNavigationTongue from '@/components/features/Navigation/BottomNavigationTongue';
import Header from '@/components/features/Navigation/Header';
import { useCatMatch } from '@/hooks/useCatMatch';
import { useVoteForMatch } from '@/hooks/useVoteForMatch';
import { useQueryClient } from '@tanstack/react-query';

export default function VotePage() {
  const { data, isLoading, error, refetch } = useCatMatch();
  const queryClient = useQueryClient();
  const { mutate: vote, isPending: voting, error: voteError } = useVoteForMatch({
    onMutate: () => {
      queryClient.setQueryData(['totalMatches'], (old: number | undefined) =>
        typeof old === 'number' ? old + 1 : 1
      );
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ['totalMatches'] });
    },
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: ['totalMatches'] });
      if (error.message) {
        if (error.message.includes('Action token invalide ou expiré')) {
          refetch();
        } else if (error.message.includes('Vote déjà enregistré pour ce match')) {
          refetch();
        }
      }
    },
  });

  const handleVote = (winnerId: string, loserId: string) => {
    if (!data?.token) {
      console.error('[VotePage] Pas de token au moment du vote', { data });
      return;
    }
    vote({ token: data.token, winnerId, loserId });
  };

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-100px)] flex flex-col bg-gray-50 py-8">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center text-lg">Chargement...</div>
        ) : error ? (
          <div className="flex flex-1 items-center justify-center text-lg text-red-600">Erreur lors du chargement des chats.</div>
        ) : data && data.cats && data.cats.length === 2 ? (
          <section className="flex flex-1 w-full h-full items-stretch">
            <div className="flex flex-1 items-center justify-center">
              <div className="flex flex-col items-center -translate-y-10 pl-40">
                <Image
                  src={data.cats[0].url}
                  alt={data.cats[0].name}
                  width={400}
                  height={400}
                  className="rounded-lg object-cover border border-gray-200 shadow-sm"
                />
                <span className="mt-4 text-lg font-medium">{data.cats[0].name}</span>
                <button
                  className="mt-3 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  disabled={voting}
                  onClick={() => handleVote(data.cats[0].id, data.cats[1].id)}
                >
                  J'aime
                </button>
              </div>
            </div>
            <div className="w-px h-full bg-gray-200" />
            <div className="flex flex-1 items-center justify-center">
              <div className="flex flex-col items-center -translate-y-10 pr-40">
                <Image
                  src={data.cats[1].url}
                  alt={data.cats[1].name}
                  width={400}
                  height={400}
                  className="rounded-lg object-cover border border-gray-200 shadow-sm"
                />
                <span className="mt-4 text-lg font-medium">{data.cats[1].name}</span>
                <button
                  className="mt-3 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  disabled={voting}
                  onClick={() => handleVote(data.cats[1].id, data.cats[0].id)}
                >
                  J'aime
                </button>
              </div>
            </div>
          </section>
        ) : (
          <div className="flex flex-1 items-center justify-center text-lg">Aucune donnée de chats à afficher.</div>
        )}
        {voteError && <div className="text-center text-red-600 text-sm mt-2">{voteError.message}</div>}
        <BottomNavigationTongue
          href="/classement"
          label="Voir le classement des chats"
          sublabel="12 matchs joués"
        />
      </main>
    </>
  );
}
