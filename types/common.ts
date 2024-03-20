export const ADMIN_ROLE = "Admin";
export const USER_ROLE = "user";
export const PENDING = "Pending";
export const VERIFIED = "Verified";
export const REJECTED = "Rejected";
export type PrismaCustomResponse = {
	data: any;
	status: number;
};

export const INITIAL_CUSTOM_RESPONSE = {
	data: null,
	status: 422,
};
