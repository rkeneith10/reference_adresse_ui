"use client"
import RootLayout from "@/components/rootLayout";
import Link from "next/link";

export default function Unauthorized() {
  return (
    <RootLayout isAuthenticated>
      <div className="flex items-center justify-center min-h-full text-center p-8 animate-fadeIn bg-slate-100">
        <div className="max-w-lg bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-6xl font-bold text-yellow-500 mb-4">401</h1>
          <h2 className="text-3xl font-semibold text-gray-700 mb-6">Oups, vous n&apos;êtes pas autorisé !</h2>
          <p className="text-lg text-gray-500 mb-6">
            Il semble que vous n&apos;ayez pas les permissions nécessaires pour accéder à cette page. Veuillez vous reconnecter ou contacter un administrateur.
          </p>
          <Link href="/dashboard">
          <button className="inline-block bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300" >

            
              Retourner au tableau de bord
            
          </button>
          </Link>

        </div>
      </div>
    </RootLayout>
  );
}