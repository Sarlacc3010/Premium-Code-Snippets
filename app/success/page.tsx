"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase";

export default function SuccessPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.email) {
      // Registrar al usuario en la lista VIP
      const registerPremium = async () => {
        await supabase
          .from('premium_users')
          .upsert([{ email: session.user?.email }]); // upsert evita errores si ya existe
        setLoading(false);
      };
      registerPremium();
    }
  }, [session]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-green-50 text-center p-4">
      <h1 className="text-6xl mb-4">🎉</h1>
      <h2 className="text-4xl font-bold text-green-800 mb-4">¡Pago Exitoso!</h2>
      
      {loading ? (
        <p className="text-gray-600">Activando tu cuenta Premium...</p>
      ) : (
        <p className="text-xl text-green-700 mb-8">
          Tu cuenta <strong>{session?.user?.email}</strong> ya tiene acceso total.
        </p>
      )}
      
      <Link href="/" className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition font-bold shadow-lg">
        Volver a los Snippets
      </Link>
    </div>
  );
}