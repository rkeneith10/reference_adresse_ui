import { formatValue } from "@/lib/helper";
import { UserAttributes } from "@/app/api/models/userModel";
import { Button } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import Pagination from "./Pagination";

interface UserTableProps {
  user: UserAttributes[];
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  onDelete: (id: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  user,
  searchTerm,
  currentPage,
  itemsPerPage,
  setCurrentPage,
  onDelete,
}) => {
  const filteredUser = (user ?? []).filter((u) =>
    (u.name ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { data: session } = useSession();
  const totalPages = Math.ceil(filteredUser.length / itemsPerPage);
  const safeCurrentPage = totalPages > 0 ? Math.min(currentPage, totalPages - 1) : 0;
  const startIndex = safeCurrentPage * itemsPerPage;
  const endIndex = Math.min((safeCurrentPage + 1) * itemsPerPage, filteredUser.length);

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
                Nom complet
              </th>

              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Role
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUser.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  Aucun utilisateur trouv&eacute;
                </td>
              </tr>
            ) : (
              filteredUser.slice(startIndex, endIndex).map((userItem, index) => (
                <tr key={userItem.id}>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {startIndex + index + 1}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {formatValue(userItem.name)}
                  </td>

                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {formatValue(userItem.email)}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {formatValue(userItem.role)}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {session?.user.email !== userItem.email ? (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          colorScheme="red"
                          mr={2}
                          variant="ghost"
                          onClick={() => onDelete(userItem.id)}
                          p={0}
                          minWidth="auto"
                        >
                          <FaRegTrashAlt className="text-lg" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-gray-400"> </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={safeCurrentPage}
        totalItems={filteredUser.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        previousLabel="Precedent"
        nextLabel="Suivant"
      />
    </div>
  );
};

export default UserTable;
