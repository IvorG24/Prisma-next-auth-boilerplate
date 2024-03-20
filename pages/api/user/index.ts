import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { USER_ROLE, PENDING, VERIFIED, REJECTED } from "@/types/common";

type ResponseData = {
	message: string;
	users?: any[]; // Adjust this type according to your user data structure
	usersCount?: number;
	pendingUsers?: any[]; // Adjust this type according to your user data structure
	verifiedUsers?: any[]; // Adjust this type according to your user data structure
	rejectedUsers?: any[]; // A
};

const prisma = new PrismaClient();

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseData>
) {
	switch (req.method) {
		case "GET":
			try {
				const { pendingUsers, verifiedUsers, rejectedUsers, usersCount } =
					await getData();
				res.status(200).json({
					message: "Success",
					pendingUsers,
					verifiedUsers,
					rejectedUsers,
					usersCount,
				});
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
		const pendingUsers = await prisma.user.findMany({
			where: {
				role: USER_ROLE,
				status: PENDING,
				deleted: false,
			},
			orderBy: [{ createdAt: "desc" }],
			take: 15,
		});

		const verifiedUsers = await prisma.user.findMany({
			where: {
				role: USER_ROLE,
				status: VERIFIED,
				deleted: false,
			},
			orderBy: [{ createdAt: "desc" }],
			take: 15,
		});

		const rejectedUsers = await prisma.user.findMany({
			where: {
				role: USER_ROLE,
				status: REJECTED,
				deleted: false,
			},
			orderBy: [{ createdAt: "desc" }],
			take: 15,
		});

		const usersCount = await prisma.user.count({
			where: {
				role: USER_ROLE,
				deleted: false,
			},
		});

		return { pendingUsers, verifiedUsers, rejectedUsers, usersCount };
	} catch (error) {
		console.error("Error fetching users:", error);
		throw error;
	}
};
