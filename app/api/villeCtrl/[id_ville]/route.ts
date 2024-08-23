import { NextRequest, NextResponse } from "next/server";
import Ville from "../../models/villeModel";

export async function GET(req: NextRequest, { params }: { params: { id_ville: number } }) {
  try {
    const { id_ville } = params;
    if (!id_ville) {
      return NextResponse.json({ error: "Invalid Id" }, { status: 400 });
    }

    const detailVille = await Ville.findOne({ where: { id_ville } })
    if (!detailVille) {
      return NextResponse.json({ message: "Ville introuvable" }, { status: 404 })
    }

    const responseData = {
      id_ville: detailVille?.id_ville,
      id_commune: detailVille?.id_commune,
      libelle_ville: detailVille?.libelle_ville,
      longitude: detailVille?.longitude,
      lattitude: detailVille?.lattitude
    }

    return NextResponse.json(responseData, { status: 200 })
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des détails de la ville " },
      { status: 500 }
    );
  }
}


export async function DELETE(req: NextRequest, { params }: { params: { id_ville: number } }) {
  try {
    const { id_ville } = params;

    if (!id_ville) {
      return NextResponse.json({ error: "Invalid Id" }, { status: 400 });
    }

    const vil = await Ville.findOne({ where: { id_ville } });
    if (!vil) {
      return NextResponse.json(
        { message: "La ville n'existe pas." },
        { status: 404 }
      );
    }

    await Ville.destroy({ where: { id_ville } });
    return NextResponse.json(
      { message: "La villr a été supprimé avec succès." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Erreur lors de la suppression de la ville",
        error: error.message,
      },
      { status: 500 }
    );
  }
}