"use client";

import { AdresseAttributes } from "@/app/api/models/adresseModel";
import { CommuneAttributes } from "@/app/api/models/communeModel";
import { Spinner } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Chart from "react-google-charts";

export const options = {
  chart: {
    title: "Nombre d'adresses par commune",
  },
};

const BarChartAdresse: React.FC = () => {
  const [addresses, setAddresses] = useState<AdresseAttributes[]>([]);
  const [commune, setCommune] = useState<CommuneAttributes[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const addressesResponse = await axios.get('/api/adresseCtrl');
        const communesResponse = await axios.get('/api/communeCtrl');
        setAddresses(addressesResponse.data.data);
        setCommune(communesResponse.data.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const dataByCommune = commune.map((comm) => {
    const addressCount = addresses.filter(address => address.id_commune === comm.id_commune).length;
    return [comm.libelle_commune, addressCount];
  });

  const chartData = [
    ["Communes", "Nombre d'adresses"],
    ...dataByCommune,
  ];

  return (
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
  );
};

export default BarChartAdresse;
