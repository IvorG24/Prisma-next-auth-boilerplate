import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import * as z from "zod";
import { withInputValidation } from "@/middlewares/InputValidation";
import {
	USER_ROLE,
	ADMIN_ROLE,
	PENDING,
	INITIAL_CUSTOM_RESPONSE,
	PrismaCustomResponse,
} from "@/types/common";
import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { handlePrismaErrors } from "@/prisma/errorHandling";
import { AuthOptions, Session, getServerSession } from "next-auth";
// import { authOptions } from "../auth/[...nextauth]";c
const prisma = new PrismaClient();
export const getData = async () => {
	try {
		const users = await prisma.user.findMany({
			where: {
				role: "user",
				status: "Unverified",
			},
			select: {
				name: true,
				email: true,
				id: true,
				status: true,
			},
		});
		return users;
	} catch (e: any) {
		console.log(e);
		return [];
	}
};
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	let result: PrismaCustomResponse = INITIAL_CUSTOM_RESPONSE;

	try {
		await prisma.$transaction(async (tx) => {
			const { name, email, password } = req.body;
			const userExists = await tx.user.findFirst({
				where: {
					email: email,
					role: USER_ROLE,
					deleted: false,
				},
			});

			if (userExists) {
				throw { data: "Email Already Exist", status: 422 };
			}

			await tx.user.create({
				data: {
					email: email,
					name: name,
					password: bcrypt.hashSync(password, 10),
					role: USER_ROLE,
					status: PENDING,
					requestVerifyAt: new Date(),
				},
			});

			result = {
				data: true,
				status: 200,
			};
		});
	} catch (e: any) {
		console.log("Error:", e);
		await prisma.$disconnect();
		result = { data: handlePrismaErrors(e), status: 400 };
	} finally {
		res.status(result.status).json({ data: result.data });
	}
}

interface RegisterRequest extends NextApiRequest {
	body: {
		email: string;
		name: string;
		password: string;
	};
}
