"use server";

import Adresse from "../api/models/adresseModel";
export async function updateAdresse(
  id_adresses: number,
  libelle: string,
  numero_rue: string,
  id_sectioncommune: number,
  cle_unicite: string,
  statut: string



) {
  const adr = await Adresse.findOne({ where: { id_adresses } });
  if (!adr) {
    throw new Error("Adresse not found");
  }
  await adr.update({
    libelle,
    numero_rue,
    id_sectioncommune,
    cle_unicite,
    statut

  });
  return adr.toJSON();
}
