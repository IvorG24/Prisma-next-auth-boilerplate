import React from "react";
import DashboardLayout from "@/src/layouts/Dashboardlayout";
import { Role } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { AuthOptions, getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
	FormField,
	FormControl,
	FormDescription,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { z } from "zod";
import { useState } from "react";
import { Transaction } from "@/services/transactions/packages";

type FormValue = {
	type: string;
	amount: number;
	quantity: number;
};

interface PackagesProps {
	role: Role;
}

const formSchema = z.object({
	type: z.string(),
	amount: z.number(),
	quantity: z.number(),
});

export default function Packages({ role }: PackagesProps) {
	const [quantity, setQuantity] = useState(1);

	const packages = [
		{
			name: "Package 1",
			description: "160 Pesos / 8 Kilo",
			price: 160,
			quantity: quantity,
		},
		{ name: "Package 2", description: "", price: 120, quantity: quantity },
		{ name: "Package 3", description: "", price: 100, quantity: quantity },
		{ name: "Package 4", description: "", price: 80, quantity: quantity },
	];
	const [selectedPackage, setSelectedPackage] = useState(packages[0]);
	const [totalPrice, setTotalPrice] = useState<number>(packages[0].price);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			type: packages[0].name,
			amount: packages[0].price,
			quantity: quantity,
		},
	});
	const { toast } = useToast();
	async function onSubmit(values: FormValue) {
		const submissionData = {
			...values,
		};
		if (submissionData) {
			const data = {
				type: values.type,
				amount: values.amount,
				quantity: values.quantity,
			};
			try {
				await Transaction(
					data,

					() => {
						toast({
							title: "You have Registered Successfully!",
							description: `You have purchased ${values.type}.`,
							className: "bg-violet-600 text-white",
						});
						form.reset();
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
					title: "Registration Failed!",
					description: "Please try again !",
					variant: "destructive",
				});
			}
		} else {
			toast({
				title: "Registration Failed!",
				description: "Email already in use try again !",
				variant: "destructive",
			});
		}
	}

	const handlePackageChange = (packageIndex: number, newQuantity: number) => {
		newQuantity = Math.max(newQuantity, 1);
		setQuantity(newQuantity);
		const selectedPackage = packages[packageIndex];
		const totalPrice = selectedPackage
			? selectedPackage.price + selectedPackage.price * (newQuantity - 1)
			: 0;
		setSelectedPackage(selectedPackage);
		setTotalPrice(totalPrice);

		form.setValue("type", selectedPackage ? selectedPackage.name : "");
		form.setValue("amount", totalPrice);
		form.setValue("quantity", newQuantity);
	};
	return (
		<>
			<DashboardLayout role={role}>
				<div className="flex items-center justify-start w-full h-screen">
					<div>
						<h2 className="text-3xl text-center py-4">Packages</h2>
						<div className="grid grid-cols-2 gap-8">
							{packages.map((pkg, index) => (
								<AlertDialog key={index}>
									<AlertDialogTrigger
										className="border-2 h-60 w-60"
										onClick={() => handlePackageChange(index, quantity)}
									>
										{pkg.name}
										<AlertDialogDescription>
											{pkg.description}
										</AlertDialogDescription>
									</AlertDialogTrigger>

									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>This Package Involves</AlertDialogTitle>
											<Form {...form}>
												<form
													onSubmit={form.handleSubmit(onSubmit)}
													className="space-y-8"
												>
													<FormField
														control={form.control}
														name="type"
														render={({ field }) => (
															<FormItem>
																<FormLabel>Package Name</FormLabel>
																<FormControl>
																	<Input
																		className="border-none"
																		{...field}
																		readOnly
																	/>
																</FormControl>
																<FormDescription>
																	{pkg.name} contains Wash - Dry - Fold
																</FormDescription>
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name="amount"
														render={({ field }) => (
															<FormItem>
																<FormLabel>Package Price</FormLabel>
																<FormControl>
																	<Input
																		className="border-none"
																		{...field}
																		readOnly
																	/>
																</FormControl>
																<FormDescription>
																	Price of the Package: ${pkg.price}
																</FormDescription>
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name="quantity"
														defaultValue={quantity}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Package Quantity</FormLabel>
																<FormControl>
																	<Input
																		type="number"
																		{...field}
																		onChange={(e) =>
																			handlePackageChange(
																				index,
																				parseInt(e.target.value)
																			)
																		}
																	/>
																</FormControl>
																<FormDescription>
																	Choose Quantity
																</FormDescription>
															</FormItem>
														)}
													/>
													<div className="flex justify-between">
														<AlertDialogCancel>Cancel</AlertDialogCancel>
														<Button type="submit">Continue</Button>
													</div>
												</form>
											</Form>
										</AlertDialogHeader>
									</AlertDialogContent>
								</AlertDialog>
							))}
						</div>
					</div>
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
