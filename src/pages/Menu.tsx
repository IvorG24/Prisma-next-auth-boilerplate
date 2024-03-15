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
import { useRouter } from "next/navigation";

interface Menu {
	items: {
		href: string;
		title: string;
	}[];
	role: Role; // assuming role is passed as a prop
}

export function Menu({ items, role }: Menu) {
	const handleLogout = async () => {
		await signOut({
			callbackUrl:
				role === ADMIN_ROLE
					? `${window.location.origin}/auth/login`
					: `${window.location.origin}/auth/login`,
		});
	};

	return (
		<menu className="mb-6">
			<nav className="flex justify-end gap-x-10 py-4">
				<NavigationMenu className="flex gap-x-10 justify-end items-center">
					<NavigationMenuList>
						{items.map((item) => (
							<NavigationMenuItem key={item.href}>
								<Link href={item.href}>{item.title}</Link>
							</NavigationMenuItem>
						))}
					</NavigationMenuList>
					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuTrigger>
									<Avatar>
										<AvatarImage src="https://github.com/shadcn.png" />
										<AvatarFallback>CN</AvatarFallback>
									</Avatar>
								</NavigationMenuTrigger>
								<NavigationMenuContent className="px-6 py-4">
									<NavigationMenuLink
										className="cursor-pointer"
										onClick={handleLogout}
									>
										Logout
									</NavigationMenuLink>
								</NavigationMenuContent>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</NavigationMenu>
			</nav>
			<Separator />
		</menu>
	);
}
