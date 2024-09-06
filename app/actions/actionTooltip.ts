"use server";

import Tooltip from "../api/models/tooltipModel";

export async function updateTooltip(
  id_tooltip: number,
  nom_champ: string,
  nom_application: string,
  message_tooltip: string,

) {
  const tooltip = await Tooltip.findOne({ where: { id_tooltip } });
  if (!tooltip) {
    throw new Error("Tooltip not found");
  }
  await tooltip.update({
    nom_champ, nom_application, message_tooltip
  });
  return tooltip.toJSON();
}

export async function deleteCountry(id_tooltip: number) {
  const tooltip = await Tooltip.findByPk(id_tooltip);
  if (!tooltip) {
    throw new Error('Tooltip not found');
  }
  await tooltip.destroy();
  return { message: 'Tooltip deleted successfully' };
}
