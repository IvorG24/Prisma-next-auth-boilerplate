export const RejectUser = async (
	data: RejectUserProps,
	onSuccess: (status: boolean) => void,
	onError: (error: string) => void
) => {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/user/RejectUser`,
			{
				method: "PUT",
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
	} catch (error) {
		onError("Failed to accept user.");
	}
};

interface RejectUserProps {
	id: string;
	status: string;
}
