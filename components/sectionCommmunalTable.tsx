import { Button } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { FaChevronLeft, FaChevronRight, FaRegEye, FaRegTrashAlt } from "react-icons/fa";
import { SectionCommuneAttributes } from "../app/api/models/sectionCommunalModel";

interface SectionCommunaleTableProps {
  comm: SectionCommuneAttributes[];
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  onDelete: (id: number) => void;
  getVilleNameById: (id: number) => string,
}

const SectionCommunaleTable: React.FC<SectionCommunaleTableProps> = ({
  comm,
  searchTerm,
  currentPage,
  itemsPerPage,
  setCurrentPage,
  onDelete,
  getVilleNameById
}) => {
  const filteredSection = comm.filter((c) =>
    c.libelle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min((currentPage + 1) * itemsPerPage, filteredSection.length);
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
                Section Communale
              </th>

              <th scope="col" className="px-6 py-3">
                Commune
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredSection.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Aucune section communale trouv&eacute;e
                </td>
              </tr>
            ) : (
              filteredSection.slice(startIndex, endIndex).map((co, index) => (
                <tr key={co.id_sectioncommune}>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {index + 1}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {co.libelle}
                  </td>

                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {getVilleNameById(co.id_ville)}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        colorScheme="red"
                        mr={2}
                        variant="ghost"
                        onClick={() => onDelete(co.id_sectioncommune)}
                        p={0}
                        minWidth="auto"
                      >
                        <FaRegTrashAlt className="text-lg" />
                      </Button>

                      <Link href={`/sectioncommunales/${co.id_sectioncommune}`}>
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
        {[...Array(Math.ceil(filteredSection.length / itemsPerPage))].map((_, index) => (
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
          disabled={currentPage === Math.ceil(filteredSection.length / itemsPerPage) - 1}
          className="mx-1 py-1 px-3 rounded-full hover:bg-gray-300"
        >
          <FaChevronRight className="text-gray-500 h-2 w-2" />
        </button>
      </div>
    </div>
  )
}

export default SectionCommunaleTable
