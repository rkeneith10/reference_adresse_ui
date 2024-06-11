import { NextResponse } from "next/server";
import sequelize from "../../lib/sequelize";

export async function GET(): Promise<NextResponse> {
  try {
    await sequelize.authenticate();

    return NextResponse.json("Connected to the database", { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: "erreur: " + e }, { status: 400 });
  }
}
