import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-green-50 text-center p-4">
      <h1 className="text-6xl mb-4">🎉</h1>
      <h2 className="text-4xl font-bold text-green-800 mb-4">¡Pago Exitoso!</h2>
      <p className="text-xl text-green-700 mb-8">Gracias por tu compra. Ahora tienes acceso premium.</p>
      
      <Link href="/" className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition font-bold">
        Volver al Inicio
      </Link>
    </div>
  );
}