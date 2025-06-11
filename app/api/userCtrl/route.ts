
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import User from '../models/userModel';


export async function GET() {
  try {
    const allUsers = await User.findAll({
      attributes: { exclude: ['password'] },
    });
    if (allUsers) {
      return NextResponse.json({ data: allUsers }, { status: 200 });
    }
  } catch (error: any) {
    console.log(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();


    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "L'utilisateur existe déjà." }, { status: 400 });
    }

    const userCount = await User.count();
    const role = userCount === 0 ? 'admin' : 'user';

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return NextResponse.json(
      { success: true, data: user },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Erreur lors de la création de l'utilisateur", error: error.message },
      { status: 500 }
    );
  }
}
