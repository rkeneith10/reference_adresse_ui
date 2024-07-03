import { NextRequest, NextResponse } from "next/server";
import Adresse from "../../models/adresseModel";

// Handler for GET request
export async function GET(
  req: NextRequest,
  { params }: { params: { id_adresses: number } }
) {
  try {
    const { id_adresses } = params;

    if (!id_adresses) {
      return NextResponse.json({ error: "Invalid Id" }, { status: 400 });
    }

    const detailAdresse = await Adresse.findOne({ where: { id_adresses } });
    if (!detailAdresse) {
      return NextResponse.json({ error: "Adresse introuvable" }, { status: 404 });
    }

    const responseData = {
      id_adresses: detailAdresse.id_adresses,
      libelle: detailAdresse.libelle,
      numero_rue: detailAdresse.numero_rue,
      cle_unicite: detailAdresse.cle_unicite,
      statut: detailAdresse.statut,
      id_sectioncommune: detailAdresse.id_sectioncommune,

    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des détails de l'adresse" },
      { status: 500 }
    );
  }
}

// Handler for DELETE request
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id_adresses: number } }
) {
  try {
    const { id_adresses } = params;

    if (!id_adresses) {
      return NextResponse.json({ error: "Invalid Id" }, { status: 400 });
    }

    const adresse = await Adresse.findOne({ where: { id_adresses } });
    if (!adresse) {
      return NextResponse.json(
        { message: "L'adresse n'existe pas." },
        { status: 404 }
      );
    }


    await Adresse.destroy({ where: { id_adresses } });
    return NextResponse.json(
      { message: "L'adresse a été supprimé avec succès." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Erreur lors de la suppression du de l'adresse",
        error: error.message,
      },
      { status: 500 }
    );
  }
}


