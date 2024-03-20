// Import statements should reflect the correct paths
// Ensure that '@/helpers/app' and '@prisma/client' are correctly configured
import { encodeQueryData } from "@/helpers/app";
import { user } from "@prisma/client";

// Define getUsersProps interface before the getUsers function
interface getUsersProps {
	search?: string;
	page?: number;
	limit?: number;
	status?: string;
}

export const getUsers = async (
	data: getUsersProps,
	onSuccess: (data: { users: user[]; usersCount: number }) => void,
	onError: (error: string) => void
) => {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/user`
		);
		const result = await response.json();

		if (response.ok) {
			const users: user[] = [
				...result.pendingUsers,
				...result.verifiedUsers,
				...result.rejectedUsers,
			];
			const usersCount = result.usersCount;
			onSuccess({ users, usersCount });
		} else {
			onError(result.message);
		}
	} catch (error: any) {
		onError(error.message);
	}
};
