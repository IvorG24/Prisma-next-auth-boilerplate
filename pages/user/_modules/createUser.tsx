import React from "react";
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { register } from "@/services/auth/usermodel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/passwordinuput";
import { TiUserAdd } from "react-icons/ti";
type Formvalue = {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
};

interface CreateUserProps {
	reload: () => void;
}
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
function CreateUser({ reload }: CreateUserProps) {
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
						reload();
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
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button>
					<TiUserAdd /> Add User
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Create An Account</AlertDialogTitle>
					<AlertDialogDescription>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-8"
							>
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
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction>
										<Button type="submit">Submit</Button>
									</AlertDialogAction>
								</div>
							</form>
						</Form>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter></AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default CreateUser;
