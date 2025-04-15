import { handleGoogleAuth } from "@/app/actions/handleGoogleAuth";
import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  return (
    <main className="flex flex-col gap-15 items-center justify-center h-screen">
      <div className="text-4xl font-bold">PRIVATE DASHBOARD</div>
      <p>{session?.user?.email ? session.user.email : "usuario nao logado"}</p>
      {session?.user?.email && (
        <form action={handleGoogleAuth}>
          <button type="submit">LOGOUT</button>
        </form>
      )}
    </main>
  );
}
