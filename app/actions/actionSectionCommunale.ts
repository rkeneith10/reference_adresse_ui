"use server";

import SectionCommunale from "../api/models/sectionCommunalModel";

export async function updateSectionCommunale(
  id_sectioncommune: number,
  libelle: string,
  id_commune: number

) {
  const com = await SectionCommunale.findOne({ where: { id_sectioncommune } });
  if (!com) {
    throw new Error("Section Communale not found");
  }
  await com.update({
    libelle,
    id_commune

  });
  return com.toJSON();
}