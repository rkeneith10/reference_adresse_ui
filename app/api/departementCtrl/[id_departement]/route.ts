import { NextRequest, NextResponse } from "next/server";
import Departement from "../../models/departementModel";

// Handler for GET request
export async function GET(
  req: NextRequest,
  { params }: { params: { id_departement: number } }
) {
  try {
    const { id_departement } = params;

    if (!id_departement) {
      return NextResponse.json({ error: "Invalid Id" }, { status: 400 });
    }

    const detaildepartement = await Departement.findOne({ where: { id_departement } });
    if (!detaildepartement) {
      return NextResponse.json({ error: "Departement introuvable" }, { status: 404 });
    }

    const responseData = {
      id_departement: detaildepartement.id_departement,
      libelle: detaildepartement.libelle,
      code_departement: detaildepartement.code_departement,
      chef_lieux: detaildepartement.chef_lieux,
      id_pays: detaildepartement.id_pays,

    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des détails du departement" },
      { status: 500 }
    );
  }
}

// Handler for DELETE request
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id_departement: number } }
) {
  try {
    const { id_departement } = params;

    if (!id_departement) {
      return NextResponse.json({ error: "Invalid Id" }, { status: 400 });
    }

    const departement = await Departement.findOne({ where: { id_departement } });
    if (!departement) {
      return NextResponse.json(
        { message: "Le departement n'existe pas." },
        { status: 404 }
      );
    }

    await Departement.destroy({ where: { id_departement } });
    return NextResponse.json(
      { message: "Le departement a été supprimé avec succès." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Erreur lors de la suppression du departement",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Handler for PUT request (Update)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id_departement: number } }
) {
  try {
    const { id_departement } = params;
    const body = await req.json();

    if (!id_departement) {
      return NextResponse.json({ error: "Invalid Id" }, { status: 400 });
    }

    const departement = await Departement.findOne({ where: { id_departement } });
    if (!departement) {
      return NextResponse.json(
        { message: "Le departement n'existe pas." },
        { status: 404 }
      );
    }

    await departement.update(body);
    return NextResponse.json(
      { message: "Le departement a été mis à jour avec succès.", departement },
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
