"use client";
import { updateDepartement } from '@/app/actions/actionDepartement';
import ConfirmationModal from '@/components/ConfirmationModal';
import RootLayout from '@/components/rootLayout';
import { Spinner, useDisclosure } from '@nextui-org/react';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const DetailsDepartement = ({ params }: { params: { id_departement: string } }) => {
  const { id_departement } = params;
  const router = useRouter();
  const [departement, setDepartement] = useState<any>(null);
  const [countries, setCountries] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({
    libelle: "",
    code_departement: "",
    chef_lieux: "",
    id_pays: "", // Add country reference ID to formData
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
    const fetchDepartement = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/departementCtrl/${id_departement}`);
        setDepartement(response.data);
        setFormData({
          libelle: response.data.libelle,
          code_departement: response.data.code_departement,
          chef_lieux: response.data.chef_lieux,
          id_pays: response.data.id_pays, // Set country reference ID
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

    const fetchCountries = async () => {
      try {
        const response = await axios.get('/api/paysCtrl'); // Adjust the endpoint as needed
        setCountries(response.data.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchDepartement();
    fetchCountries();
  }, [id_departement]);

  const handleUpdateDepartement = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const updatedDepartement = await updateDepartement(
        departement.id_departement,
        formData.libelle,
        formData.code_departement,
        formData.chef_lieux,
        formData.id_pays, // Pass the country reference ID
      );
      setDepartement(updatedDepartement);
      setConfirmation(true);
      setModalMessage("Le departement a été modifié avec succès");
      onConfirmationOpen();
      setUpdating(false);
    } catch (error) {
      setUpdating(false);
      setModalMessage("Erreur lors de la modification du departement");
      onConfirmationOpen();
      console.error("Update error:", error);
    }
  };

  const handleModalClose = () => {
    onConfirmationClose();
    router.push('../../departements');
  };

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();

      if (!session) {
        router.push('/'); // Redirection vers la page d'accueil si la session n'est pas active
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
      ) : departement ? (
        <div className="h-auto bg-white rounded-md shadow-md p-10 justify-center items-center mt-10">
          <form onSubmit={handleUpdateDepartement}>
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
                <label htmlFor="code_departement" className="mb-2 font-medium">
                  Code departement
                </label>
                <input
                  type="text"
                  id="code_departement"
                  name="code_departement"
                  value={formData.code_departement}
                  className="border border-gray-300 p-2 rounded-md"
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="chef_lieux" className="mb-2 font-medium">
                  Chef-lieux
                </label>
                <input
                  type="text"
                  id="chef_lieux"
                  name="chef_lieux"
                  value={formData.chef_lieux}
                  className="border border-gray-300 p-2 rounded-md"
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="id_pays" className="mb-2 font-medium">
                  Pays
                </label>
                <select
                  id="id_pays"
                  name="id_pays"
                  value={formData.id_pays}
                  className="border border-gray-300 p-2 rounded-md"
                  onChange={handleInputChange}
                >
                  <option value="">Sélectionnez un pays</option>
                  {countries.sort((a, b) => a.libelle.localeCompare(b.libelle)).map((country) => (
                    <option key={country.id_pays} value={country.id_pays}>
                      {country.libelle}
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
        <div>Département introuvable</div>
      )}
    </RootLayout>
  );
}

export default DetailsDepartement;
