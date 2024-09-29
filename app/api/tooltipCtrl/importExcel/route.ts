import { NextRequest, NextResponse } from 'next/server';
import Tooltip, { TooltipAttributes } from '../../models/tooltipModel';

export async function POST(req: NextRequest) {
  try {
    // Parse the JSON body
    const body = await req.json();

    if (!Array.isArray(body)) {
      throw new Error("Le corps de la requête doit être un tableau de tooltips");
    }

    const tooltips = body as TooltipAttributes[];

    // Itérer sur chaque tooltip dans le tableau et les créer dans la base de données
    for (let tool of tooltips) {
      await Tooltip.create({
        nom_application: tool.nom_application,
        nom_champ: tool.nom_champ,
        message_tooltip: tool.message_tooltip,
      });
    }

    const response = NextResponse.json(
      { success: true, data: tooltips },
      { status: 200 }
    );

    // Ajout des en-têtes CORS
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;

  } catch (error: any) {
    console.error("Erreur dans l'API d'importation des tooltips :", error);

    const response = NextResponse.json(
      {
        message: "Erreur lors de l'importation des tooltips",
        error: error.message,
      },
      { status: 500 }
    );

    // Ajout des en-têtes CORS dans le cas d'une erreur également
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
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
