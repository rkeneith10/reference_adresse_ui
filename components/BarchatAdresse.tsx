"use client";
import { AdresseAttributes } from "@/app/api/models/adresseModel";
import { SectionCommunaleAttributes } from "@/app/api/models/sectionCommunalModel";
import { VilleAttributes } from "@/app/api/models/villeModel";
import { Spinner } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Chart from "react-google-charts";

export const options = {
  chart: {
    title: "Nombre de sections communales et adresses par ville",
  },
};

const BarChartAdresse: React.FC = () => {
  const [sections, setSections] = useState<SectionCommunaleAttributes[]>([]);
  const [addresses, setAddresses] = useState<AdresseAttributes[]>([]);
  const [villes, setVilles] = useState<VilleAttributes[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sectionResponse = await axios.get('/api/sectionCommunalCtrl');
        const addressesResponse = await axios.get('/api/adresseCtrl')
        const communesResponse = await axios.get('/api/villeCtrl')
        setSections(sectionResponse.data.data);
        setAddresses(addressesResponse.data.data);
        setVilles(communesResponse.data.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const dataByCommune = villes.map((ville) => {
    const sectionCount = sections.filter(section => section.id_ville === ville.id_commune).length;
    const addressCount = sections.reduce((acc, section) => {
      if (section.id_ville === ville.id_ville) {
        return acc + addresses.filter(address => address.id_sectioncommunale === section.id_sectioncommunale).length;
      }
      return acc;
    }, 0);
    return [ville.libelle, sectionCount, addressCount];
  });


  const chartData = [
    ["Communes", "Nombre de sections", "Nombre d'adresses"],
    ...dataByCommune,
  ];

  return (
    <>
      <div className="bg-white rounded-md shadow-md p-5">
        {loading ? (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <Spinner size="lg" color="primary" />
          </div>
        ) : (
          <Chart
            chartType="Bar"
            data={chartData}
            options={options}
            width="100%"
            height="400px"
          />
        )}
      </div>
    </>
  );
};

export default BarChartAdresse;
