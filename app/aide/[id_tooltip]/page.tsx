"use client";
import { updateTooltip } from "@/app/actions/actionTooltip";
import ConfirmationModal from '@/components/ConfirmationModal';
import RootLayout from '@/components/rootLayout';
import { Spinner, useDisclosure } from '@chakra-ui/react';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const DetailsTooltip = ({ params }: { params: { id_tooltip: string } }) => {
  const { id_tooltip } = params;
  const router = useRouter();

  const [tooltip, setTooltip] = useState<any>(null);

  const [formData, setFormData] = useState<any>({
    nom_champ: "", nom_application: "", message_tooltip: "",

  });
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [confirmation, setConfirmation] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isConfirmationOpen, onOpen: onConfirmationOpen, onClose: onConfirmationClose } = useDisclosure();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    const fetchTooltip = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/tooltipCtrl/${id_tooltip}`);
        setTooltip(response.data);
        setFormData({
          nom_champ: response.data.nom_champ,
          nom_application: response.data.nom_application,
          message_tooltip: response.data.message_tooltip,

        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (axios.isAxiosError(error)) {
          console.error("Axios error:", error.message);
        } else {
          console.error("Unexpected error:", error);
        }
      }
    };



    fetchTooltip();

  }, [id_tooltip]);

  const handleUpdateTooltip = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const updatedTooltip = await updateTooltip(
        tooltip.id,
        formData.nom_champ,
        formData.nom_application,
        formData.message_tooltip,

      );
      setTooltip(updatedTooltip);
      setConfirmation(true);
      setModalMessage("Le message tooltip a été modifié avec succès");
      onConfirmationOpen();



      setUpdating(false);
    } catch (error) {
      setUpdating(false);

      setModalMessage("Erreur lors de la modification du tooltip");
      onConfirmationOpen();
      console.error("Update error:", error);
    }
  };

  const handleModalClose = () => {
    onConfirmationClose();
    router.push('../../aide');
  };

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();

      if (!session) {
        router.push('/'); // Redirect to home page if session is not active
      }
    };

    checkSession();
  }, [router]);

  return (
    <RootLayout isAuthenticated={true}>
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={handleModalClose}
        message={modalMessage}
      />
      {loading ? (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
          <Spinner size="lg" color="primary" />
          <div className="loader">Chargement en cours...</div>
        </div>
      ) : tooltip ? (
        <div className="h-auto bg-white rounded-md shadow-md p-10 justify-center items-center mt-10">
          <form onSubmit={handleUpdateTooltip}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="libelle" className="mb-2 font-medium">
                  Nom application
                </label>
                <input
                  type="text"
                  id="nom_application"
                  name="nom_application"
                  value={formData.nom_application}
                  className="border border-gray-300 p-2 rounded-md"
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="numero_rue" className="mb-2 font-medium">
                  Nom champ
                </label>
                <input
                  type="text"
                  id="nom_champ"
                  name="nom_champ"
                  value={formData.nom_champ}
                  className="border border-gray-300 p-2 rounded-md"
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="code_postal" className="mb-2 font-medium">
                  Message
                </label>
                <input
                  type="text"
                  id="message_tooltip"
                  name="message_tooltip"
                  value={formData.message_tooltip}
                  className="border border-gray-300 p-2 rounded-md"
                  onChange={handleInputChange}

                />
              </div>

            </div>
            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white p-2 rounded-md cursor-pointer"
              disabled={updating}
            >
              {updating ? (
                <>
                  Modifier <Spinner size="sm" color="white" className="ml-2" />
                </>
              ) : "Modifier"}
            </button>
          </form>
        </div>
      ) : (
        <div>Tooltip introuvable</div>
      )}
    </RootLayout>
  );
}

export default DetailsTooltip;
