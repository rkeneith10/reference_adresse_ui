import { NextRequest, NextResponse } from "next/server";
import Commune from "../../models/communeModel";

export async function GET(req: NextRequest, { params }: { params: { id_commune: number } }) {
  try {
    const { id_commune } = params;
    if (!id_commune) {
      return NextResponse.json({ error: "Invalid Id" }, { status: 400 });
    }
    const detailCommune = await Commune.findOne({ where: { id_commune } })
    if (!detailCommune) {
      return NextResponse.json({ error: "Commune introuvable" }, { status: 400 })
    }
    const responseData = {
      id_commune: detailCommune.id_commune,
      id_departement: detailCommune?.id_departement,
      libelle: detailCommune.libelle,
      longitude: detailCommune.longitude,
      latitude: detailCommune.lattitude,
      code_postal: detailCommune.code_postal


    }
    return NextResponse.json(responseData, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des détails du departement" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id_commune: number } }) {
  try {
    const { id_commune } = params;

    if (!id_commune) {
      return NextResponse.json({ error: "Invalid Id" }, { status: 400 });
    }

    const comm = await Commune.findOne({ where: { id_commune } });
    if (!comm) {
      return NextResponse.json(
        { message: "La commune n'existe pas." },
        { status: 404 }
      );
    }

    await Commune.destroy({ where: { id_commune } });
    return NextResponse.json(
      { message: "La coomune a été supprimé avec succès." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Erreur lors de la suppression de la commune",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id_commune: number } }
) {
  try {
    const { id_commune } = params;
    const body = await req.json();

    if (!id_commune) {
      return NextResponse.json({ error: "Invalid Id" }, { status: 400 });
    }

    const comm = await Commune.findOne({ where: { id_commune } });
    if (!comm) {
      return NextResponse.json(
        { message: "L'arrondissement n'existe pas." },
        { status: 404 }
      );
    }

    await comm.update(body);
    return NextResponse.json(
      { message: "La commune a été mis à jour avec succès.", comm },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Erreur lors de la mise à jour de la commune",
        error: error.message,
      },
      { status: 500 }
    );
  }
}