import React from "react";
import DashboardLayout from "@/src/layouts/Dashboardlayout";
import { Role } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { AuthOptions, getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import type { Transaction } from "@prisma/client";
import { getUsers } from "@/services/user/user-table";

import { useEffect } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import { useToast } from "@/components/ui/use-toast";
import { getTransaction } from "@/services/transactions/transaction-table";

import { format } from "date-fns";
import { ScrollArea } from "@radix-ui/react-scroll-area";
interface Transactionprops {
	role: Role;
	Transaction: [
		{
			id: string;
			type: string;
			amount: string;
			quantity: string;
			createdAt: string;
		},
	];
}

export default function Transaction({ role }: Transactionprops) {
	const { toast } = useToast();

	const [sorting, setSorting] = React.useState<SortingState>([]);

	const columns: ColumnDef<Transaction>[] = [
		{
			accessorKey: "type",
			header: "Package Name",
			cell: ({ row }) => (
				<div className="capitalize">{row.getValue("type")}</div>
			),
		},
		{
			accessorKey: "amount",
			header: () => <div>Amount</div>,
			cell: ({ row }) => (
				<div className="lowercase">{row.getValue("amount")}</div>
			),
		},
		{
			accessorKey: "quantity",
			header: "Quantity",
			cell: ({ row }) => (
				<div className="capitalize">{row.getValue("quantity")}</div>
			),
		},
		{
			accessorKey: "createdAt",
			header: "Date of Purchase",
			cell: ({ row }) => (
				<div className="capitalize">
					<div className="capitalize">
						{format(row.getValue("createdAt"), "MMMM dd, yyyy")}
					</div>
				</div>
			),
		},
		{
			accessorKey: "createdAt",
			header: "Time of Purchase",
			cell: ({ row }) => (
				<div className="capitalize">
					<div className="capitalize">
						{format(row.getValue("createdAt"), " hh:mm a")}
					</div>
				</div>
			),
		},
		{
			accessorKey: "createdAt",
			header: "Day of Purchase",
			cell: ({ row }) => (
				<div className="capitalize">
					<div className="capitalize">
						{format(row.getValue("createdAt"), "eeee")}
					</div>
				</div>
			),
		},
		{
			accessorKey: "action",
			header: "Action",
			cell: ({ row }) => (
				<div className="flex items-center justify-center gap-x-4">
					{/* Edit User Button */}

					<>
						<AlertDialog>
							<AlertDialogTrigger>
								<Button variant="destructive">Delete</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>
										Are you sure about this action?
									</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will permanently delete
										the users account and remove their data from our servers.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction>Continue</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</>
				</div>
			),
		},
	];

	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [pageSize, setPageSize] = useState(100);
	const [isLoading, setIsLoading] = useState(false);
	const [search, setSearch] = useState("");
	const [searchData, setsearchData] = useState(""); // State variable for pending tab search
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});

	const [Transactionlist, setTransactionList] = useState<Transaction[]>([]);
	const table = useReactTable({
		data: Transactionlist,
		columns,
		onSortingChange: setSorting,

		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});
	const getTransactionData = () => {
		setIsLoading(true);
		getTransaction(
			{},
			(data) => {
				setTransactionList(data.Transaction);
				setTotalCount(data.transactionCount);
				setIsLoading(false);
			},
			(error) => {
				setTransactionList([]);
				setTotalCount(0);
				setIsLoading(true);
			}
		);
	};

	useEffect(() => {
		getTransactionData();
	}, [currentPage, pageSize, search]); // Update when tabValue changes

	return (
		<>
			<DashboardLayout role={role}>
				<div className="flex flex-col items-center justify-center w-full h-full">
					<div className="w-full text-right">
						{/* Any content you want to add here */}
					</div>

					{/* Search Input */}
					<input
						type="text"
						placeholder="Search..."
						value={searchData}
						onChange={(e) => setsearchData(e.target.value)}
						className="w-96 p-2 mb-4 border rounded-lg my-6"
					/>

					{/* Table */}

					<Table className="overflow-y-scroll h-full border-2">
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id}>
												{flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table
									.getRowModel()
									.rows.filter(
										(row) =>
											row.original.type
												.toLowerCase()
												.includes(searchData.toLowerCase()) ||
											row.original.amount
									)
									.map((row) => (
										<TableRow
											key={row.id}
											data-state={row.getIsSelected() && "selected"}
										>
											{row.getVisibleCells().map((cell) => (
												<TableCell key={cell.id}>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext()
													)}
												</TableCell>
											))}
										</TableRow>
									))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										No pending users.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
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
