import React from "react";
import DashboardLayout from "@/src/layouts/Dashboardlayout";
import { Role, Transaction } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { AuthOptions, getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { USER_ROLE } from "@/types/common";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { TbCurrencyPeso } from "react-icons/tb";
import { MdLocalLaundryService } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { addDays, format, set } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getTransaction } from "@/services/transactions/transaction-table";
import { useState, useEffect } from "react";
import { DateRangePickerEnhanced } from "@/components/ui/enhance-calendar";
import { DateRange } from "react-day-picker";
import { MdDirectionsBike } from "react-icons/md";
import Link from "next/link";
const FormSchema = z.object({
	date: z.date({
		required_error: "A date of birth is required.",
	}),
});
interface LeaderboardProps {
	role: Role;
	Transaction?: [
		{
			id: string;
			type: string;
			amount: string;
			quantity: string;
			createdAt: string;
		},
	];
	TransactionCount?: number;
}
const gestureDetails = [
	{
		id: "1",
		gesture: "Gesture 1",
		finger1: "1",
		finger2: "0",
		finger3: "0",
		finger4: "0",
	},
	{
		id: "2",
		gesture: "Gesture 2",
		finger1: "0",
		finger2: "1",
		finger3: "0",
		finger4: "0",
	},
	{
		id: "3",
		gesture: "Gesture 3",
		finger1: "1",
		finger2: "1",
		finger3: "0",
		finger4: "0",
	},
	// Add more gesture details as needed
	{
		id: "20",
		gesture: "Gesture 4",
		finger1: "1",
		finger2: "1",
		finger3: "1",
		finger4: "1",
	},
];
export default function Dashboard({ role }: LeaderboardProps) {
	const [date, setDate] = useState<DateRange>({
		from: new Date(),
		to: new Date(),
	});

	return (
		<>
			<DashboardLayout role={role}>
				<div className="flex flex-col h-full min-h-screen gap-y-4">
					<div className="flex justify-end">
						<Button>Add Gestures</Button>
					</div>
					{gestureDetails.map((gesture, index) => (
						<div
							key={index}
							className="border-2 py-8 px-20 flex justify-between items-center bg-blue-500 text-white rounded-full"
						>
							<h1>{gesture.gesture}</h1>
							<Link href={`/gestures/${gesture.id}`}>
								<Button>Edit</Button>
							</Link>
						</div>
					))}
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
