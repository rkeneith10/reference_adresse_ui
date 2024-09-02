import { NextRequest, NextResponse } from "next/server";
import Tooltip from "../../models/tooltipModel";

// Handler for GET request
export async function GET(
  req: NextRequest,
  { params }: { params: { id_tooltip: number } }
) {
  try {
    const { id_tooltip } = params;

    if (!id_tooltip) {
      return NextResponse.json({ error: "Invalid Id" }, { status: 400 });
    }

    const detailTooltip = await Tooltip.findOne({ where: { id_tooltip } });
    if (!detailTooltip) {
      return NextResponse.json({ error: "Tooltip introuvable" }, { status: 404 });
    }

    const responseData = {
      id_tooltip: detailTooltip.id_tooltip,
      nom_champ: detailTooltip.nom_champ,
      nom_application: detailTooltip.nom_application,
      message_tooltip: detailTooltip.message_tooltip,

    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des détails du tooltip" },
      { status: 500 }
    );
  }
}

// Handler for DELETE request
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id_tooltip: number } }
) {
  try {
    const { id_tooltip } = params;

    if (!id_tooltip) {
      return NextResponse.json({ error: "Invalid Id" }, { status: 400 });
    }

    const tooltip = await Tooltip.findOne({ where: { id_tooltip } });
    if (!tooltip) {
      return NextResponse.json(
        { message: "Le pays n'existe pas." },
        { status: 404 }
      );
    }

    await Tooltip.destroy({ where: { id_tooltip } });
    return NextResponse.json(
      { message: "Le message a été supprimé avec succès." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Erreur lors de la suppression du pays",
        error: error.message,
      },
      { status: 500 }
    );
  }
}