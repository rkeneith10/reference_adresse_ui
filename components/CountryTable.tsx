// CountryTable.tsx
import { Button } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { FaChevronLeft, FaChevronRight, FaRegEye, FaRegTrashAlt } from "react-icons/fa";
import { CountryAttributes } from "../app/api/models/paysModel";

interface CountryTableProps {
  countries: CountryAttributes[];
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  onDelete: (id: number) => void;
}

const CountryTable: React.FC<CountryTableProps> = ({
  countries,
  searchTerm,
  currentPage,
  itemsPerPage,
  setCurrentPage,
  onDelete,
}) => {
  const filteredCountries = countries.filter((country) =>
    country.libelle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min((currentPage + 1) * itemsPerPage, filteredCountries.length);

  return (
    <>
      <div className="relative overflow-x-scroll">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">#</th>
              <th scope="col" className="px-6 py-3">Pays</th>
              <th scope="col" className="px-6 py-3">Code pays</th>
              <th scope="col" className="px-6 py-3">Continent</th>
              <th scope="col" className="px-6 py-3">Ind. Telephonique</th>
              <th scope="col" className="px-6 py-3">Fuseau Horaire</th>
              <th scope="col" className="px-6 py-3"><span className="sr-only">Action</span></th>
            </tr>
          </thead>
          <tbody>
            {filteredCountries.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 font-semibold">
                  Pas de pays
                </td>
              </tr>
            ) : (
              filteredCountries.slice(startIndex, endIndex).map((country, index) => (
                <tr key={country.indicatif_tel} className="bg-white hover:bg-gray-50">
                  <td className="text-left py-3 px-4 border-b border-gray-200">{index + 1}</td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">{country.libelle}</td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">{country.code_pays}</td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">{country.continent}</td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">{country.indicatif_tel}</td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">{country.fuseau_horaire}</td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    <div className="flex">
                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => onDelete(country.id_pays)}
                        p={0}
                        minWidth="auto"
                      >
                        <FaRegTrashAlt className="text-lg" />
                      </Button>

                      <Link href={`/pays/${country.id_pays}`}>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          variant="ghost"
                          p={0}
                          minWidth="auto"
                        >
                          <FaRegEye className="text-lg" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center my-4">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 0}
          className="mx-1 py-1 px-3 rounded-full hover:bg-gray-300"
        >
          <FaChevronLeft className="text-gray-500 h-2 w-2" />
        </button>
        {[...Array(Math.ceil(filteredCountries.length / itemsPerPage))].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`mx-1 py-1 px-3 rounded-full ${currentPage === index ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredCountries.length / itemsPerPage) - 1}
          className="mx-1 py-1 px-3 rounded-full hover:bg-gray-300"
        >
          <FaChevronRight className="text-gray-500 h-2 w-2" />
        </button>
      </div>
    </>
  );
};

export default CountryTable;
