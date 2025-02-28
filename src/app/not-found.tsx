export const dynamic = "force-dynamic";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-market-background dark:bg-marketDark-background">
      <div className="text-center p-8 bg-market-card dark:bg-marketDark-card rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-market-primary dark:text-marketDark-primary mb-4">
          404 - Página não encontrada
        </h1>
        <p className="text-market-text-primary dark:text-marketDark-text-primary mb-6">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link
          href="/"
          className="inline-block bg-market-primary hover:bg-market-hover dark:bg-marketDark-primary dark:hover:bg-marketDark-hover text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}
