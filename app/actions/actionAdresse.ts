"use server";
import axios from 'axios';
import { revalidatePath } from 'next/cache';
import Adresse, { AdresseAttributes } from '../api/models/adresseModel';

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
export async function importExcel(adresses: AdresseAttributes[]) {
  try {
    const newAdresses = adresses.map(adresse => ({
      libelle: adresse.libelle,
      numero_rue: adresse.numero_rue,
      cle_unicite: adresse.cle_unicite,
      statut: adresse.statut,
      id_sectioncommune: adresse.id_sectioncommune,
    }));

    const createdAdresses = await Adresse.bulkCreate(newAdresses, {
      ignoreDuplicates: true,
    });

    revalidatePath("/");
    return createdAdresses;
  } catch (error) {
    console.log(error);
  }
}
