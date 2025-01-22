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
  const [commune, setCommune] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({
    numero_rue: "", libelle_adresse: "", code_postal: "", cle_unicite: "", statut: "", section_communale: "", id_commune: "",

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
          libelle_adresse: response.data.libelle_adresse,
          section_communale: response.data.section_communale,
          numero_rue: response.data.numero_rue,
          id_commune: response.data.id_commune,
          code_postal: response.data.code_postal,
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
        const response = await axios.get('/api/communeCtrl'); // Adjust the endpoint as needed
        setCommune(response.data.data);
      } catch (error) {
        console.error("Error fetching commune:", error);
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
        libelle_adresse: formData.libelle_adresse,
        cle_unicite: formData.cle_unicite,
        statut: formData.statut,
        code_postal: formData.code_postal,
        id_commune: formData.id_commune,
        section_communale: formData.section_communale

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
                  id="libelle_adresse"
                  name="libelle_adresse"
                  value={formData.libelle_adresse}
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
                <label htmlFor="id_commune" className="mb-2 font-medium">
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
                  {commune.map((com) => (
                    <option key={com.id_commune} value={com.id_commune}>
                      {com.libelle_commune}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="section_communale" className="mb-2 font-medium">
                  Section Communale
                </label>
                <input
                  type="text"
                  id="section_communale"
                  name="section_communale"
                  value={formData.section_communale}
                  className="border border-gray-300 p-2 rounded-md"
                  onChange={handleInputChange}

                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="code_postal" className="mb-2 font-medium">
                  Code Postal
                </label>
                <input
                  type="text"
                  id="code_postal"
                  name="code_postal"
                  value={formData.code_postal}
                  className="border border-gray-300 p-2 rounded-md"
                  onChange={handleInputChange}

                />
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
