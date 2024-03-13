import { NextResponse } from "next/server";
import { connectToDatabase } from "@/helpers/server-helper";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (req: Request, res: NextResponse) => {
	try {
		const { email, password } = await req.json();

		if (!email || !password) {
			return NextResponse.json({
				message: "Please provide email and password",
				status: 422,
			});
		}

		await connectToDatabase();

		const existingUser = await prisma.user.findUnique({
			where: {
				email: email,
			},
		});

		if (!existingUser) {
			return NextResponse.json({
				message: "User not found",
				status: 404,
			});
		}

		if (!existingUser.password) {
			return NextResponse.json({
				message: "Password not set for this user",
				status: 401, // Unauthorized status code
			});
		}

		const passwordMatch = await bcrypt.compare(password, existingUser.password);

		if (!passwordMatch) {
			return NextResponse.json({
				message: "Invalid password",
				status: 401, // Unauthorized status code
			});
		}

		// Redirect the user to "/dashboard" after successful login

		return NextResponse.json({
			message: "Login successful",
			status: 200,
			data: existingUser,
		});
	} catch (error) {
		console.error("Error during login:", error);
		return NextResponse.json({
			message: "Error during login",
			status: 500,
		});
	} finally {
		await prisma.$disconnect(); // Disconnect from Prisma client
	}
};
