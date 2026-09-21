import { formatValue } from "@/lib/helper";
import { Button } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { FaRegEye, FaRegTrashAlt } from "react-icons/fa";
import { CommuneAttributes } from "../app/api/models/communeModel";
import Pagination from "./Pagination";

interface CommuneTableProps {
  comm: CommuneAttributes[];
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  onDelete: (id: number) => void;
  getDepartementNameById: (id: number) => string;
}

const CommuneTable: React.FC<CommuneTableProps> = ({
  comm,
  searchTerm,
  currentPage,
  itemsPerPage,
  setCurrentPage,
  onDelete,
  getDepartementNameById,
}) => {
  const filteredCommune = comm.filter((c) =>
    (c.libelle_commune ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCommune.length / itemsPerPage);
  const safeCurrentPage = totalPages > 0 ? Math.min(currentPage, totalPages - 1) : 0;
  const startIndex = safeCurrentPage * itemsPerPage;
  const endIndex = Math.min((safeCurrentPage + 1) * itemsPerPage, filteredCommune.length);

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
                Ville
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
                <td colSpan={4} className="text-center py-4">
                  Aucune ville trouv&eacute;e
                </td>
              </tr>
            ) : (
              filteredCommune.slice(startIndex, endIndex).map((co, index) => (
                <tr key={co.id_commune}>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {startIndex + index + 1}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {formatValue(co.libelle_commune)}
                  </td>

                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {formatValue(getDepartementNameById(co.id_departement))}
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

                      <Link href={`/villes/${co.id_commune}`}>
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
        totalItems={filteredCommune.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        previousLabel="Precedent"
        nextLabel="Suivant"
      />
    </div>
  );
};

export default CommuneTable;
