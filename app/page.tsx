"use client";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { supabase } from "@/lib/supabase"; 

type Snippet = {
  id: number;
  title: string;
  code: string;
  is_premium: boolean;
};

export default function Home() {
  const { data: session } = useSession();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [isUserPremium, setIsUserPremium] = useState(false); // <--- NUEVO ESTADO

  // 1. Cargar Snippets
  useEffect(() => {
    async function fetchSnippets() {
      const { data } = await supabase.from("snippets").select("*").order('id', { ascending: true });
      if (data) setSnippets(data);
    }
    fetchSnippets();
  }, []);

  // 2. Verificar si el usuario pagó (NUEVO EFFECT)
  useEffect(() => {
    async function checkPremiumStatus() {
      if (session?.user?.email) {
        // Buscamos si su email está en la tabla de pagos
        const { data } = await supabase
          .from("premium_users")
          .select("email")
          .eq("email", session.user.email)
          .single();
        
        if (data) setIsUserPremium(true); // ¡Es VIP!
      } else {
        setIsUserPremium(false);
      }
    }
    checkPremiumStatus();
  }, [session]);

  const handleCheckout = async () => {
    const response = await fetch("/api/checkout", { method: "POST" });
    const data = await response.json();
    if (data.url) window.location.href = data.url;
  };

  return (
    <main className="min-h-screen bg-gray-100 py-10 flex flex-col items-center">
      <div className="w-full max-w-3xl px-4">
        
        {/* CABECERA */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">Premium Code Snippets</h1>
            {isUserPremium && <span className="text-green-600 font-bold text-sm">✨ Miembro Premium Activo</span>}
          </div>

          {!session ? (
            <button onClick={() => signIn("google")} className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition">
              Iniciar Sesión
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
              <img src={session.user?.image || ""} alt="User" referrerPolicy="no-referrer" className="w-8 h-8 rounded-full"/>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-700">{session.user?.name}</span>
                <button onClick={() => signOut()} className="text-xs text-red-500 hover:underline text-left">Cerrar sesión</button>
              </div>
            </div>
          )}
        </div>

        {/* LISTA DE SNIPPETS */}
        <div className="grid gap-6">
          {snippets.map((snippet) => {
            // LÓGICA DE DESBLOQUEO:
            // Es visible si: (NO es premium) O (El usuario pagó)
            const isUnlocked = !snippet.is_premium || isUserPremium;

            return (
              <div key={snippet.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    {snippet.is_premium ? "💎" : "📄"} {snippet.title}
                  </h2>
                  {snippet.is_premium && (
                    <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide border ${isUnlocked ? "bg-green-100 text-green-800 border-green-200" : "bg-yellow-100 text-yellow-800 border-yellow-200"}`}>
                      {isUnlocked ? "Desbloqueado" : "Premium"}
                    </span>
                  )}
                </div>

                <div className="p-6">
                  {isUnlocked ? (
                    // MOSTRAR CÓDIGO (Gratis o Pagado)
                    <div className="bg-slate-900 rounded-lg p-4 relative">
                      <pre className="text-green-400 font-mono text-sm overflow-x-auto">
                        <code>{snippet.code}</code>
                      </pre>
                    </div>
                  ) : (
                    // MOSTRAR CANDADO (Bloqueado)
                    <div className="relative">
                      <div className="bg-slate-900 rounded-lg p-4 blur-sm select-none opacity-50">
                         <pre className="text-gray-500 font-mono text-sm">
                          <code>{"// Código oculto...\n..."}</code>
                        </pre>
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                        <p className="text-gray-900 font-bold mb-3 drop-shadow-md">🔒 Contenido Bloqueado</p>
                        {!session ? (
                          <button onClick={() => signIn("google")} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition">
                            Entrar para ver opciones
                          </button>
                        ) : (
                          <button onClick={handleCheckout} className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold shadow-xl hover:bg-green-500 transition flex items-center gap-2">
                            <span>💳</span> Desbloquear ($10)
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}