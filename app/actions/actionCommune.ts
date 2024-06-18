"use server";

import Commune from "../api/models/communeModel";

export async function updateCommune(
  id_commune: number,
  libelle: string,
  code_postal: string,
  id_departement: number
) {
  const com = await Commune.findOne({ where: { id_commune } });
  if (!com) {
    throw new Error("Commune not found");
  }
  await com.update({
    libelle,
    code_postal,
    id_departement
  });
  return com.toJSON();
}