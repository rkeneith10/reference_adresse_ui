"use client";
import { AdresseAttributes } from "@/app/api/models/adresseModel";
import { CommuneAttributes } from "@/app/api/models/communeModel";
import { SectionCommuneAttributes } from "@/app/api/models/sectionCommunalModel";
import { Spinner } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Chart from "react-google-charts";

export const options = {
  chart: {
    title: "Nombre de sections communales et adresses par commune",
  },
};

const BarChartAdresse: React.FC = () => {
  const [sections, setSections] = useState<SectionCommuneAttributes[]>([]);
  const [addresses, setAddresses] = useState<AdresseAttributes[]>([]);
  const [communes, setCommunes] = useState<CommuneAttributes[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sectionResponse = await axios.get('/api/sectionCommunalCtrl');
        const addressesResponse = await axios.get('/api/adresseCtrl')
        const communesResponse = await axios.get('/api/communeCtrl')
        setSections(sectionResponse.data.data);
        setAddresses(addressesResponse.data.data);
        setCommunes(communesResponse.data.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const dataByCommune = communes.map((commune) => {
    const sectionCount = sections.filter(section => section.id_commune === commune.id_commune).length;
    const addressCount = sections.reduce((acc, section) => {
      if (section.id_commune === commune.id_commune) {
        return acc + addresses.filter(address => address.id_sectioncommune === section.id_sectioncommune).length;
      }
      return acc;
    }, 0);
    return [commune.libelle, sectionCount, addressCount];
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
