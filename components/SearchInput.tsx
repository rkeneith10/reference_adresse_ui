// SearchInput.tsx
import { IconButton, Input, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react';
import React from "react";
import { FaSearch, FaTimes } from 'react-icons/fa';


interface SearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <InputGroup className="w-full sm:max-w-[20%] mr-4">
      <InputLeftElement pointerEvents="none">
        <FaSearch className="text-gray-500" />
      </InputLeftElement>
      <Input
        placeholder="Recherche..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <InputRightElement>
          <IconButton
            aria-label="Clear search"
            icon={<FaTimes />}
            size="sm"
            onClick={() => setSearchTerm('')}
          />
        </InputRightElement>
      )}
    </InputGroup>
  );
};

export default SearchInput;
