import { USER_ROLE, ADMIN_ROLE } from "@/types/common";
import { signIn, signOut } from "next-auth/react";

export const register = async (
	data: RegisterDataProps,
	onSuccess: (status: boolean) => void,
	onError: (error: string) => void
) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/auth`,
		{
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
		}
	);
	const result = await response.json();

	if (response.ok) {
		onSuccess(result?.data);
	} else {
		onError(result.data);
	}
};

export const login = async (
	data: LoginDataProps,
	onSuccess: (url: string) => void,
	onError: (error: string) => void
) => {
	try {
		const res: any = await signIn("credentials", {
			redirect: false,
			email: data.email,
			password: data.password,
			role: [USER_ROLE || ADMIN_ROLE],
			callbackUrl: `${window.location.origin}/dashboard`,
		});

		if (res?.error) {
			onError(res.error);
		} else if (res?.url) {
			onSuccess(res.url);
		} else {
			onError("Unknown error occurred during login");
		}
	} catch (error) {
		console.error("Error during login:", error);
		onError("An unexpected error occurred. Please try again later.");
	}
};
interface RegisterDataProps {
	name: string;
	email: string;
	password: string;
}

interface LoginDataProps {
	email: string;
	password: string;
}
