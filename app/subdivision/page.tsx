"use client";
import RootLayout from "@/components/rootLayout";
import SubdivisionGeographique from '@/components/SubdivisionGeographique';
import { Spinner } from "@chakra-ui/react";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';

const Subdivision = () => {
  const router = useRouter();
  const [dataSubdivision, setDataSubdivision] = useState([])
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    document.title = "Subdivision geographique";

    const fetchDataSubdivision = async () => {
      try {
        const response = await axios.get("/api/subdivision")
        setDataSubdivision(response.data)

      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    fetchDataSubdivision();
  }, [])

  useEffect(() => {
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
      {loading ? (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
          <Spinner size="lg" color="primary" />
          <div className="loader">Chargement en cours...</div>
        </div>
      ) : (
        <div>
          <h3 className="font-semibold text-xl mb-8">Subdivision Geographique des pays</h3>
          <SubdivisionGeographique data={dataSubdivision} />
        </div>
      )}
    </RootLayout>
  )
}

export default Subdivision
