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
    document.title = "Map"
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
      <div>
        <MapComponent />
      </div>
    </RootLayout>
  )
}

export default MapAdresse
