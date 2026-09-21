"use client"
import RootLayout from "@/components/rootLayout";
import { getSession } from 'next-auth/react';
import dynamic from "next/dynamic";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const MapComponent = dynamic(() => import("../../components/MapComponent"), { ssr: false });

const MapAdresse = () => {
  const router = useRouter();
  useEffect(() => {
    document.title = "Carte des Adresses";
    const checkSession = async () => {
      const session = await getSession();

      if (!session) {
        router.push('/');
      }
    };

    checkSession();
  }, [router]);

  return (
    <RootLayout isAuthenticated={true}>
      <div className="bg-gray-100 min-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h1 className="font-semibold text-xl text-gray-900">
              Cartographie des Adresses
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Visualisation géographique et localisation interactive des adresses enregistrées
            </p>
          </div>
        </div>
        <MapComponent />
      </div>
    </RootLayout>
  );
};

export default MapAdresse;
