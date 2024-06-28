"use client";
import axios from "axios";

import { Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Chart from "react-google-charts";
import { CountryAttributes } from "../app/api/models/paysModel";
export const options = {
  chart: {
    title: "Nombre pays par continent",
  },
};

const BarChart: React.FC = () => {
  const [countries, setCountries] = useState<CountryAttributes[]>([]);
  const [loading, setLoading] = useState<Boolean>(true)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/paysCtrl");
        setCountries(response.data.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching products:", error);
      }
    };
    fetchData();
  }, []);
  // Count the number of countries in each continent
  const countriesByContinent = countries.reduce(
    (acc: { [continent: string]: number }, country) => {
      const continent = country.continent;
      if (!acc[continent]) {
        acc[continent] = 1;
      } else {
        acc[continent]++;
      }
      return acc;
    },
    {}
  );

  // Convert the counts into an array of arrays for the chart data
  const chartData = Object.entries(countriesByContinent).map(
    ([continent, count]) => [continent, count]
  );

  // Add column headers to the chart data
  chartData.unshift(["Continents", "Nombre de pays"]);

  return (
    <>
      <div className="bg-white rounded-md shadow-md p-5">
        {loading ? (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <Spinner size="lg" color="primary" />

          </div>
        ) : (<Chart
          chartType="Bar"
          data={chartData}
          options={options}
          width="100%"
          height="400px"
        />)}

      </div>
    </>
  );
};

export default BarChart;
