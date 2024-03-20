import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { USER_ROLE, PENDING, VERIFIED, REJECTED } from "@/types/common";

type ResponseData = {
	message: string;
	transaction?: any[];
	transactionCount: number;
};

const prisma = new PrismaClient();

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseData>
) {
	switch (req.method) {
		case "GET":
			try {
				const { transaction, transactionCount } = await getData();
				res.status(200).json({
					message: "Success",
					transaction,
					transactionCount,
				});
			} catch (error) {
				console.error("Error fetching users:", error);
				res.status(500).json({
					message: "Internal Server Error",
					transactionCount: 0,
				});
			}
			break;
		default:
			res.status(405).json({
				message: "Invalid Method.",
				transactionCount: 0,
			});
			break;
	}
}

export const getData = async () => {
	try {
		const transactionCount = await prisma.transaction.count({
			where: {
				deleted: false,
			},
		});
		const transaction = await prisma.transaction.findMany({
			where: {
				deleted: false,
			},
			orderBy: [{ createdAt: "desc" }],
		});

		return { transactionCount, transaction };
	} catch (error) {
		console.error("Error fetching data:", error);
		throw error;
	}
};
