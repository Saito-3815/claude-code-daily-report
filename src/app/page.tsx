import { ModeToggle } from '@/components/mode-toggle';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="fixed top-4 right-4">
        <ModeToggle />
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">営業日報システム</h1>
        <p className="text-xl text-muted-foreground mb-8">
          shadcn/ui + Tailwind CSS セットアップ完了
        </p>
        <div className="mt-8 p-6 bg-card border rounded-lg shadow-sm">
          <p className="text-card-foreground font-semibold mb-2">✓ Tailwind CSS 正常動作</p>
          <p className="text-card-foreground font-semibold mb-2">
            ✓ shadcn/ui コンポーネント導入完了
          </p>
          <p className="text-card-foreground font-semibold">
            ✓ ダークモード対応（右上のボタンで切り替え可能）
          </p>
        </div>
      </div>
    </main>
  );
}
