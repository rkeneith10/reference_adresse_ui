import { TooltipAttributes } from "@/app/api/models/tooltipModel";
import { Button } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { FaChevronLeft, FaChevronRight, FaRegEye, FaRegTrashAlt } from "react-icons/fa";


interface AdresseTableProps {
  aide: TooltipAttributes[];
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  onDelete: (id: number) => void;
}

const AideTable: React.FC<AdresseTableProps> = ({ aide = [],
  searchTerm,
  currentPage,
  itemsPerPage,
  setCurrentPage,
  onDelete,
}) => {
  const filteredAide = aide.filter((a) =>
    a.nom_champ.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min((currentPage + 1) * itemsPerPage, filteredAide.length);

  return (
    <div className="mt-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                #
              </th>
              <th scope="col" className="px-6 py-3">
                Nom Application
              </th>
              <th scope="col" className="px-6 py-3">
                Nom Champ
              </th>
              <th scope="col" className="px-6 py-3">
                Message
              </th>

              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAide.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Aucune donn&eacute;e trouv&eacute;e
                </td>
              </tr>
            ) : (
              filteredAide.slice(startIndex, endIndex).map((a, index) => (
                <tr key={a.id}>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {index + 1}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {a.nom_application}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {a.nom_champ}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {a.message_tooltip}
                  </td>

                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => onDelete(a.id)}
                        p={0}
                        minWidth="auto"
                        mr={2}
                      >
                        <FaRegTrashAlt className="text-lg" />
                      </Button>

                      <Link href={`/aide/${a.id}`}>
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
        {[...Array(Math.ceil(filteredAide.length / itemsPerPage))].map((_, index) => (
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
          disabled={currentPage === Math.ceil(filteredAide.length / itemsPerPage) - 1}
          className="mx-1 py-1 px-3 rounded-full hover:bg-gray-300"
        >
          <FaChevronRight className="text-gray-500 h-2 w-2" />
        </button>
      </div>
    </div>
  )
}

export default AideTable
