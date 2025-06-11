
import { compare, hash } from 'bcryptjs';
import { NextRequest, NextResponse } from "next/server";
import User from "../models/userModel";


export async function POST(req: NextRequest) {
  const { email, oldPassword, newPassword } = await req.json();

  const user = await User.findOne({ where: { email } });

  if (!user) return NextResponse.json({ message: "Utilisateur introuvable" }, { status: 404 });

  const isMatch = await compare(oldPassword, user.password);
  if (!isMatch) return NextResponse.json({ message: "Mot de passe incorrect" }, { status: 400 });

  const hashed = await hash(newPassword, 10);
  user.password = hashed;
  user.status = 1;
  await user.save();

  return NextResponse.json({ message: "Mot de passe changé avec succès", status: 200 });
}
