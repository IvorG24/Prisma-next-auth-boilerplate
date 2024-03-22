"use client";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React from "react";
import { Button } from "@/components/ui/button";
import { login } from "@/services/auth/usermodel";
import { GetServerSidePropsContext } from "next";
import { authOptions } from "../../api/auth/[...nextauth]";
import { AuthOptions, getServerSession } from "next-auth";
import { ADMIN_ROLE } from "@/types/common";
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
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Autoplay from "embla-carousel-autoplay";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

type Formvalue = {
	email: string;
	password: string;
};

const formSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6, { message: "Minimum of 6 letters" }).max(12),
});

function Login() {
	const { toast } = useToast();
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const onSubmit = async (values: Formvalue) => {
		if (values) {
			const data = {
				emain: values.email,
				password: values.password,
			};
			try {
				await login(
					{
						email: values.email,
						password: values.password,
					},
					() => {
						router.push("/dashboard");
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
					title: "Login Failed!",
					description: "Please try again !",
					variant: "destructive",
				});
			}
		} else {
			toast({
				title: "Login Failed!",
				description: "Does not Exist try again !",
				variant: "destructive",
			});
		}
	};

	return (
		<div className="min-h-screen h-full w-full grid grid-cols-4">
			<div className="col-span-2 flex flex-col justify-center items-center bg-blue-900 text-white">
				<Card className="w-[350px]  p-6">
					<h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-2xl">
						Login
					</h1>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

							<div className="flex justify-between">
								<Button type="submit">Submit</Button>
								<Link href="/auth/register">
									<Button variant="outline" size="icon">
										<ChevronRightIcon className="h-4 w-4" />
									</Button>
								</Link>
							</div>
						</form>
					</Form>
				</Card>
			</div>
			<div className="col-span-2 relative"></div>
			<div className=" w-[650px] h-[500px] fixed z-50 top-60 right-96">
				<Carousel
					plugins={[
						Autoplay({
							delay: 2000,
						}),
					]}
				>
					<CarouselContent>
						<CarouselItem className="w-full">
							<Image
								src="/assets/bacgkground_gloves.jpg"
								width={650}
								height={50}
								className="object-cover w-full h-full"
								alt="gloves"
							></Image>
						</CarouselItem>
					</CarouselContent>
				</Carousel>
			</div>
		</div>
	);
}

export default Login;

export const getServerSideProps = async (
	context: GetServerSidePropsContext
) => {
	const session = await getServerSession(
		context.req,
		context.res,
		authOptions(context.req, context.res) as AuthOptions
	);

	if (session?.currentUser?.id) {
		if (session.currentUser.role == ADMIN_ROLE) {
			return {
				redirect: {
					permanent: false,
					destination: "/dashboard",
				},
			};
		} else {
			return {
				redirect: {
					permanent: false,
					destination: "/gestures",
				},
			};
		}
	}

	return {
		props: {},
	};
};
