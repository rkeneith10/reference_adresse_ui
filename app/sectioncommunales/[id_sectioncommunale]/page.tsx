"use client";
import { updateSectionCommunale } from '@/app/actions/actionSectionCommunale';
import ConfirmationModal from '@/components/ConfirmationModal';
import RootLayout from '@/components/rootLayout';
import { Spinner, useDisclosure } from '@chakra-ui/react';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const page = ({ params }: { params: { id_sectioncommunale: number } }) => {
  const { id_sectioncommunale } = params;
  const router = useRouter();
  const [sectionCommunal, setSectionCommunal] = useState<any>(null);
  const [ville, setVille] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({
    libelle: "",
    id_ville: "",

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
    const fetchSection = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/sectionCommunalCtrl/${id_sectioncommunale}`);
        setSectionCommunal(response.data);
        setFormData({
          libelle: response.data.libelle,
          id_ville: response.data.id_ville
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

    const fetchVille = async () => {
      try {
        const response = await axios.get('/api/villeCtrl'); // Adjust the endpoint as needed
        setVille(response.data.data);
      } catch (error) {
        console.error("Error fetching ville:", error);
      }
    };

    fetchVille();
    fetchSection();
  }, [id_sectioncommunale]);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();

      if (!session) {
        router.push('/'); // Redirection vers la page d'accueil si la session n'est pas active
      }
    };

    checkSession();
  }, [router]);

  const handleUpdateSection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const updatedSection = await updateSectionCommunale(
        sectionCommunal.id_sectioncommunale,
        formData.libelle,
        formData.id_commune


      );
      setSectionCommunal(updatedSection);
      setConfirmation(true);
      setModalMessage("La section communale a été modifiée avec succès");
      onConfirmationOpen();
      setUpdating(false);
    } catch (error) {
      setUpdating(false);
      setModalMessage("Erreur lors de la modification de la section communale");
      onConfirmationOpen();
      console.error("Update error:", error);
    }
  }

  const handleModalClose = () => {
    onConfirmationClose();
    router.push('../../sectioncommunales');
  };


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
      ) : ville ? (
        <div className="h-auto bg-white rounded-md shadow-md p-10 justify-center items-center mt-10">
          <form onSubmit={handleUpdateSection}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="libelle" className="mb-2 font-medium">
                  Libellé
                </label>
                <input
                  type="text"
                  id="libelle"
                  name="libelle"
                  value={formData.libelle}
                  className="border border-gray-300 p-2 rounded-md"
                  onChange={handleInputChange}
                />
              </div>


              <div className="flex flex-col">
                <label htmlFor="id_ville" className="mb-2 font-medium">
                  Ville
                </label>
                <select
                  id="id_ville"
                  name="id_ville"
                  value={formData.id_ville}
                  className="border border-gray-300 p-2 rounded-md"
                  onChange={handleInputChange}
                >
                  <option value="">Sélectionnez une ville</option>
                  {ville.sort((a, b) => a.libelle.localeCompare(b.libelle)).map((v) => (
                    <option key={v.id_ville} value={v.id_ville}>
                      {v.libelle}
                    </option>
                  ))}
                </select>
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
        <div>Commune introuvable</div>
      )}
    </RootLayout>
  )
}

export default page
