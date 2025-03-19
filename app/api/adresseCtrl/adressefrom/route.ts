import { NextRequest, NextResponse } from "next/server";
import Adresse from "../../models/adresseModel";
import Commune from "../../models/communeModel";
import Departement from "../../models/departementModel";
import { default as Country } from "../../models/paysModel";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");

    const whereClause: any = {};
    if (from) {
      whereClause.from = from;
    }

    const adresses = await Adresse.findAll({
      where: whereClause,
      include: [
        {
          model: Commune,
          attributes: ["libelle_commune", "id_commune"],
          include: [
            {
              model: Departement,
              attributes: ["libelle_departement", "id_departement"],
              include: [
                {
                  model: Country,
                  attributes: ["libelle_pays", "id_pays"],
                },
              ],
            },
          ],
        },
      ],
      order: [["id_adresses", "DESC"]],
    });

    return NextResponse.json({ data: adresses }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
