export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">営業日報システム</h1>
        <p className="text-xl text-gray-700">Tailwind CSS セットアップ完了</p>
        <div className="mt-8 p-6 bg-green-100 rounded-lg border-2 border-green-500">
          <p className="text-green-800 font-semibold">
            このスタイルが適用されていれば、Tailwind CSSが正常に動作しています。
          </p>
        </div>
      </div>
    </main>
  );
}
