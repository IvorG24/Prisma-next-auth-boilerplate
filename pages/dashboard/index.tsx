import React from "react";
import DashboardLayout from "@/src/layouts/Dashboardlayout";
import { Role } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { AuthOptions, getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { USER_ROLE } from "@/types/common";
interface LeaderboardProps {
	role: Role;
}
export default function Dashboard({ role }: LeaderboardProps) {
	return (
		<>
			<DashboardLayout role={role}>
				<div className="flex flex-col items-center justify-center w-full h-full">
					<h1 className="text-4xl font-bold">Welcome to the Dashboard</h1>
				</div>
			</DashboardLayout>
		</>
	);
}
export const getServerSideProps = async (
	context: GetServerSidePropsContext
) => {
	const session = await getServerSession(
		context.req,
		context.res,
		authOptions(context.req, context.res) as AuthOptions
	);

	if (!session?.currentUser.id) {
		return {
			redirect: {
				permanent: false,
				destination: "/auth/login",
			},
		};
	}

	return { props: { role: session.currentUser.role } };
};
