"use client";
import Chart from "@/components/barchart";
import RootLayout from "@/components/rootLayout";
import { Spinner } from "@nextui-org/react";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaRegFlag, FaTreeCity } from "react-icons/fa6";
import { CountryAttributes } from "../api/models/paysModel";

const Home: React.FC = () => {
  const [countries, setCountries] = useState<CountryAttributes[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const router = useRouter();


  useEffect(() => {
    document.title = "Tableau de bord";


    const fetchData = async () => {
      try {
        const response = await axios.get("/api/paysCtrl");
        setCountries(response.data.data);
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
              <div className="w-full md:w-1/3 p-4">
                <div className="bg-white shadow-md rounded-md p-6 text-center">
                  <div className="flex justify-center items-center mb-4">
                    <h2 className="text-lg font-semibold text-blue-600">Pays</h2>
                    <span className="ml-2">
                      <FaRegFlag size={20} className="text-blue-500" />
                    </span>
                  </div>
                  <p className="font-bold text-lg text-blue-500">
                    {countries.length}
                  </p>
                </div>
              </div>
              <div className="w-full md:w-1/3 p-4">
                <div className="bg-white shadow-md rounded-md p-6 text-center">
                  <div className="flex justify-center items-center mb-4">
                    <h2 className="text-lg font-semibold text-blue-600">Villes</h2>
                    <span className="ml-2">
                      <FaTreeCity size={20} className="text-blue-500" />
                    </span>
                  </div>
                  <p className="font-bold text-lg text-blue-500">110</p>
                </div>
              </div>
              <div className="w-full md:w-1/3 p-4">
                <div className="bg-white shadow-md rounded-md p-6 text-center">
                  <div className="flex justify-center items-center mb-4">
                    <h2 className="text-lg font-semibold text-blue-600">Adresses</h2>
                    <span className="ml-2">
                      <FaMapMarkerAlt size={20} className="text-blue-500" />
                    </span>
                  </div>
                  <p className="font-bold text-lg text-blue-500">127</p>
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
