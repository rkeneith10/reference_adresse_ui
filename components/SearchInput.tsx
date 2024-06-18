// SearchInput.tsx
import { Input } from "@nextui-org/react";
import React from "react";
import { FaSearch } from "react-icons/fa";

interface SearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <Input
      isClearable
      className="w-full sm:max-w-[20%] mr-4"
      placeholder="Recherche..."
      startContent={<FaSearch className="text-gray-500" />}
      value={searchTerm}
      onChange={(e: any) => setSearchTerm(e.target.value)}
      onClear={() => setSearchTerm("")}
    />
  );
};

export default SearchInput;
