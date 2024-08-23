import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";
import Tooltip from "../models/tooltipModel";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const nom_application = searchParams.get('nom_application');

    if (!nom_application) {
      return NextResponse.json({ message: "Nom d'application requis" }, { status: 400 });
    }

    const tooltips = await Tooltip.findAll({
      where: {
        nom_application: {
          [Op.or]: [nom_application, '*'],
        },
      },
    });

    if (tooltips && tooltips.length > 0) {
      return NextResponse.json({ tooltip: tooltips }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Pas d'aide pour cette application" }, { status: 404 });
    }
  } catch (error: any) {
    console.error("Erreur lors de la récupération des tooltips:", error);
    return NextResponse.json({ message: "Erreur du serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { nom_champ, nom_application, message_tooltip } = await req.json();

    const existingAide = await Tooltip.findOne({ where: { nom_application, nom_champ } })
    if (existingAide) {
      NextResponse.json({ message: "Un message d'aide existe deja poour cette application et ce champ" })
    }

    const newTooltip = await Tooltip.create({
      nom_application, nom_champ, message_tooltip
    })
    return NextResponse.json({ newTooltip }, { status: 201 })
  } catch (error) {

  }
}