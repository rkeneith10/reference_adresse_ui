// DeleteConfirmationModal.tsx
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner } from "@chakra-ui/react";
import React from "react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  deleteLoading: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onDelete, deleteLoading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg="blackAlpha.600"
        backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Confirmation de suppression</ModalHeader>
        <ModalBody>
          <p>Êtes-vous sûr de vouloir supprimer cet élément ?</p>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" onClick={onDelete} mr={3}>
            {deleteLoading ? (
              <>
                <Spinner size="sm" color="white" />
                <span className="ml-2">Suppression en cours...</span>
              </>
            ) : (
              "Supprimer"
            )}
          </Button>
          <Button colorScheme="blue" onClick={onClose}>
            Annuler
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmationModal;
