import { Button } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { FaChevronLeft, FaChevronRight, FaRegEye, FaRegTrashAlt } from "react-icons/fa";
import { DepartementAttributes } from "../app/api/models/departementModel";


interface DepartementTableProps {
  dept: DepartementAttributes[];
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  onDelete: (id: number) => void;
  getCountryNameById: (id: number) => string,
}
const DepartementTable: React.FC<DepartementTableProps> = ({
  dept,
  searchTerm,
  currentPage,
  itemsPerPage,
  setCurrentPage,
  onDelete,
  getCountryNameById
}) => {
  const filteredDepartements = dept.filter((dp) =>
    dp.libelle_departement.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min((currentPage + 1) * itemsPerPage, filteredDepartements.length);
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
                D&eacute;partement
              </th>
              <th scope="col" className="px-6 py-3">
                Code d&eacute;partement
              </th>
              <th scope="col" className="px-6 py-3">
                Chef-Lieux
              </th>
              <th scope="col" className="px-6 py-3">
                Pays Reference
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredDepartements.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Aucun departement trouv&eacute;
                </td>
              </tr>
            ) : (
              filteredDepartements.slice(startIndex, endIndex).map((dp, index) => (
                <tr key={dp.id_departement}>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {index + 1}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {dp.libelle_departement}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {dp.code_departement}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {dp.chef_lieux}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {getCountryNameById(dp.id_pays)}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => onDelete(dp.id_departement)}
                        p={0}
                        minWidth="auto"
                        mr={2}
                      >
                        <FaRegTrashAlt className="text-lg" />
                      </Button>

                      <Link href={`/departements/${dp.id_departement}`}>
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
        {[...Array(Math.ceil(filteredDepartements.length / itemsPerPage))].map((_, index) => (
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
          disabled={currentPage === Math.ceil(filteredDepartements.length / itemsPerPage) - 1}
          className="mx-1 py-1 px-3 rounded-full hover:bg-gray-300"
        >
          <FaChevronRight className="text-gray-500 h-2 w-2" />
        </button>
      </div>
    </div>
  )
}

export default DepartementTable
