import NextAuth, { AuthOptions } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";

import { PrismaClient } from "@prisma/client";
import { ADMIN_ROLE, USER_ROLE } from "@/types/common";

const THIRTY_DAYS = 30 * 24 * 60 * 60;
const prisma = new PrismaClient();

export const authOptions = (req: any, res: any) => {
	return {
		providers: [
			CredentialProvider({
				name: "credentials",
				credentials: {
					email: {
						label: "Email",
						type: "text",
					},
					password: {
						label: "Password",
						type: "password",
					},
					role: {
						label: "Role",
						type: "text",
					},
				},
				authorize: async (credentials) => {
					const email = credentials?.email;
					const password = credentials?.password;
					const role = credentials?.role;

					if (role != ADMIN_ROLE && role != USER_ROLE) {
						throw {
							message: "You are not authorized to access this page",
							status: 403,
						};
					}

					const user = await prisma.user.findFirst({
						where: {
							email,
							role: role == ADMIN_ROLE || role == USER_ROLE ? role : USER_ROLE,
						},
					});

					if (!user) {
						throw {
							message: "Invalid user",
							status: 401,
						};
					}

					const isMatch = await bcrypt.compare(password!, user.password!);

					if (!isMatch) {
						throw {
							message: "Invalid ID or password",
							status: 401,
						};
					}

					return user;
				},
			}),
		],
		adapter: PrismaAdapter(prisma),
		secret: process.env.NEXTAUTH_SECRET,
		session: {
			strategy: "jwt",
			maxAge: THIRTY_DAYS,
		},
		callbacks: {
			jwt: async ({ token }: any) => {
				if (req.url?.includes("update") || req.url?.includes("credentials")) {
					if (!token.sub)
						throw {
							message: "Identifier is required",
							status: 500,
						};

					const userData = await prisma.user.findUnique({
						where: {
							id: token?.sub,
						},
					});

					if (!userData) {
						throw {
							message: "Something went wrong",
							status: 500,
						};
					}

					if (userData.role !== USER_ROLE && userData.role !== ADMIN_ROLE) {
						throw {
							message: "You are not authorized to access this page",
							status: 401,
						};
					}

					token.user = {
						id: userData.id,
						name: userData.name,
						email: userData.email,
						role: userData.role,
					};
				}

				return token;
			},
			session: ({ session, token }: any) => {
				session.currentUser = {
					id: token.user.id,
					name: token.user.name,
					email: token.user.referenceId,
					role: token.user.role,
				};

				return session;
			},
			redirect: ({ url }: any) => {
				return url;
			},
		},
		pages: {
			signIn: "/auth/login",
		},
	};
};

export default async function auth(req: any, res: any) {
	return await NextAuth(req, res, authOptions(req, res) as AuthOptions);
}
