"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function SuccessContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (email) {
      const registerPremium = async () => {
        await supabase
          .from('premium_users')
          .upsert([{ email }]);
        setLoading(false);
      };
      registerPremium();
    } else {
      setLoading(false);
    }
  }, [email]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-green-50 text-center p-4">
      <h1 className="text-6xl mb-4">🎉</h1>
      <h2 className="text-4xl font-bold text-green-800 mb-4">¡Pago Exitoso!</h2>
      
      {loading ? (
        <p className="text-gray-600">Activando tu cuenta Premium...</p>
      ) : email ? (
        <p className="text-xl text-green-700 mb-8">
          Tu cuenta <strong>{email}</strong> ya tiene acceso total.
        </p>
      ) : (
        <p className="text-xl text-red-600 mb-8">
          No se encontró el email en la transacción.
        </p>
      )}
      
      <Link href="/" className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition font-bold shadow-lg">
        Volver a los Snippets
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SuccessContent />
    </Suspense>
  );
}