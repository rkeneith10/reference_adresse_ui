import { NextRequest, NextResponse } from 'next/server';
import Tooltip, { TooltipAttributes } from '../../models/tooltipModel';

export async function POST(req: NextRequest) {
  try {

    const body = await req.json();
    if (!Array.isArray(body)) {
      throw new Error("Request body must be an array of tooltips");
    }

    const tooltips = body as TooltipAttributes[];


    for (let tool of tooltips) {

      const createdTooltips = await Tooltip.create({
        nom_application: tool.nom_application,
        nom_champ: tool.nom_champ,
        message_tooltip: tool.message_tooltip,

      });

      console.log("Created Toolips:", createdTooltips);
    }

    return NextResponse.json({ success: true, data: tooltips }, { status: 200 });

  } catch (error: any) {
    console.error("Erreur dans l'API d'importation des tooltips :", error);

    // Return an error response
    return NextResponse.json({
      message: "Erreur lors de l'importation des tooltips",
      error: error.message,
    }, { status: 500 });
  }
}
