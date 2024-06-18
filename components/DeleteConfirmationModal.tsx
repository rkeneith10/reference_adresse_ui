// DeleteConfirmationModal.tsx
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from "@nextui-org/react";
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
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Confirmation de suppression</ModalHeader>
        <ModalBody>
          <p>Êtes-vous sûr de vouloir supprimer cet élément ?</p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onPress={onDelete}>
            {deleteLoading ? (
              <>
                <Spinner size="sm" color="white" />
                <span className="ml-2">Suppression en cours...</span>
              </>
            ) : (
              "Supprimer"
            )}
          </Button>
          <Button color="primary" onPress={onClose}>
            Annuler
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmationModal;
