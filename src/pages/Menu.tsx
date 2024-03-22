import Link from "next/link";
import { signOut } from "next-auth/react";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ADMIN_ROLE } from "@/types/common";
import { Role } from "@prisma/client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
interface Menu extends React.HTMLAttributes<HTMLElement> {
	items: {
		href: string;
		title: string;
	}[];
	role: Role; // assuming role is passed as a prop
}

export function Menu({ className, items, role, ...props }: Menu) {
	const pathname = usePathname();
	const handleLogout = async () => {
		await signOut({
			callbackUrl:
				role === ADMIN_ROLE
					? `${window.location.origin}/auth/login`
					: `${window.location.origin}/auth/login`,
		});
	};

	return (
		<>
			<menu>
				<nav
					className={cn("flex justify-end py-2 items-end px-6", className)}
					{...props}
				>
					<div className="flex justify-evenly items-center">
						{items.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									buttonVariants({ variant: "ghost" }),
									pathname === item.href
										? "bg-blue-500 text-white hover:bg-muted"
										: "text-md hover:bg-transparent hover:text-xl transition-all duration-300 ease-in-out", // Changed transition property to 'transition-all'
									"justify-start"
								)}
							>
								{item.title}
							</Link>
						))}
						<Button variant="secondary" onClick={handleLogout}>
							Logout
						</Button>
					</div>
				</nav>
				<Separator />
			</menu>
		</>
	);
}
