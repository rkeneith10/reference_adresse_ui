import { NextRequest, NextResponse } from "next/server";
import SectionCommunale from "../../models/sectionCommunalModel";

export async function GET(req: NextRequest, { params }: { params: { id_sectioncommune: number } }) {
  try {
    const { id_sectioncommune } = params;
    if (!id_sectioncommune) {
      return NextResponse.json({ error: "Invalid Id" }, { status: 400 });
    }
    const detailSectionCommunale = await SectionCommunale.findOne({ where: { id_sectioncommune } })
    if (!detailSectionCommunale) {
      return NextResponse.json({ error: "Commune introuvable" }, { status: 400 })
    }
    const responseData = {
      id_sectioncommune: detailSectionCommunale.id_sectioncommune,
      id_commune: detailSectionCommunale?.id_commune,
      libelle: detailSectionCommunale.libelle,



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

export async function DELETE(req: NextRequest, { params }: { params: { id_sectioncommune: number } }) {
  try {
    const { id_sectioncommune } = params;

    if (!id_sectioncommune) {
      return NextResponse.json({ error: "Invalid Id" }, { status: 400 });
    }

    const comm = await SectionCommunale.findOne({ where: { id_sectioncommune } });
    if (!comm) {
      return NextResponse.json(
        { message: "La commune n'existe pas." },
        { status: 404 }
      );
    }

    await SectionCommunale.destroy({ where: { id_sectioncommune } });
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
  { params }: { params: { id_sectioncommune: number } }
) {
  try {
    const { id_sectioncommune } = params;
    const body = await req.json();

    if (!id_sectioncommune) {
      return NextResponse.json({ error: "Invalid Id" }, { status: 400 });
    }

    const comm = await SectionCommunale.findOne({ where: { id_sectioncommune } });
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