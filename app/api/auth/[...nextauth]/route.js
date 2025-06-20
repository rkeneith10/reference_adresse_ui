import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../models/userModel";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials;
        try {
          //console.log("Recherche de l'utilisateur avec l'email :", email);
          const user = await User.findOne({ where: { email } });
          if (!user) {
            console.log("Utilisateur non trouvé");
            return null;
          }
          //console.log("Utilisateur trouvé :", user);
          const isValidPassword = bcrypt.compareSync(password, user.password);
         // console.log("Mot de passe valide :", isValidPassword);
          if (isValidPassword) {
            const customUser = { id: user.id, name: user.name, email: user.email ,role:user.role,status:user.status};
            console.log("customuser:",customUser)
            return customUser;
          } else {
            console.log("Mot de passe incorrect");
            return null;
          }
        } catch (error) {
          console.error("Erreur lors de la sélection de l'utilisateur:", error);
          throw error;
        }
      },
    }),

  ],
  callbacks: {
    async jwt({ token, user }) {
      // Quand l'utilisateur se connecte, on ajoute ses données au token
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role; 
        token.status=user.status;
      }
      return token;
    },
    async session({ session, token }) {
      // Injecte les infos du token dans la session
      if (token) {
        session.user = {
          id: token.id,
          name: token.name,
          email: token.email,
          role: token.role, 
          status:token.status,
        };
        console.log("session user:",session.user)
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 86400,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/page.tsx",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
