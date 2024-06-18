"use client";
import { updateCommune } from '@/app/actions/actionCommune';
import ConfirmationModal from '@/components/ConfirmationModal';
import RootLayout from '@/components/rootLayout';
import { Spinner, useDisclosure } from '@nextui-org/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const DetailCommune = ({ params }: { params: { id_commune: number } }) => {
  const { id_commune } = params;
  const router = useRouter();
  const [commune, setCommune] = useState<any>(null);
  const [departement, setDepartement] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({
    libelle: "",
    code_postal: "",
    id_departement: "",
    longitude: "",
    lattitude: ""
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
    const fetchCommune = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/communeCtrl/${id_commune}`);
        setCommune(response.data);
        setFormData({
          libelle: response.data.libelle,
          code_postal: response.data.code_postal,
          longitude: response.data.longitude,
          lattitude: response.data.latitude,
          id_departement: response.data.id_departement
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

    const fetchDept = async () => {
      try {
        const response = await axios.get('/api/departementCtrl'); // Adjust the endpoint as needed
        setDepartement(response.data.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCommune();
    fetchDept();
  }, [id_commune]);

  const handleUpdateCommune = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const updatedCommune = await updateCommune(
        commune.id_commune,
        formData.libelle,
        formData.code_postal,

        formData.id_departement, // Pass the country reference ID
      );
      setCommune(updatedCommune);
      setConfirmation(true);
      setModalMessage("La commune a été modifiée avec succès");
      onConfirmationOpen();
      setUpdating(false);
    } catch (error) {
      setUpdating(false);
      setModalMessage("Erreur lors de la modification de la commune");
      onConfirmationOpen();
      console.error("Update error:", error);
    }
  }
  const handleModalClose = () => {
    onConfirmationClose();
    router.push('../../communes');
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
      ) : departement ? (
        <div className="h-auto bg-white rounded-md shadow-md p-10 justify-center items-center mt-10">
          <form onSubmit={handleUpdateCommune}>
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
                <label htmlFor="libelle" className="mb-2 font-medium">
                  Code postal
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
                <label htmlFor="code_departement" className="mb-2 font-medium">
                  Longitude
                </label>
                <input
                  type="text"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  className="border border-gray-300 p-2 rounded-md"
                  onChange={handleInputChange}
                  readOnly
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="chef_lieux" className="mb-2 font-medium">
                  Lattitude
                </label>
                <input
                  type="text"
                  id="lattitude"
                  name="lattitude"
                  value={formData.lattitude}
                  className="border border-gray-300 p-2 rounded-md"
                  onChange={handleInputChange}
                  readOnly
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="id_pays" className="mb-2 font-medium">
                  Departement
                </label>
                <select
                  id="id_departement"
                  name="id_departement"
                  value={formData.id_departement}
                  className="border border-gray-300 p-2 rounded-md"
                  onChange={handleInputChange}
                >
                  <option value="">Sélectionnez un departement</option>
                  {departement.sort((a, b) => a.libelle.localeCompare(b.libelle)).map((dept) => (
                    <option key={dept.id_departement} value={dept.id_departement}>
                      {dept.libelle}
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
  )
}

export default DetailCommune
