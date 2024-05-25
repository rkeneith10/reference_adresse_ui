"use client";
import Chart from "@/components/barchart";
import RootLayout from "@/components/rootLayout";
import countries from "@/data/pays";
import React, { useEffect } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaRegFlag, FaTreeCity } from "react-icons/fa6";

const Home: React.FC = () => {
  useEffect(() => {
    document.title = "Tableau de bord";
  }, []);
  return (
    <RootLayout isAuthenticated={true}>
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
    </RootLayout>
  );
};

export default Home;
