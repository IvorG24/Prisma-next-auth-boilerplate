import React, { useState, useEffect } from "react";
import DashboardLayout from "@/src/layouts/Dashboardlayout";
import { Role } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { AuthOptions, getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/router";

interface Gesture {
	id: string;
	gesture: string;
	finger1: "0" | "1";
	finger2: "0" | "1";
	finger3: "0" | "1";
	finger4: "0" | "1";
}
interface GestureDetailsProps {
	role: Role;
	Gesture?: Gesture[];
}
const gestureDetails = [
	{
		id: "1",
		gesture: "Gesture 1",
		finger1: "1",
		finger2: "0",
		finger3: "0",
		finger4: "0",
	},
	{
		id: "2",
		gesture: "Gesture 2",
		finger1: "0",
		finger2: "1",
		finger3: "0",
		finger4: "0",
	},
	{
		id: "3",
		gesture: "Gesture 3",
		finger1: "1",
		finger2: "1",
		finger3: "0",
		finger4: "0",
	},
	// Add more gesture details as needed
	{
		id: "20",
		gesture: "Gesture 4",
		finger1: "1",
		finger2: "1",
		finger3: "1",
		finger4: "1",
	},
];
export default function GestureDetails({ role, Gesture }: GestureDetailsProps) {
	const router = useRouter();

	const { id } = router.query;
	const [gesture, setGesture] = useState<Gesture | null>(null);

	useEffect(() => {
		const foundGesture = gestureDetails.find((item) => item.id === id);
		if (foundGesture) {
			setGesture(foundGesture as Gesture);
		}
	}, [id]);

	const handleSwitchChange = (fingerName: keyof Gesture, value: boolean) => {
		if (gesture) {
			// Update the state of the corresponding finger
			setGesture((prevState) => ({
				...prevState!,
				[fingerName]: value ? "1" : "0",
			}));
		}
	};

	return (
		<DashboardLayout role={role}>
			<div className="min-h-screen h-full flex justify-center items-center border-2">
				<div className=" flex gap-8">
					<div>
						<h1>Gesture Detail Page</h1>
						<p>Gesture ID: {id}</p>
					</div>
					<div className="flex flex-col gap-8">
						{gesture && (
							<>
								<div className="flex items-center space-x-2">
									<Switch
										id="finger1"
										checked={gesture.finger1 === "1"}
										onChange={(value) =>
											handleSwitchChange("finger1", Boolean(value))
										}
									/>
									<Label htmlFor="finger1">Finger1</Label>
								</div>
								<div className="flex items-center space-x-2">
									<Switch
										id="finger2"
										checked={gesture.finger2 === "1"}
										onChange={(value) =>
											handleSwitchChange("finger2", Boolean(value))
										}
									/>
									<Label htmlFor="finger2">Finger2</Label>
								</div>
								<div className="flex items-center space-x-2">
									<Switch
										id="finger3"
										checked={gesture.finger3 === "1"}
										onChange={(value) =>
											handleSwitchChange("finger3", Boolean(value))
										}
									/>
									<Label htmlFor="finger3">Finger3</Label>
								</div>
								<div className="flex items-center space-x-2">
									<Switch
										id="finger4"
										checked={gesture.finger4 === "1"}
										onChange={(value) =>
											handleSwitchChange("finger4", Boolean(value))
										}
									/>
									<Label htmlFor="finger4">Finger4</Label>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
}

export const getServerSideProps = async (
	context: GetServerSidePropsContext
) => {
	const session = await getServerSession(
		context.req,
		context.res,
		authOptions(context.req, context.res) as AuthOptions
	);

	if (!session?.currentUser.id) {
		return {
			redirect: {
				permanent: false,
				destination: "/auth/login",
			},
		};
	}

	return { props: { role: session.currentUser.role } };
};
