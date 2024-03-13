import NextAuth from "next-auth/next";
import { JWT } from "next-auth/jwt";
import { Status } from "@prisma/client";
declare module "next-auth" {
	interface Session {
		currentUser: {
			id: string;
			name: string;
			email: string;
			role: Role;
		};
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		user: {
			id: string;
			name: string;
			email: string;
			role: Role;
		};
	}
}
