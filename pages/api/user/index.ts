import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { USER_ROLE } from "@/types/common";

type ResponseData = {
	message: string;
	users?: any[]; // Adjust this type according to your user data structure
	usersCount?: number;
};

const prisma = new PrismaClient();

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseData>
) {
	switch (req.method) {
		case "GET":
			try {
				const { users, usersCount } = await getData();
				res.status(200).json({ message: "Success", users, usersCount });
			} catch (error) {
				console.error("Error fetching users:", error);
				res.status(500).json({ message: "Internal Server Error" });
			}
			break;
		default:
			res.status(405).json({ message: "Invalid Method." });
			break;
	}
}

export const getData = async () => {
	try {
		const users = await prisma.user.findMany({
			where: {
				role: USER_ROLE,
				deleted: false,
			},
			orderBy: [{ status: "asc" }, { createdAt: "desc" }],
			take: 15,
		});

		const usersCount = await prisma.user.count({
			where: {
				role: USER_ROLE,
				deleted: false,
			},
		});

		return { users, usersCount };
	} catch (error) {
		console.error("Error fetching users:", error);
		throw error;
	}
};
