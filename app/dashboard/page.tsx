"use client";
import Chart from "@/components/barchart";
import BarChartAdresse from "@/components/BarchatAdresse";
import RootLayout from "@/components/rootLayout";
import { Button, Grid, GridItem, Spinner } from "@chakra-ui/react";
import axios from "axios";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaRegFlag, FaTreeCity } from "react-icons/fa6";
import { AdresseAttributes } from "../api/models/adresseModel";
import { CountryAttributes } from "../api/models/paysModel";
import { CommuneAttributes } from "../api/models/communeModel";

const Home: React.FC = () => {
  const [countries, setCountries] = useState<CountryAttributes[]>([]);
  const [commune, setCommune] = useState<CommuneAttributes[]>([])
  const [adresse, setAdresse] = useState<AdresseAttributes[]>([])
  const [loading, setLoading] = useState<boolean>(true);
  const [dataSubdivision, setDataSubdivision] = useState([])
  const router = useRouter();


  useEffect(() => {
    document.title = "Tableau de bord";


    const fetchData = async () => {
      try {
        const response = await axios.get("/api/paysCtrl");
        const responseadresse = await axios.get("/api/adresseCtrl")
        const responseVille = await axios.get("/api/communeCtrl")
        setCountries(response.data.data);
        setAdresse(responseadresse.data.data)
        setCommune(responseVille.data.data)
        setLoading(false);
      } catch (error) {
        console.error("Error fetching :", error);
      }
    };
    const fetchDataSubdivision = async () => {
      try {
        const response = await axios.get("/api/subdivision")
        setDataSubdivision(response.data)

      } catch (error) {

      }
    }
    fetchDataSubdivision();
    fetchData();

  }, []);


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
                    <Link href="../villes">
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
            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6} p={4}>
              <GridItem>

                <BarChartAdresse />
              </GridItem>
              <GridItem>
                <Chart />
              </GridItem>
            </Grid>

            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6} p={4}>
              <GridItem>
                {/*---------*/}
              </GridItem>
              <GridItem>
                {/* <Subdivision data={dataSubdivision} /> */}
              </GridItem>
            </Grid>
          </>
        )}
      </>
    </RootLayout>
  );


};

export default Home;
