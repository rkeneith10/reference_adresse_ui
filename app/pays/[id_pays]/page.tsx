"use client";
import { updateCountry } from "@/app/actions/actionCountry";
import CountryFormModal from "@/components/CountryFormModal";
import RootLayout from "@/components/rootLayout";
import { Spinner, useDisclosure } from "@nextui-org/react";
import axios from "axios";
//import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";


const DetailPays = ({ params }: { params: { id_pays: string } }) => {
  const { id_pays } = params;
  //const router = useRouter();
  const [country, setCountry] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    libelle: "",
    code_pays: "",
    continent: "",
    indicatif_tel: "",
    fuseau_horaire: "",
  });
  const [loading, setLoading] = useState<Boolean>(true);
  const [updating, setUpdating] = useState<Boolean>(false);
  const [confirmation, setConfirmation] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isConfirmationOpen, onOpen: onConfirmationOpen, onClose: onConfirmationClose } = useDisclosure();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    const fetchCountry = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/paysCtrl/${id_pays}`);
        setCountry(response.data);
        setFormData({
          libelle: response.data.libelle,
          code_pays: response.data.code_pays,
          continent: response.data.continent,
          indicatif_tel: response.data.indicatif_tel,
          fuseau_horaire: response.data.fuseau_horaire,
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

    fetchCountry();
  }, [id_pays]);

  const handleUpdateCountry = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const updatedCountry = await updateCountry(
        country.id_pays,
        formData.libelle,
        formData.code_pays,
        formData.continent,
        formData.indicati_tel,
        formData.fuseau_horaire
      );
      setCountry(updatedCountry);
      setConfirmation(true)
      setUpdating(false);
    } catch (error) {
      setUpdating(false);
      console.error("Update error:", error);
    }
  };

  const handleAddCountrySuccess = () => {

    setModalMessage("Le pays a été modifié avec succès");
    onConfirmationOpen();
    // setTimeout(() => {
    //   router.push('/pays'); // Assurez-vous que cette route est correcte dans votre projet
    // }, 2000);
  };
  const handleAddCountryFailed = () => {
    setModalMessage("Erreur lors de la modification du pays")
    onConfirmationOpen();
  }

  return (
    <RootLayout isAuthenticated={true}>
      <Suspense fallback={<div>loading ...</div>}>
        {confirmation && (<CountryFormModal isOpen={isOpen} onClose={onClose} onSuccess={handleAddCountrySuccess} onFailed={handleAddCountryFailed} />)}
        {loading ? (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <Spinner size="lg" color="primary" />
            <div className="loader">Chargement en cours...</div>

          </div>
        ) :
          country ? (
            <div className="h-auto bg-white rounded-md shadow-md p-10 justify-center items-center mt-10">
              <form onSubmit={handleUpdateCountry}>
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
                    <label htmlFor="codePays" className="mb-2 font-medium">
                      Code Pays
                    </label>
                    <input
                      type="text"
                      id="codePays"
                      name="code_pays"
                      value={formData.code_pays}
                      className="border border-gray-300 p-2 rounded-md"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="continent" className="mb-2 font-medium">
                      Continent
                    </label>
                    <input
                      type="text"
                      id="continent"
                      name="continent"
                      value={formData.continent}
                      className="border border-gray-300 p-2 rounded-md"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="indicatifTel" className="mb-2 font-medium">
                      Indicatif Téléphonique
                    </label>
                    <input
                      type="text"
                      id="indicatifTel"
                      name="indicatif_tel"
                      value={formData.indicatif_tel}
                      className="border border-gray-300 p-2 rounded-md"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="fuseauHoraire" className="mb-2 font-medium">
                      Fuseau Horaire
                    </label>
                    <input
                      type="text"
                      id="fuseauHoraire"
                      name="fuseau_horaire"
                      value={formData.fuseau_horaire}
                      className="border border-gray-300 p-2 rounded-md"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-4 bg-blue-500 text-white p-2 rounded-md cursor-pointer"
                  disabled={updating ? true : false}

                >
                  {updating ? (
                    <>
                      Modification en cours <Spinner size="sm" color="white" className="ml-2 " />
                    </>
                  ) : "Modifier"}
                </button>
              </form>
            </div>
          ) : (
            <div>Pays introuvable</div>
          )}
      </Suspense>
    </RootLayout>
  );
};

export default DetailPays;
