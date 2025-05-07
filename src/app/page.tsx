export default function Home() {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
        <main className="text-center">
          <div className="mt-4 mb-4">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
              Fast Start Web
            </h1>
            <div>
              <p className="text-lg text-gray-400">
                Next.js + React + Node + Vercel + Firebase
              </p>
              <p className="text-base text-gray-500 mt-2">
                starter kit
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
