import { formatValue } from "@/lib/helper";
import { Button } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { FaRegEye, FaRegTrashAlt } from "react-icons/fa";
import { AdresseAttributes } from "../app/api/models/adresseModel";
import Pagination from "./Pagination";

interface AdresseTableProps {
  adresse: AdresseAttributes[];
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  onDelete: (id: number) => void;
  getCommuneNameById: (id: number) => string;
}

const AdresseTable: React.FC<AdresseTableProps> = ({
  adresse,
  searchTerm,
  currentPage,
  itemsPerPage,
  setCurrentPage,
  onDelete,
  getCommuneNameById,
}) => {
  const filteredAdresse = (adresse ?? []).filter((adr) =>
    (adr.libelle_adresse ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAdresse.length / itemsPerPage);
  const safeCurrentPage = totalPages > 0 ? Math.min(currentPage, totalPages - 1) : 0;
  const startIndex = safeCurrentPage * itemsPerPage;
  const endIndex = Math.min((safeCurrentPage + 1) * itemsPerPage, filteredAdresse.length);

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
                Type batiment
              </th>
              <th scope="col" className="px-6 py-3">
                Statut
              </th>
              <th scope="col" className="px-6 py-3">
                Ville
              </th>
              <th scope="col" className="px-6 py-3">
                Commune / Quartier / County
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAdresse.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-4">
                  Aucune adresse trouv&eacute;e
                </td>
              </tr>
            ) : (
              filteredAdresse.slice(startIndex, endIndex).map((adr, index) => (
                <tr key={adr.id_adresses}>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {startIndex + index + 1}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {formatValue(adr.libelle_adresse)}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {formatValue(adr.numero_rue)}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {formatValue(adr.code_postal)}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {formatValue(adr.cle_unicite)}
                  </td>

                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {formatValue(adr.type_batiment)}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {formatValue(adr.statut)}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {formatValue(getCommuneNameById(adr.id_commune))}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {formatValue(adr.section_communale)}
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
                          </Button>
                          <Link href={`/adresses/${adr.id_adresses}`}>
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
                        </>
                      ) : (
                        <span className="text-gray-400"> </span>
                      )}
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
        totalItems={filteredAdresse.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        previousLabel="Precedent"
        nextLabel="Suivant"
      />
    </div>
  );
};

export default AdresseTable;
