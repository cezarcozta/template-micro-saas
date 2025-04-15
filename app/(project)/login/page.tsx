import { handleGoogleAuth } from "@/app/actions/handleGoogleAuth";

export default function Login() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <div className="text-4xl font-bold">LOGIN</div>
      <form action={handleGoogleAuth}>
        <button type="submit">Signin with Google</button>
      </form>
    </main>
  );
}
