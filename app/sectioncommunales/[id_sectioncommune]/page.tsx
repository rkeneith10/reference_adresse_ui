"use client";
import { updateSectionCommunale } from '@/app/actions/actionSectionCommunale';
import ConfirmationModal from '@/components/ConfirmationModal';
import RootLayout from '@/components/rootLayout';
import { Spinner, useDisclosure } from '@chakra-ui/react';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const page = ({ params }: { params: { id_sectioncommune: number } }) => {
  const { id_sectioncommune } = params;
  const router = useRouter();
  const [sectionCommunal, setSectionCommunal] = useState<any>(null);
  const [commune, setCommune] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({
    libelle: "",
    id_commune: "",

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
        const response = await axios.get(`/api/sectionCommunalCtrl/${id_sectioncommune}`);
        setSectionCommunal(response.data);
        setFormData({
          libelle: response.data.libelle,
          id_commune: response.data.id_commune
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

    const fetchCommune = async () => {
      try {
        const response = await axios.get('/api/communeCtrl'); // Adjust the endpoint as needed
        setCommune(response.data.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCommune();
    fetchSection();
  }, [id_sectioncommune]);

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
        sectionCommunal.id_sectioncommune,
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
      ) : commune ? (
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
                <label htmlFor="id_pays" className="mb-2 font-medium">
                  Commune
                </label>
                <select
                  id="id_commune"
                  name="id_commune"
                  value={formData.id_commune}
                  className="border border-gray-300 p-2 rounded-md"
                  onChange={handleInputChange}
                >
                  <option value="">Sélectionnez une commune</option>
                  {commune.sort((a, b) => a.libelle.localeCompare(b.libelle)).map((co) => (
                    <option key={co.id_commune} value={co.id_commune}>
                      {co.libelle}
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
