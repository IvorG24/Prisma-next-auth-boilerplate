import { NextResponse } from "next/server";
import { connectToDatabase } from "@/helpers/server-helper";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const POST = async (req: Request) => {
	try {
		const { name, email, password, role } = await req.json();
		if (!name || !email || !password)
			return NextResponse.json({
				message: "Please fill all fields",
				status: 422,
			});
		await connectToDatabase();


		const existingUser = await prisma.user.findUnique({
			where: {
				email: email,
			},
		});

		if (existingUser) {
			return NextResponse.json({
				message: "Email already exists",
				status: 409, // Conflict status code
			});
		}

		const hashedpassword = await bcrypt.hash(password, 10);

		const newUser = await prisma.user.create({
			data: { name, email, password: hashedpassword, role },
		});

		return NextResponse.json({
			message: "User created successfully",
			status: 200,
			data: newUser,
		});
	} catch (error) {
		console.error("Error creating user:", error);
		return NextResponse.json({
			message: "Error creating user",
			status: 500,
		});
	} finally {
		await prisma.$disconnect(); // Disconnect from Prisma client
	}
};
