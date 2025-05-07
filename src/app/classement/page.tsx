'use client';
import Image from 'next/image';
import BottomNavigationTongue from '@/components/features/Navigation/BottomNavigationTongue';
import { Cat } from '@/types/cat';
import Header from '@/components/features/Navigation/Header';
import { useCats } from '@/hooks/useCats';


function Podium({ cats }: { cats: Cat[] }) {
    return (
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex justify-center items-end gap-16 mb-8 relative w-full">
          <div className="flex flex-col items-center w-80 relative">
            <div className="bg-gray-200 rounded-xl w-56 h-56 flex items-center justify-center mb-2 relative overflow-hidden z-10">
              <Image src={cats[1].url} alt={cats[1].name || cats[1].id} fill className="object-cover" />
            </div>
            <div className="bg-gray-400 w-72 h-28 rounded-t-md mb-2 z-0 relative flex items-center justify-center" style={{background: 'linear-gradient(180deg, #C0C0C0 60%, #b0b0b0 100%)'}}>
              <span className="text-6xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none">🥈</span>
            </div>
            <div className="text-lg font-semibold">{cats[1].name || cats[1].id}</div>
            <div className="text-gray-500 text-sm">Score : {cats[1].score}pts</div>
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-400 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg z-20">2</div>
          </div>
          <div className="flex flex-col items-center w-96 z-10 relative">
            <div className="bg-gray-300 rounded-xl w-64 h-64 flex items-center justify-center mb-2 relative overflow-hidden border-4 border-blue-900 z-10">
              <Image src={cats[0].url} alt={cats[0].name || cats[0].id} fill className="object-cover" />
            </div>
            <div className="w-80 h-36 rounded-t-md mb-2 z-0 relative flex items-center justify-center" style={{background: 'linear-gradient(180deg, #FFD700 60%, #e6c200 100%)'}}>
              <span className="text-7xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none">🏆</span>
            </div>
            <div className="text-xl font-bold">{cats[0].name || cats[0].id}</div>
            <div className="text-gray-700 text-base">Score : {cats[0].score}pts</div>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-900 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl z-20">1</div>
          </div>
          <div className="flex flex-col items-center w-80 relative">
            <div className="bg-gray-200 rounded-xl w-56 h-56 flex items-center justify-center mb-2 relative overflow-hidden z-10">
              <Image src={cats[2].url} alt={cats[2].name || cats[2].id} fill className="object-cover" />
            </div>
            <div className="w-72 h-24 rounded-t-md mb-2 z-0 relative flex items-center justify-center" style={{background: 'linear-gradient(180deg, #cd7f32 60%, #b87333 100%)'}}>
              <span className="text-6xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none">🥉</span>
            </div>
            <div className="text-lg font-semibold">{cats[2].name || cats[2].id}</div>
            <div className="text-gray-500 text-sm">Score : {cats[2].score}pts</div>
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#cd7f32] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg z-20">3</div>
          </div>
        </div>
      </div>
    );
  }
  
  function CatGrid({ cats }: { cats: Cat[] }) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 max-w-6xl mx-auto">
        {cats.map((cat: Cat, idx: number) => (
          <div key={cat.id || cat.name} className="flex flex-col items-center bg-white rounded-xl shadow p-4 relative">
            <div className="w-28 h-28 rounded-lg overflow-hidden mb-2 relative">
              <Image src={cat.url} alt={cat.name || cat.id} fill className="object-cover" />
            </div>
            <div className="text-base font-semibold">{cat.name || cat.id}</div>
            <div className="text-gray-500 text-sm">Score : {cat.score} pts</div>
            <div className="absolute -top-3 left-2 bg-white border border-gray-300 rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm">{idx + 4}</div>
          </div>
        ))}
      </div>
    );
  }
  
  export default function ClassementPage() {
    const { cats, loading, error } = useCats();
  
    return (
      <>
        <Header />
        <main className="pb-32 pt-8 bg-gray-50 min-h-screen">
          {loading && <div className="text-center text-lg py-8">Chargement du classement...</div>}
          {error && <div className="text-center text-red-500 py-8">Erreur : {error}</div>}
          {cats && (
            <>
              <Podium cats={cats.slice(0, 3)} />
              <CatGrid cats={cats.slice(3)} />
            </>
          )}
          <BottomNavigationTongue
            href="/"
            label="Revenir au vote"
            sublabel="12 matchs joués"
          />
        </main>
      </>
    );
  } 