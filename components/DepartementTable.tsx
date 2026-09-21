import { formatValue } from "@/lib/helper";
import { Button } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { FaRegEye, FaRegTrashAlt } from "react-icons/fa";
import { DepartementAttributes } from "../app/api/models/departementModel";
import Pagination from "./Pagination";

interface DepartementTableProps {
  dept: DepartementAttributes[];
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  onDelete: (id: number) => void;
  getCountryNameById: (id: number) => string;
}

const DepartementTable: React.FC<DepartementTableProps> = ({
  dept,
  searchTerm,
  currentPage,
  itemsPerPage,
  setCurrentPage,
  onDelete,
  getCountryNameById,
}) => {
  const filteredDepartements = dept.filter((dp) =>
    (dp.libelle_departement ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDepartements.length / itemsPerPage);
  const safeCurrentPage = totalPages > 0 ? Math.min(currentPage, totalPages - 1) : 0;
  const startIndex = safeCurrentPage * itemsPerPage;
  const endIndex = Math.min((safeCurrentPage + 1) * itemsPerPage, filteredDepartements.length);

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
                D&eacute;partement /Province /Etat /Canton
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
                    {startIndex + index + 1}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {formatValue(dp.libelle_departement)}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {formatValue(dp.code_departement)}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {formatValue(dp.chef_lieux)}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {formatValue(getCountryNameById(dp.id_pays))}
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

      <Pagination
        currentPage={safeCurrentPage}
        totalItems={filteredDepartements.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        previousLabel="Precedent"
        nextLabel="Suivant"
      />
    </div>
  );
};

export default DepartementTable;
