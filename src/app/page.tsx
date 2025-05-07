import Image from 'next/image';
import BottomNavigationTongue from '@/components/features/Navigation/BottomNavigationTongue';


export default function VotePage() {
  return (
    <main className="min-h-screen flex flex-col bg-gray-50 py-8">
      <section className="flex flex-1 w-full h-full items-stretch">
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center -translate-y-20 pl-40">
            <Image
              src="/random-cat.jpg"
              alt="Chat 1"
              width={400}
              height={400}
              className="rounded-lg object-cover border border-gray-200 shadow-sm"
            />
            <span className="mt-4 text-lg font-medium">Chat 1</span>
            <button className="mt-3 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">J'aime</button>
          </div>
        </div>
        <div className="w-px h-full bg-gray-200" />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center -translate-y-20 pr-40">
            <Image
              src="/random-cat.jpg"
              alt="Chat 2"
              width={400}
              height={400}
              className="rounded-lg object-cover border border-gray-200 shadow-sm"
            />
            <span className="mt-4 text-lg font-medium">Chat 2</span>
            <button className="mt-3 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">J'aime</button>
          </div>
        </div>
      </section>
      <BottomNavigationTongue
        href="/classement"
        label="Voir le classement des chats"
        sublabel="12 matchs joués"
      />
    </main>
  );
}
