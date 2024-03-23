import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { user } from "@prisma/client";
import { updateUser } from "@/services/user/updateUser";
import { getUsers } from "@/services/user/user-table";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

interface UserProps {
	id: string;
	name: string;
	email: string;
	role: string;
	reload: () => void;
}

type Formvalue = {
	id: string;
	name: string;
	email: string;
	role: string;
};

const formSchema = z.object({
	name: z.string().min(6, { message: "Name is minimum of 6 letters" }).max(20),
	email: z.string().email(),
	role: z.string(),
});

function EditProfile({ id, name, email, role, reload }: UserProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: name, // Use props directly here
			email: email, // Use props directly here
		},
	});

	const { toast } = useToast();

	async function onSubmit(values: Formvalue) {
		if (values.email) {
			const data = {
				id: values.id,
				name: values.name,
				email: values.email,
			};
			try {
				await updateUser(
					data,
					() => {
						toast({
							title: "You have Updated Successfully!",
							description: "You may now proceed to the table",
						});
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
	}

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline">Edit</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Edit profile</SheetTitle>
					<SheetDescription>
						Make changes to profile here. Click save when you are done.
					</SheetDescription>
				</SheetHeader>
				<div className="grid gap-4 py-4">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit((values) =>
								onSubmit({ ...values, id })
							)}
							className="space-y-8"
						>
							<FormField
								control={form.control}
								name="name"
								defaultValue={name} // Set default value for name field
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								defaultValue={email} // Set default value for email field
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="role"
								defaultValue={role} // Set default value for role field
								render={({ field }) => (
									<FormItem>
										<FormLabel>Role</FormLabel>
										<FormControl>
											<Input disabled {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="flex justify-end">
								<Button type="submit">Save changes</Button>
							</div>
						</form>
					</Form>
				</div>
				<SheetFooter></SheetFooter>
			</SheetContent>
		</Sheet>
	);
}

export default EditProfile;
