import { NextRequest, NextResponse } from "next/server";
import Country from "../../models/paysModel";

// Handler for GET request
export async function GET(
  req: NextRequest,
  { params }: { params: { id_pays: number } }
) {
  try {
    const { id_pays } = params;

    if (!id_pays) {
      return NextResponse.json({ error: "Invalid Id" }, { status: 400 });
    }

    const detailpays = await Country.findOne({ where: { id_pays } });
    if (!detailpays) {
      return NextResponse.json({ error: "Pays introuvable" }, { status: 404 });
    }

    const responseData = {
      id_pays: detailpays.id_pays,
      libelle_pays: detailpays.libelle_pays,
      code_pays: detailpays.code_pays,
      indicatif_tel: detailpays.indicatif_tel,
      continent: detailpays.continent,
      fuseau_horaire: detailpays.fuseau_horaire,
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des détails du pays" },
      { status: 500 }
    );
  }
}

// Handler for DELETE request
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id_pays: number } }
) {
  try {
    const { id_pays } = params;

    if (!id_pays) {
      return NextResponse.json({ error: "Invalid Id" }, { status: 400 });
    }

    const country = await Country.findOne({ where: { id_pays } });
    if (!country) {
      return NextResponse.json(
        { message: "Le pays n'existe pas." },
        { status: 404 }
      );
    }

    await Country.destroy({ where: { id_pays } });
    return NextResponse.json(
      { message: "Le pays a été supprimé avec succès." },
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

// Handler for PUT request (Update)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id_pays: number } }
) {
  try {
    const { id_pays } = params;
    const body = await req.json();

    if (!id_pays) {
      return NextResponse.json({ error: "Invalid Id" }, { status: 400 });
    }

    const country = await Country.findOne({ where: { id_pays } });
    if (!country) {
      return NextResponse.json(
        { message: "Le pays n'existe pas." },
        { status: 404 }
      );
    }

    await country.update(body);
    return NextResponse.json(
      { message: "Le pays a été mis à jour avec succès.", country },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Erreur lors de la mise à jour du pays",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
