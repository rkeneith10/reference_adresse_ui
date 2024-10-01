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

    const response = NextResponse.json(responseData, { status: 200 });

    // Ajout des en-têtes CORS
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
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

    const response = NextResponse.json(
      { message: "Le message a été supprimé avec succès." },
      { status: 200 }
    );

    // Ajout des en-têtes CORS
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
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


export async function PUT(
  req: NextRequest,
  { params }: { params: { id_tooltip: number } }
) {
  try {
    const { id_tooltip } = params;

    if (!id_tooltip) {
      return NextResponse.json({ error: "Invalid Id" }, { status: 400 });
    }

    // Parse the request body to get the updated data
    const updatedData = await req.json();

    // Find the existing tooltip
    const tooltip = await Tooltip.findOne({ where: { id_tooltip } });
    if (!tooltip) {
      return NextResponse.json(
        { message: "Le tooltip n'existe pas." },
        { status: 404 }
      );
    }

    // Update the tooltip with the new data
    await Tooltip.update(updatedData, { where: { id_tooltip } });

    const response = NextResponse.json(
      { message: "Le message d'aide a été mis à jour avec succès." },
      { status: 200 }
    );

    // Ajout des en-têtes CORS
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Erreur lors de la mise à jour du tooltip",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Gérer les requêtes OPTIONS pour CORS (préflight requests)
export function OPTIONS() {
  const response = NextResponse.json({});
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}
