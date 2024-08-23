import { NextRequest, NextResponse } from "next/server";
import Country from "../models/paysModel";


export async function GET() {
  try {
    const allcountries = await Country.findAll({});
    if (allcountries) {
      return NextResponse.json({ data: allcountries }, { status: 200 });
    }
  } catch (error: any) {
    console.log(error);
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { libelle_pays, code_pays, indicatif_tel, continent, fuseau_horaire } =
      await req.json();

    const existingCountry = await Country.findOne({ where: { libelle_pays } });
    if (existingCountry) {
      return NextResponse.json(
        { message: "Le pays existe déjà." },
        { status: 400 }
      );
    }

    const country = await Country.create({
      libelle_pays,
      code_pays,
      continent,
      indicatif_tel,
      fuseau_horaire,
    });

    return NextResponse.json(
      {
        success: true,
        data: country,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Erreur lors de la création du pays",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
