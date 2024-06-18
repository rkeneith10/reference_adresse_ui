"use server";

import Departement from "../api/models/departementModel";
export async function updateDepartement(
  id_departement: number,
  libelle: string,
  code_departement: string,
  chef_lieux: string,
  id_pays: number


) {
  const departement = await Departement.findOne({ where: { id_departement } });
  if (!departement) {
    throw new Error("Country not found");
  }
  await departement.update({
    libelle,
    code_departement,
    chef_lieux,
    id_pays

  });
  return departement.toJSON();
}
