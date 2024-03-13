// import ButtonLink from "@components/molecules/ButtonLink";
import Image from "next/image";
import baby from "public/images/error.png";
import React from "react";

import { useRouter } from "next/router";

const ServerError404 = () => {
	const router = useRouter();

	return (
		<>
			<div title="404" />
			<div className="fixed top-0 left-0 z-[999] h-screen w-screen bg-brandTres">
				<div className="flex h-full w-full items-center justify-center">
					<div className="relative h-4/5 w-11/12 bg-white md:w-4/5 xl:h-3/6 xl:w-4/6">
						<div className="flex h-full w-full flex-col items-center justify-center gap-y-6 px-6">
							<h1>Error 404</h1>
							<p className="text-center">
								Looks like the page can&#8217;t be found
							</p>
							<div className="w-full sm:w-fit">
								{/* <ButtonLink href={"/"} variant={"mobile"}>
                  Go back
                </ButtonLink> */}
							</div>
						</div>
						{/* <div className="absolute -bottom-2 right-5 w-28 md:right-28 md:w-40 xl:w-fit">
              <Image src={baby} alt="Error Baby" placeholder="blur" />
            </div> */}
					</div>
				</div>
			</div>
		</>
	);
};

export async function getStaticProps({ locale }: any) {
	return {
		props: {},
		revalidate: 10,
	};
}

export default ServerError404;
