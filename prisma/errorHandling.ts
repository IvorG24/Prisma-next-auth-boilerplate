import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const handlePrismaErrors = (e: any) => {
	let errorMessage = "";

	switch (true) {
		case e instanceof PrismaClientKnownRequestError:
			errorMessage = handlePrismaErrors(e);
			break;

		case e instanceof Prisma.PrismaClientValidationError:
			errorMessage = handlePrismaValidationError(e);
			break;

		default:
			errorMessage = e.data || "Something went wrong. Please try again";
	}

	return errorMessage;
};
function handlePrismaValidationError(
	e: Prisma.PrismaClientValidationError
): string {
	throw new Error("Function not implemented.");
}
