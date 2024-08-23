import { NextRequest, NextResponse } from "next/server";
import SectionCommunale from "../../models/sectionCommunalModel";

export async function GET(req: NextRequest, { params }: { params: { id_sectioncommunale: number } }) {
  try {
    const { id_sectioncommunale } = params;
    if (!id_sectioncommunale) {
      return NextResponse.json({ error: "Invalid Id" }, { status: 400 });
    }
    const detailSectionCommunale = await SectionCommunale.findOne({ where: { id_sectioncommunale } })
    if (!detailSectionCommunale) {
      return NextResponse.json({ error: "Commune introuvable" }, { status: 400 })
    }
    const responseData = {
      id_sectioncommunale: detailSectionCommunale.id_sectioncommunale,
      id_ville: detailSectionCommunale?.id_ville,
      libelle_sectioncommunale: detailSectionCommunale.libelle_sectioncommunale,



    }
    return NextResponse.json(responseData, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des détails de la section communale" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id_sectioncommunale: number } }) {
  try {
    const { id_sectioncommunale } = params;

    if (!id_sectioncommunale) {
      return NextResponse.json({ error: "Invalid Id" }, { status: 400 });
    }

    const comm = await SectionCommunale.findOne({ where: { id_sectioncommunale } });
    if (!comm) {
      return NextResponse.json(
        { message: "La commune n'existe pas." },
        { status: 404 }
      );
    }

    await SectionCommunale.destroy({ where: { id_sectioncommunale } });
    return NextResponse.json(
      { message: "La section communale a été supprimée avec succès." },
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
  { params }: { params: { id_sectioncommunale: number } }
) {
  try {
    const { id_sectioncommunale } = params;
    const body = await req.json();

    if (!id_sectioncommunale) {
      return NextResponse.json({ error: "Invalid Id" }, { status: 400 });
    }

    const comm = await SectionCommunale.findOne({ where: { id_sectioncommunale } });
    if (!comm) {
      return NextResponse.json(
        { message: "La section communale  n'existe pas." },
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