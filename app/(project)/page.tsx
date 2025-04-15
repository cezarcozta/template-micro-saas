import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <div className="text-4xl font-bold">LANDING PAGE</div>
      <Link href="/login">
        <button>
          Login
        </button>
      </Link>
    </main>
  );
}
