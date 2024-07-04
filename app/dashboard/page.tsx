"use client";
import Chart from "@/components/barchart";
import RootLayout from "@/components/rootLayout";
import { Button, Spinner } from "@chakra-ui/react";
import axios from "axios";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaRegFlag, FaTreeCity } from "react-icons/fa6";
import { AdresseAttributes } from "../api/models/adresseModel";
import { CommuneAttributes } from "../api/models/communeModel";
import { CountryAttributes } from "../api/models/paysModel";

const Home: React.FC = () => {
  const [countries, setCountries] = useState<CountryAttributes[]>([]);
  const [commune, setCommune] = useState<CommuneAttributes[]>([])
  const [adresse, setAdresse] = useState<AdresseAttributes[]>([])
  const [loading, setLoading] = useState<Boolean>(true);
  const router = useRouter();


  useEffect(() => {
    document.title = "Tableau de bord";


    const fetchData = async () => {
      try {
        const response = await axios.get("/api/paysCtrl");
        const responseadresse = await axios.get("/api/adresseCtrl")
        const responseCommune = await axios.get("/api/communeCtrl")
        setCountries(response.data.data);
        setAdresse(responseadresse.data.data)
        setCommune(responseCommune.data.data)
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchData();
  }, []);


  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();

      if (!session) {
        router.push('/'); // Redirection vers la page d'accueil si la session n'est pas active
      }
    };

    checkSession();
  }, [router]);
  return (
    <RootLayout isAuthenticated={true}>
      <>
        {loading ? (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <Spinner size="lg" color="primary" />
            <div className="loader">Chargement en cours...</div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap justify-center md:justify-between">
              <div className="w-full md:w-1/3 p-4 relative">
                <div className="bg-white shadow-md rounded-md p-6 text-center">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <h2 className="text-lg font-semibold text-blue-600">Pays</h2>
                      <span className="ml-2">
                        <FaRegFlag size={20} className="text-blue-500" />
                      </span>
                    </div>
                    <Link href="../pays">
                      <Button colorScheme='blue' variant='outline'>
                        Voir tous
                      </Button>
                    </Link>
                  </div>
                  <p className="font-bold text-2xl text-blue-500">{countries.length}</p>
                </div>
              </div>

              <div className="w-full md:w-1/3 p-4 relative">
                <div className="bg-white shadow-md rounded-md p-6 text-center">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <h2 className="text-lg font-semibold text-blue-600">Villes</h2>
                      <span className="ml-2">
                        <FaTreeCity size={20} className="text-blue-500" />
                      </span>
                    </div>
                    <Link href="../communes">
                      <Button colorScheme='blue' variant='outline'>
                        Voir tous
                      </Button>
                    </Link>
                  </div>
                  <p className="font-bold text-2xl text-blue-500">{commune.length}</p>
                </div>
              </div>


              <div className="w-full md:w-1/3 p-4 relative">
                <div className="bg-white shadow-md rounded-md p-6 text-center">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <h2 className="text-lg font-semibold text-blue-600">Adresses</h2>
                      <span className="ml-2">
                        <FaMapMarkerAlt size={20} className="text-blue-500" />
                      </span>
                    </div>
                    <Link href="../adresses">
                      <Button colorScheme='blue' variant='outline'>
                        Voir tous
                      </Button>
                    </Link>
                  </div>
                  <p className="font-bold text-2xl text-blue-500">{adresse.length}</p>
                </div>
              </div>

            </div>
            <div className="">
              <Chart />
            </div>
          </>
        )}
      </>
    </RootLayout>
  );


};

export default Home;
