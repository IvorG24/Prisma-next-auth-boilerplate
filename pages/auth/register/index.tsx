"use client";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React from "react";
import { Button } from "@/components/ui/button";
import { GetServerSidePropsContext } from "next";
import { authOptions } from "../../api/auth/[...nextauth]";
import { AuthOptions, getServerSession } from "next-auth";
import { USER_ROLE } from "@/types/common";
import { useToast } from "@/components/ui/use-toast";
import { register } from "@/services/auth/usermodel";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/passwordinuput";

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

type Formvalue = {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
};

const formSchema = z
	.object({
		name: z
			.string()
			.min(6, { message: "Name is minimum of 6 letters" })
			.max(20),
		email: z.string().email(),
		password: z.string().min(6, { message: "Minimum of 6 letters" }).max(12),
		confirmPassword: z.string().min(6).max(12),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

function Register() {
	const { toast } = useToast();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	// 2. Define a submit handler.
	async function onSubmit(values: Formvalue) {
		if (values.email) {
			const data = {
				name: values.name,
				email: values.email,
				password: values.password,
			};
			try {
				await register(
					data,
					() => {
						toast({
							title: "You have Registered Successfully!",
							description: "You may now proceed to login !",
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
	return (
		<div className="min-h-screen h-full w-full flex justify-center items-center border-2">
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>Sign Up Now </CardTitle>
					<CardDescription>Register Your Account Today !</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name</FormLabel>
										<FormControl>
											<Input placeholder="Enter your Full Name" {...field} />
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input placeholder="Enter your Full Name" {...field} />
										</FormControl>
										<FormDescription>
											Email must contain @ ex. 123@yahoo.com
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<PasswordInput
												placeholder="Enter your Password"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Password must contain 6-12 characters
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm Password</FormLabel>
										<FormControl>
											<PasswordInput
												placeholder="Confirm your Password"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Password must contain 6-12 characters
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex justify-between">
								<Button type="submit">Submit</Button>
								<Link href="/auth/login">
									<Button variant="outline" size="icon">
										<ChevronRightIcon className="h-4 w-4" />
									</Button>
								</Link>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}

export default Register;

// export const getServerSideProps = async (
// 	context: GetServerSidePropsContext
// ) => {
// 	const session = await getServerSession(
// 		context.req,
// 		context.res,
// 		authOptions(context.req, context.res) as AuthOptions
// 	);

// 	if (session?.currentUser?.id) {
// 		if (session.currentUser.role == USER_ROLE) {
// 			return {
// 				redirect: {
// 					permanent: false,
// 					destination: "/dashboard",
// 				},
// 			};
// 		}
// 		// else {
// 		// 	return {
// 		// 		redirect: {
// 		// 			permanent: false,
// 		// 			destination: "/lead-form",
// 		// 		},
// 		// 	};
// 		// }
// 	}

// 	return {
// 		props: {},
// 	};
// };
