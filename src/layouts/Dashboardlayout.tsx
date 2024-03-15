import { Role } from "@prisma/client";
import { ReactNode } from "react";
import Link from "next/link";
import { Menu } from "../pages/Menu";
import { ADMIN_ROLE, USER_ROLE } from "@/types/common"; // Import roles from common types

type DashboardLayoutProps = {
	role: Role;
	children: ReactNode;
};

interface MenuItem {
	title: string;
	href: string;
	role?: Role[]; // Add role information to menu items
}

const DashboardLayout = ({ role, children }: DashboardLayoutProps) => {
	// Define menu items with role restrictions
	const menuItems: MenuItem[] = [
		{ title: "Dashboard", href: "/dashboard", role: [ADMIN_ROLE, USER_ROLE] },
		{ title: "User", href: "/user", role: [ADMIN_ROLE] },
		{ title: "Calendar", href: "/user/dashboard/calendar", role: [USER_ROLE] },
		{ title: "Notifications", href: "/user/dashboard/notification" },
		{ title: "Settings", href: "/user/dashboard/account/accountsetting" },
	];

	return (
		<>
			<main className="flex flex-col">
				<Menu
					role={role}
					items={menuItems.filter(
						(item) => !item.role || item.role.includes(role)
					)}
				/>
				<div className="min-h-screen h-full mx-20">{children}</div>
			</main>
		</>
	);
};

export default DashboardLayout;
