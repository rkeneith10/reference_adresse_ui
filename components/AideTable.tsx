import { formatValue } from "@/lib/helper";
import { TooltipAttributes } from "@/app/api/models/tooltipModel";
import { Button } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { FaRegEye, FaRegTrashAlt } from "react-icons/fa";
import Pagination from "./Pagination";

interface AideTableProps {
  aide: TooltipAttributes[];
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  onDelete: (id: number) => void;
}

const AideTable: React.FC<AideTableProps> = ({
  aide = [],
  searchTerm,
  currentPage,
  itemsPerPage,
  setCurrentPage,
  onDelete,
}) => {
  const filteredAide = (aide ?? []).filter((a) =>
    (a.nom_champ ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAide.length / itemsPerPage);
  const safeCurrentPage = totalPages > 0 ? Math.min(currentPage, totalPages - 1) : 0;
  const startIndex = safeCurrentPage * itemsPerPage;
  const endIndex = Math.min((safeCurrentPage + 1) * itemsPerPage, filteredAide.length);

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
                <td colSpan={5} className="text-center py-4">
                  Aucune donn&eacute;e trouv&eacute;e
                </td>
              </tr>
            ) : (
              filteredAide.slice(startIndex, endIndex).map((a, index) => (
                <tr key={a.id_tooltip}>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {startIndex + index + 1}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {formatValue(a.nom_application)}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {formatValue(a.nom_champ)}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {formatValue(a.message_tooltip)}
                  </td>

                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => onDelete(a.id_tooltip)}
                        p={0}
                        minWidth="auto"
                        mr={2}
                      >
                        <FaRegTrashAlt className="text-lg" />
                      </Button>

                      <Link href={`/aide/${a.id_tooltip}`}>
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
        totalItems={filteredAide.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        previousLabel="Precedent"
        nextLabel="Suivant"
      />
    </div>
  );
};

export default AideTable;
