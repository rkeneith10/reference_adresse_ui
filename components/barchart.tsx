"use client";

import countries from "@/data/pays";
import React from "react";
import Chart from "react-google-charts";
export const options = {
  chart: {
    title: "Nombre pays par continent",
  },
};

const BarChart: React.FC = () => {
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
        <Chart
          chartType="Bar"
          data={chartData}
          options={options}
          width="100%"
          height="400px"
        />
      </div>
    </>
  );
};

export default BarChart;
