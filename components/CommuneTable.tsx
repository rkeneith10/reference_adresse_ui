import { Button } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { FaChevronLeft, FaChevronRight, FaRegEye, FaRegTrashAlt } from "react-icons/fa";
import { CommuneAttributes } from "../app/api/models/communeModel";

interface CommuneTableProps {
  comm: CommuneAttributes[];
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  onDelete: (id: number) => void;
  getDepartementNameById: (id: number) => string,
}

const CommuneTable: React.FC<CommuneTableProps> = ({
  comm,
  searchTerm,
  currentPage,
  itemsPerPage,
  setCurrentPage,
  onDelete,
  getDepartementNameById
}) => {
  const filteredCommune = comm.filter((c) =>
    c.libelle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min((currentPage + 1) * itemsPerPage, filteredCommune.length);
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
                Commune
              </th>
              <th scope="col" className="px-6 py-3">
                Code postal
              </th>
              <th scope="col" className="px-6 py-3">
                Longitude
              </th>
              <th scope="col" className="px-6 py-3">
                Lattitude
              </th>
              <th scope="col" className="px-6 py-3">
                Departement
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCommune.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Aucune commune trouv&eacute;e
                </td>
              </tr>
            ) : (
              filteredCommune.slice(startIndex, endIndex).map((co, index) => (
                <tr key={co.id_commune}>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {index + 1}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {co.libelle}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {co.code_postal}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {co.longitude}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {co.lattitude}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {getDepartementNameById(co.id_departement)}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        colorScheme="red"
                        mr={2}
                        variant="ghost"
                        onClick={() => onDelete(co.id_commune)}
                        p={0}
                        minWidth="auto"
                      >
                        <FaRegTrashAlt className="text-lg" />
                      </Button>

                      <Link href={`/communes/${co.id_commune}`}>
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
        {[...Array(Math.ceil(filteredCommune.length / itemsPerPage))].map((_, index) => (
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
          disabled={currentPage === Math.ceil(filteredCommune.length / itemsPerPage) - 1}
          className="mx-1 py-1 px-3 rounded-full hover:bg-gray-300"
        >
          <FaChevronRight className="text-gray-500 h-2 w-2" />
        </button>
      </div>
    </div>
  )
}

export default CommuneTable
