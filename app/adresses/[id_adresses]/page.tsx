"use client";
import ConfirmationModal from '@/components/ConfirmationModal';
import RootLayout from '@/components/rootLayout';
import { Spinner, useDisclosure } from '@chakra-ui/react';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const DetailsAdresse = ({ params }: { params: { id_adresses: string } }) => {
  const { id_adresses } = params;
  const router = useRouter();
  const [adresse, setAdresse] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({
    numero_rue: "", libelle: "", cle_unicite: "", statut: "", id_sectioncommune: "",

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
    const fetchAdresse = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/adresseCtrl/${id_adresses}`);
        setAdresse(response.data);
        setFormData({
          libelle: response.data.libelle,
          numero_rue: response.data.numero_rue,
          id_sectioncommune: response.data.id_sectioncommune,
          cle_unicite: response.data.cle_unicite,
          statut: response.data.statut
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

    const fetchSections = async () => {
      try {
        const response = await axios.get('/api/sectionCommunalCtrl'); // Adjust the endpoint as needed
        setSections(response.data.data);
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };

    fetchAdresse();
    fetchSections();
  }, [id_adresses]);

  const handleUpdateAdresse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await axios.post('/api/adresseCtrl/updateadresse', {
        id_adresses: adresse.id_adresses,
        numero_rue: formData.numero_rue,
        libelle: formData.libelle,
        id_sectioncommune: formData.id_sectioncommune,
        statut: formData.statut,
      });

      if (response.status !== 200) {
        throw new Error(response.data.message || 'Something went wrong');
      }

      setAdresse(response.data.data);
      setConfirmation(true);
      setModalMessage("L'adresse a été modifiée avec succès");
      onConfirmationOpen();
      setUpdating(false);
    } catch (error: any) {
      setUpdating(false);
      setModalMessage(`Erreur lors de la modification de l'adresse: ${error.message}`);
      onConfirmationOpen();
      console.error("Update error:", error);
    }
  };

  const handleModalClose = () => {
    onConfirmationClose();
    router.push('../../adresses');
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
      ) : adresse ? (
        <div className="h-auto bg-white rounded-md shadow-md p-10 justify-center items-center mt-10">
          <form onSubmit={handleUpdateAdresse}>
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
                <label htmlFor="numero_rue" className="mb-2 font-medium">
                  Numéro de rue
                </label>
                <input
                  type="text"
                  id="numero_rue"
                  name="numero_rue"
                  value={formData.numero_rue}
                  className="border border-gray-300 p-2 rounded-md"
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="id_sectioncommune" className="mb-2 font-medium">
                  Section Communale
                </label>
                <select
                  id="id_sectioncommune"
                  name="id_sectioncommune"
                  value={formData.id_sectioncommune}
                  className="border border-gray-300 p-2 rounded-md"
                  onChange={handleInputChange}
                >
                  <option value="">Sélectionnez une section</option>
                  {sections.sort((a, b) => a.libelle.localeCompare(b.libelle)).map((section) => (
                    <option key={section.id_sectioncommune} value={section.id_sectioncommune}>
                      {section.libelle}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="cle_unicite" className="mb-2 font-medium">
                  Clé d'unicité
                </label>
                <input
                  type="text"
                  id="cle_unicite"
                  name="cle_unicite"
                  value={formData.cle_unicite}
                  className="border border-gray-300 p-2 rounded-md"
                  onChange={handleInputChange}
                  readOnly
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="statut" className="mb-2 font-medium">
                  Statut
                </label>
                <input
                  type="text"
                  id="statut"
                  name="statut"
                  value={formData.statut}
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
        <div>Adresse introuvable</div>
      )}
    </RootLayout>
  );
}

export default DetailsAdresse;
