import { encodeQueryData } from "@/helpers/app";
import { Transaction } from "@prisma/client";

interface getTransactionProps {}

export const getTransaction = async (
	data: getTransactionProps,
	onSuccess: (data: {
		Transaction: Transaction[];
		transactionCount: number;
	}) => void,
	onError: (error: string) => void
) => {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/transactions/getData`
		);
		const result = await response.json();

		if (response.ok) {
			const Transaction: Transaction[] = result.transaction;
			const transactionCount = result.transactionCount;
			onSuccess({ Transaction, transactionCount });
		} else {
			onError(result.message);
		}
	} catch (error: unknown) {
		// Specify the type of error as 'unknown' or 'any'
		if (error instanceof Error) {
			// Check if the error is an instance of Error
			onError(error.message);
		} else {
			onError("An error occurred."); // Handle other types of errors
		}
	}
};
