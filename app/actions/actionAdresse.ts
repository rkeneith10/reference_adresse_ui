import axios from 'axios';

export async function updateAdresse(
  id_adresses: number,
  libelle: string,
  numero_rue: string,
  id_sectioncommune: number,
  cle_unicite: string,
  statut: string
) {
  try {
    const response = await axios.post('/api/adresseCtrl/updateadresse', {
      id_adresses,
      libelle,
      numero_rue,
      id_sectioncommune,
      cle_unicite,
      statut
    });

    if (response.status !== 200) {
      throw new Error(response.data.message || 'Something went wrong');
    }

    return response.data;
  } catch (error) {
    console.error("Error updating address:", error);
    throw error;
  }
}
