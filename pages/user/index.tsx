import React from "react";
import DashboardLayout from "@/src/layouts/Dashboardlayout";
import { Role, user } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { AuthOptions, getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

import { getUsers } from "@/services/user/user-table";
import { USER_ROLE } from "@/types/common";
import { VerifyUser } from "@/services/user/acceptUser";
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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EditProfile } from "./[id]";
import { useToast } from "@/components/ui/use-toast";
import { RejectUser } from "@/services/user/rejectUser";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateUser from "./_modules/createUser";

interface UserProps {
	role: Role;
	Users: [
		{
			id: string;
			name: string;
			email: string;
			role: string;
			status: string;
			createdAt: string;
			updatedAt: string;
		},
	];
}

// Call this function after successfully updating the user's profile

export default function User({ role }: UserProps) {
	const { toast } = useToast();

	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [showEditProfileModal, setShowEditProfileModal] = useState(false);
	const [selectedUserData, setSelectedUserData] = useState(null);

	const columns: ColumnDef<user>[] = [
		{
			accessorKey: "name",
			header: "Name",
			cell: ({ row }) => (
				<div className="capitalize">{row.getValue("name")}</div>
			),
		},
		{
			accessorKey: "email",
			header: () => <div>Email</div>,
			cell: ({ row }) => (
				<div className="lowercase">{row.getValue("email")}</div>
			),
		},
		{
			accessorKey: "role",
			header: "Role",
			cell: ({ row }) => (
				<div className="capitalize">{row.getValue("role")}</div>
			),
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => (
				<div className="capitalize">{row.getValue("status")}</div>
			),
		},
		{
			accessorKey: "createdAt",
			header: "Date Created",
			cell: ({ row }) => (
				<div className="capitalize">{row.getValue("createdAt")}</div>
			),
		},
		{
			accessorKey: "updatedAt",
			header: "Date Updated",
			cell: ({ row }) => (
				<div className="capitalize">{row.getValue("updatedAt")}</div>
			),
		},
		{
			accessorKey: "action",
			header: "Action",
			cell: ({ row }) => (
				<div className="flex items-center justify-center gap-x-4">
					{/* Edit User Button */}
					{row.original.status === "Pending" ? (
						<>
							<EditProfile
								id={row.original.id}
								name={row.original.name}
								email={row.original.email}
								role={row.original.role}
								reload={getUsersData}
							/>
							{/* Accept Button */}
							<Button onClick={() => handleVerify(row.original)}>Verify</Button>
							{/* Reject/Delete Button */}
							<AlertDialog>
								<AlertDialogTrigger>
									<Button variant="destructive">Reject</Button>
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
										<AlertDialogAction
											onClick={() => handleReject(row.original)}
										>
											Continue
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</>
					) : (
						<EditProfile
							id={row.original.id}
							name={row.original.name}
							email={row.original.email}
							role={row.original.role}
							reload={getUsersData}
						/>
					)}
				</div>
			),
		},
	];

	const handleVerify = async (values: any) => {
		if (values.id) {
			const data = {
				id: values.id,
				status: values.status,
			};
			try {
				await VerifyUser(
					data,
					async () => {
						toast({
							title: "You have Accepted Successfully!",
							description: "You may now proceed to the table",
						});
						getUsersData();

						// If you're using a state to store user data in your component, update it here
						// setUserData(updatedUserData);

						// If you're using a function to refresh the table or data, call it here
					},
					(error) => {
						toast({
							title: "Uh oh! Something went wrong.",
							description: error,
							variant: "destructive",
						});
					}
				);
			} catch (error) {
				toast({
					title: "Update Failed!",
					description: "Please try again !",
					variant: "destructive",
				});
			}
		} else {
			toast({
				title: "Update Failed!",
				description: "Email already in use try again !",
				variant: "destructive",
			});
		}
	};
	const handleReject = async (values: any) => {
		if (values.id) {
			const data = {
				id: values.id,
				status: values.status,
			};
			try {
				await RejectUser(
					data,
					async () => {
						toast({
							title: "You have Rejected User Successfully!",
							description: "You may now proceed to the table",
						});
						getUsersData();

						// If you're using a state to store user data in your component, update it here
						// setUserData(updatedUserData);

						// If you're using a function to refresh the table or data, call it here
					},
					(error) => {
						toast({
							title: "Uh oh! Something went wrong.",
							description: error,
							variant: "destructive",
						});
					}
				);
			} catch (error) {
				toast({
					title: "Update Failed!",
					description: "Please try again !",
					variant: "destructive",
				});
			}
		} else {
			toast({
				title: "Update Failed!",
				description: "Email already in use try again !",
				variant: "destructive",
			});
		}
	};
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [pageSize, setPageSize] = useState(15);
	const [isLoading, setIsLoading] = useState(false);
	const [search, setSearch] = useState("");
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [usersList, setUsersList] = useState<user[]>([]);
	const table = useReactTable({
		data: usersList,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
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
			expanded: true,
		},
	});
	useEffect(() => {
		getUsersData();
	}, [currentPage, pageSize, search]);

	const getUsersData = () => {
		setIsLoading(true);
		getUsers(
			{
				page: currentPage,
				limit: pageSize,
				search: search,
			},
			(data) => {
				setUsersList(data.users);
				setTotalCount(data.usersCount);
				setIsLoading(false);
			},
			(error) => {
				setUsersList([]);
				setTotalCount(0);
				setIsLoading(false);
			}
		);
	};

	return (
		<>
			<DashboardLayout role={role}>
				<div className="flex flex-col items-center justify-center w-full h-full">
					<div className="w-full text-right">
						<CreateUser reload={getUsersData} />
					</div>
					<Tabs defaultValue="Pending" className="w-full">
						<TabsList>
							<TabsTrigger value="Pending">Pending</TabsTrigger>
							<TabsTrigger value="Verified">Verified</TabsTrigger>
							<TabsTrigger value="Rejected">Rejected</TabsTrigger>
						</TabsList>
						<TabsContent value="Pending">
							<Table>
								<TableHeader>
									{table.getHeaderGroups().map((headerGroup) => (
										<TableRow key={headerGroup.id}>
											{headerGroup.headers.map((header) => {
												return (
													<TableHead key={header.id}>
														{header.isPlaceholder
															? null
															: flexRender(
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
										table.getRowModel().rows.map((row) => (
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
												No results.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</TabsContent>
						<TabsContent value="password">
							Change your password here.
						</TabsContent>
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
function setSelectedUserData(userData: any) {
	throw new Error("Function not implemented.");
}

function setShowEditProfileModal(arg0: boolean) {
	throw new Error("Function not implemented.");
}
