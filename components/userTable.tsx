import { UserAttributes } from "@/app/api/models/userModel";
import { Button } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React from "react";
import { FaChevronLeft, FaChevronRight, FaRegTrashAlt } from "react-icons/fa";

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
  const filteredUser = user.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const { data: session } = useSession()
  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min((currentPage + 1) * itemsPerPage, filteredUser.length);
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
                <td colSpan={6} className="text-center py-4">
                  Aucune commune trouv&eacute;e
                </td>
              </tr>
            ) : (
              filteredUser.slice(startIndex, endIndex).map((user, index) => (
                <tr key={user.id}>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {index + 1}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {user.name}
                  </td>

                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {user.email}
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">
                    {user.role}
                  </td>
                  {session?.user.email !== user.email ? (
                    <td className="text-left py-3 px-4 border-b border-gray-200">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          colorScheme="red"
                          mr={2}
                          variant="ghost"
                          onClick={() => onDelete(user.id)}
                          p={0}
                          minWidth="auto"
                        >
                          <FaRegTrashAlt className="text-lg" />
                        </Button>



                      </div>
                    </td>
                  ) : ""}
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
        {[...Array(Math.ceil(filteredUser.length / itemsPerPage))].map((_, index) => (
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
          disabled={currentPage === Math.ceil(filteredUser.length / itemsPerPage) - 1}
          className="mx-1 py-1 px-3 rounded-full hover:bg-gray-300"
        >
          <FaChevronRight className="text-gray-500 h-2 w-2" />
        </button>
      </div>
    </div>
  )
}

export default UserTable
