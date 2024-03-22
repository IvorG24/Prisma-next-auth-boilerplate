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
export default function Dashboard({ role }: LeaderboardProps) {
	const [date, setDate] = useState<DateRange>({
		from: new Date(),
		to: new Date(),
	});
	const [allData, setData] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [pageSize, setPageSize] = useState(15);
	const [isLoading, setIsLoading] = useState(false);
	const [search, setSearch] = useState("");
	const [Totalamount, setTotalAmount] = useState(0);
	const [Transactionlist, setTransactionList] = useState<Transaction[]>([]);

	const handleDateRangeChange = (newDateRange: DateRange) => {
		setDate(newDateRange);
	};

	const getTransactionData = () => {
		const fromDateISOString = date.from ? date.from.toISOString() : null;
		const toDateISOString = date.to ? date.to.toISOString() : null;
		getTransaction(
			{ fromDate: fromDateISOString, toDate: toDateISOString },
			(data) => {
				setTransactionList(data.Transaction);
				setTotalCount(data.transactionCount);
				const amount = data.Transaction.reduce(
					(acc, curr) => acc + parseFloat(curr.amount.toString()),
					0
				);

				setTotalAmount(Number(amount));
			},
			(error) => {
				setTransactionList([]);
				setTotalCount(0);
				setTotalAmount(0);
			}
		);
	};

	useEffect(() => {
		getTransactionData();
		const interval = setInterval(getTransactionData, 3000);
		return () => clearInterval(interval);
	}, [date]);

	const data = [
		{
			revenue: 10400,
			subscription: 240,
		},
		{
			revenue: 14405,
			subscription: 300,
		},
		{
			revenue: 9400,
			subscription: 200,
		},
		{
			revenue: 8200,
			subscription: 278,
		},
		{
			revenue: 7000,
			subscription: 189,
		},
		{
			revenue: 9600,
			subscription: 239,
		},
		{
			revenue: 11244,
			subscription: 278,
		},
		{
			revenue: 26475,
			subscription: 189,
		},
	];

	return (
		<>
			<DashboardLayout role={role}>
				<div className="flex flex-col min-h-screen h-full w-full gap-y-8">
					<div className="flex justify-between items-center">
						<h1 className="scroll-m-20 text-blue-500 text-4xl font-bold tracking-tight lg:text-5xl text-left">
							DashBoard
						</h1>
						<div className="flex items-center">
							<DateRangePickerEnhanced
								selectedDateRange={date}
								onDateRangeChange={handleDateRangeChange}
								showExternalPresets
								showInternalPresets
								numberOfMonths={2}
							/>
						</div>
					</div>
					<Tabs defaultValue="overview" className="w-full space-y-8">
						<TabsList>
							<TabsTrigger value="overview">Overview</TabsTrigger>
							<TabsTrigger value="analytics">Analytics</TabsTrigger>
							<TabsTrigger value="reports">Reports</TabsTrigger>
							<TabsTrigger value="summary">Summary</TabsTrigger>
						</TabsList>
						<TabsContent value="overview" className="flex flex-col gap-y-5">
							<div className="grid grid-cols-3 gap-x-5">
								{/* for Revenue */}
								<Card className="bg-blue-500 text-white">
									<div className="flex flex-col gap-4 mx-4 py-4">
										<div className="flex justify-between items-center">
											<h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
												Total Revenue
											</h4>
											<h4 className="scroll-m-20 text-4xl font-semibold tracking-tight">
												<TbCurrencyPeso />
											</h4>
										</div>
										<div className="currency flex items-center">
											<h3 className="scroll-m-20 text-4xl font-semibold tracking-tight">
												<TbCurrencyPeso />
											</h3>
											<h3 className="scroll-m-20 text-4xl font-semibold tracking-tight">
												2312342
											</h3>
										</div>
										<p className="text-xl opacity-80">
											23% increase from last month
										</p>
									</div>
								</Card>

								{/* for sales */}
								<Card className="bg-blue-500 text-white">
									<div className="flex flex-col gap-4 mx-4 py-4">
										<div className="flex justify-between items-center">
											<h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
												Total Sales
											</h4>
											<h4 className="scroll-m-20 text-4xl font-semibold tracking-tight">
												<TbCurrencyPeso />
											</h4>
										</div>
										<div className="currency flex items-center">
											<h3 className="scroll-m-20 text-4xl font-semibold tracking-tight">
												<TbCurrencyPeso />
											</h3>
											<h3 className="scroll-m-20 text-4xl font-semibold tracking-tight">
												{Totalamount}
											</h3>
										</div>
										<p className="text-xl opacity-80">
											23% increase from last month
										</p>
									</div>
								</Card>

								<Card className="bg-blue-500 text-white">
									<div className="flex flex-col gap-4 mx-4 py-4">
										<div className="flex justify-between items-center">
											<h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
												Number of User
											</h4>
											<h4 className="scroll-m-20 text-4xl font-semibold tracking-tight">
												<MdDirectionsBike />
											</h4>
										</div>
										<div className="currency flex items-center gap-x-2">
											<h3 className="scroll-m-20 text-4xl font-semibold tracking-tight">
												<FaUser />
											</h3>
											<h3 className="scroll-m-20 text-4xl font-semibold tracking-tight">
												{totalCount}
											</h3>
										</div>
										<p className="text-xl opacity-80">
											43% increase from last month
										</p>
									</div>
								</Card>
							</div>
							<div className="grid grid-cols-5 gap-x-5">
								<Card className="col-span-3 border-blue-500" title="Overview">
									<ResponsiveContainer>
										<BarChart data={data}>
											<XAxis dataKey="name" />
											<YAxis /> {/* Add YAxis component here */}
											<Bar
												dataKey="subscription"
												style={{
													fill: "#3b82f6", // Violet 500 color code
													opacity: 1,
													padding: "0.5rem",
												}}
											/>
										</BarChart>
									</ResponsiveContainer>
								</Card>
								<ScrollArea className="h-[500px] border-blue-500 col-span-2 rounded-lg border p-4">
									<h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
										Recent Activity
									</h4>

									<Table>
										<TableCaption>A list of your recent invoices.</TableCaption>
										<TableHeader>
											<TableRow>
												<TableHead className="">Package</TableHead>
												<TableHead>Quantity</TableHead>
												<TableHead className="text-right">Amount</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{Transactionlist.map((transaction) => (
												<TableRow key={transaction.id}>
													{" "}
													{/* Use unique key */}
													<TableCell className="font-medium">
														<span>{transaction.type}</span>
													</TableCell>
													<TableCell>{transaction.quantity}</TableCell>
													<TableCell className="">
														{transaction.amount}
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</ScrollArea>
							</div>
						</TabsContent>
						<TabsContent value="analytics"></TabsContent>
						<TabsContent value="reports"></TabsContent>
						<TabsContent value="summary"></TabsContent>
					</Tabs>
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
