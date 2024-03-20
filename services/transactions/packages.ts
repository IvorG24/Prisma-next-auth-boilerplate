export const Transaction = async (
	data: TransactionDataProps,
	onSuccess: (status: boolean) => void,
	onError: (error: string) => void
) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/transactions`,
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
interface TransactionDataProps {
	type: string;
	amount: number;
	quantity: number;
}
