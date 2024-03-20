import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { INITIAL_CUSTOM_RESPONSE, PrismaCustomResponse } from "@/types/common";
import { handlePrismaErrors } from "@/prisma/errorHandling";
import { Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// export const getData = async () => {
// 	try {
// 		const transaction = await prisma.transaction.findMany({
// 			where: {
// 				type: "Package  1",
// 			},
// 			select: {
// 				type: true,
// 				amount: true,
// 				id: true,
// 			},
// 		});
// 		return transaction;
// 	} catch (e: any) {
// 		console.log(e);
// 		return [];
// 	}
// };
export default async function transaction(
	req: TransactionRequest,
	res: NextApiResponse
) {
	let result: PrismaCustomResponse = INITIAL_CUSTOM_RESPONSE;

	try {
		await prisma.$transaction(async (tx) => {
			const { type, amount, quantity } = req.body;

			await tx.transaction.create({
				data: {
					type: type,
					amount: amount,
					quantity: quantity,
					createdAt: new Date(),
					updatedAt: new Date(),
					deleted: false,
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

interface TransactionRequest extends NextApiRequest {
	body: {
		type: string;
		amount: number;
		quantity: number;
	};
}
