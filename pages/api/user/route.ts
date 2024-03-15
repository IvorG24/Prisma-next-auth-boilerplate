import { NextApiRequest, NextApiResponse } from "next";
import { withInputValidation } from "@/middlewares/InputValidation";
import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { user } from "@prisma/client";
import { get } from "react-hook-form";
import { ADMIN_ROLE, USER_ROLE } from "@/types/common";
type ResponseData = {
	message: string;
};

const prisma = new PrismaClient();
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseData>
) {
	switch (req.method) {
		case "GET":
			return get(req, res.toString());

		default:
			res.status(405).send({ message: "Invalid Method." });
			return;
	}
}

export const getData = async (id: string) => {
	try {
		const adminUser = await prisma.user.findUnique({
			where: {
				id,
			},
		});

		if (!adminUser || adminUser.role != ADMIN_ROLE) {
			return { user: [], usersCount: 0 };
		}

		const user = await prisma.user.findMany({
			where: {
				role: USER_ROLE,
				deleted: false,
			},
			orderBy: [
				{
					status: "asc",
				},
				{
					createdAt: "desc",
				},
			],
			take: 15,
		});

		const usersCount = await prisma.user.count({
			where: {
				role: USER_ROLE,
				deleted: false,
			},
		});
		return { user, usersCount };
	} catch (e: any) {
		console.log(e);
		return { user: [], usersCount: 0 };
	}
};
