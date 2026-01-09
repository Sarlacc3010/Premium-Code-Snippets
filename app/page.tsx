"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  const handleCheckout = async () => {
    // 1. Pedimos la URL al backend
    const response = await fetch("/api/checkout", {
      method: "POST",
    });

    const data = await response.json();

    if (data.url) {
      // 2. Redirección nativa del navegador (Solución simple y sin errores)
      window.location.href = data.url;
    } else {
      console.error("Error al crear sesión:", data);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50 text-black">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex flex-col gap-10">
        <h1 className="text-4xl font-bold text-center">Premium Code Snippets</h1>

        {!session ? (
          // ESTADO: NO LOGUEADO
          <div className="text-center p-10 border rounded-xl bg-white shadow-lg">
            <p className="mb-4">Debes iniciar sesión para ver los snippets.</p>
            <button
              onClick={() => signIn("google")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Iniciar sesión con Google
            </button>
          </div>
        ) : (
          // ESTADO: LOGUEADO
          <div className="text-center p-10 border rounded-xl bg-white shadow-lg w-full max-w-md mx-auto">
            <img
              src={session.user?.image || ""}
              alt="Avatar"
              referrerPolicy="no-referrer" 
              className="w-20 h-20 rounded-full mx-auto mb-4"
            />
            <p className="text-xl mb-2">Hola, <strong>{session.user?.name}</strong></p>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-bold text-lg mb-2">Plan Premium</h3>
              <p className="text-3xl font-bold text-green-600 mb-4">$10 USD</p>
              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-md flex justify-center items-center gap-2"
              >
                <span>💳</span> Pagar Ahora
              </button>
            </div>

            <button
              onClick={() => signOut()}
              className="block mt-6 text-sm text-red-500 hover:underline mx-auto"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </main>
  );
}