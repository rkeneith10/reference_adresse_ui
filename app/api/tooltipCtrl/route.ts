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
        [Op.or]: [
          { nom_application },
          { nom_application: '*' }
        ],
      },
    });

    const response = tooltips && tooltips.length > 0
      ? NextResponse.json({ tooltip: tooltips }, { status: 200 })
      : NextResponse.json({ message: "Pas d'aide pour cette application" }, { status: 404 });

   
    return response;
  } catch (error: any) {
    console.error("Erreur lors de la récupération des tooltips:", error);
    return NextResponse.json({ message: "Erreur du serveur" }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const { nom_champ, nom_application, message_tooltip } = await req.json();

    const existingAide = await Tooltip.findOne({ where: { nom_application, nom_champ } });
    if (existingAide) {
      return NextResponse.json({ message: "Un message d'aide existe déjà pour cette application et ce champ" }, { status: 400 });
    }

    const newTooltip = await Tooltip.create({
      nom_application, nom_champ, message_tooltip
    });

    return NextResponse.json({ newTooltip }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du tooltip:', error);
    return NextResponse.json({ message: `Erreur interne du serveur ${error}` }, { status: 500 });
  }
}