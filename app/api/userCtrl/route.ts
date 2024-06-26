// pages/api/auth/register.ts
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import User from '../models/userModel';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "L'utilisateur existe déjà." },
        { status: 400 }
      );
    }

    // Hash le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Erreur lors de la création de l'utilisateur",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
