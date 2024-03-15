import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { handlePrismaErrors } from "@/prisma/errorHandling";
import {
	USER_ROLE,
	PENDING,
	INITIAL_CUSTOM_RESPONSE,
	PrismaCustomResponse,
} from "@/types/common";

const prisma = new PrismaClient();

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	let result: PrismaCustomResponse = INITIAL_CUSTOM_RESPONSE;

	try {
		await prisma.$transaction(async (tx) => {
			const { id, name, email } = req.body;

			// Check if the user exists
			const user = await tx.user.findUnique({
				where: { id },
			});

			if (!user) {
				throw { data: "User not found", status: 404 };
			}

			// Update the user's name and email
			await tx.user.update({
				where: { id },
				data: {
					name,
					email,
				},
			});

			result = {
				data: true,
				status: 200,
			};
		});
	} catch (e: any) {
		console.log("Error:", e);
		result = { data: handlePrismaErrors(e), status: e.status || 400 };
	} finally {
		await prisma.$disconnect();
		res.status(result.status).json({ data: result.data });
	}
}
