import { Button } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { FaChevronLeft, FaChevronRight, FaRegEye, FaRegTrashAlt } from "react-icons/fa";
import { AdresseAttributes } from "../app/api/models/adresseModel";


interface AdresseTableProps {
  adresse: AdresseAttributes[];
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  onDelete: (id: number) => void;
  getCommuneNameById: (id: number) => string,
}

const AdresseTable: React.FC<AdresseTableProps> = ({ adresse,
  searchTerm,
  currentPage,
  itemsPerPage,
  setCurrentPage,
  onDelete,
  getCommuneNameById }) => {
  const filteredAdresse = adresse.filter((adr) =>
    adr.libelle_adresse.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min((currentPage + 1) * itemsPerPage, filteredAdresse.length);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                #
              </th>
              <th scope="col" className="px-6 py-3">
                Libelle
              </th>
              <th scope="col" className="px-6 py-3">
                Numero rue
              </th>
              <th scope="col" className="px-6 py-3">
                Code postal
              </th>
              <th scope="col" className="px-6 py-3">
                Cle unicite
              </th>
              <th scope="col" className="px-6 py-3">
                Statut
              </th>
              <th scope="col" className="px-6 py-3">
                Commune
              </th>
              <th scope="col" className="px-6 py-3">
                Section Communale
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAdresse.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Aucune adresse trouv&eacute;e
                </td>
              </tr>
            ) : (
              filteredAdresse.slice(startIndex, endIndex).map((adr, index) => (
                <tr key={adr.id_adresses}>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {index + 1}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {adr.libelle_adresse}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {adr.numero_rue}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {adr.code_postal ? adr.code_postal : "XXXXX"}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {adr.cle_unicite}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {adr.statut}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {adr.villeRecord ? adr.villeRecord : adr.id_commune !== undefined
                      ? getCommuneNameById(adr.id_commune)
                      : ""}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {adr.section_communale}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    <div className="flex space-x-2">
                      {adr.from === "moi" ? (
                        <>
                          <Button
                            size="sm"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => onDelete(adr.id_adresses)}
                            p={0}
                            minWidth="auto"
                            mr={2}
                          >
                            <FaRegTrashAlt className="text-lg" />
                          </Button><Link href={`/adresses/${adr.id_adresses}`}>
                            <Button
                              size="sm"
                              colorScheme="blue"
                              variant="ghost"
                              p={0}
                              minWidth="auto"
                            >
                              <FaRegEye className="text-lg" />
                            </Button>
                          </Link></>
                      ) : (<span className="text-gray-400"> </span>)}
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
        {[...Array(Math.ceil(filteredAdresse.length / itemsPerPage))].map((_, index) => (
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
          disabled={currentPage === Math.ceil(filteredAdresse.length / itemsPerPage) - 1}
          className="mx-1 py-1 px-3 rounded-full hover:bg-gray-300"
        >
          <FaChevronRight className="text-gray-500 h-2 w-2" />
        </button>
      </div>
    </div>
  )
}

export default AdresseTable
