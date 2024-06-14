import { NextRequest, NextResponse } from "next/server";
import Departement from "../models/departementModel";

export async function GET() {

  try {
    const alldepartements = await Departement.findAll({});
    if (alldepartements) {
      return NextResponse.json({ data: alldepartements }, { status: 200 })
    }
  } catch (error: any) { console.error(error) }
}


export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { libelle, code_departement, chef_lieux, id_pays } = await req.json();

    const existingDepartement = await Departement.findOne({ where: { libelle } });
    if (existingDepartement) {
      return NextResponse.json(
        { message: "Le departement existe déjà." },
        { status: 400 }
      );
    }
    const departement = await Departement.create({
      libelle,
      code_departement,
      chef_lieux,
      id_pays

    });

    return NextResponse.json(
      {
        success: true,
        data: departement,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Erreur lors de la création du departement",
        error: error.message,
      },
      { status: 500 }
    );
  }
}