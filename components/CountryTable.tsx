import { formatValue } from "@/lib/helper";
import { Button } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { FaRegEye, FaRegTrashAlt } from "react-icons/fa";
import { CountryAttributes } from "../app/api/models/paysModel";
import Pagination from "./Pagination";

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
    (country.libelle_pays ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);
  const safeCurrentPage = totalPages > 0 ? Math.min(currentPage, totalPages - 1) : 0;
  const startIndex = safeCurrentPage * itemsPerPage;
  const endIndex = Math.min((safeCurrentPage + 1) * itemsPerPage, filteredCountries.length);

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
                <td colSpan={7} className="text-center py-4 font-semibold">
                  Pas de pays
                </td>
              </tr>
            ) : (
              filteredCountries.slice(startIndex, endIndex).map((country, index) => (
                <tr key={country.indicatif_tel || country.id_pays || index} className="bg-white hover:bg-gray-50">
                  <td className="text-left py-3 px-4 border-b border-gray-200">{startIndex + index + 1}</td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">{formatValue(country.libelle_pays)}</td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">{formatValue(country.code_pays)}</td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">{formatValue(country.continent)}</td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">{formatValue(country.indicatif_tel)}</td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">{formatValue(country.fuseau_horaire)}</td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    <div className="flex">
                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => onDelete(country.id_pays)}
                        p={0}
                        minWidth="auto"
                        mr={2}
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

      <Pagination
        currentPage={safeCurrentPage}
        totalItems={filteredCountries.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        previousLabel="Precedent"
        nextLabel="Suivant"
      />
    </>
  );
};

export default CountryTable;
