import { GetServerSidePropsContext } from "next";

export default function Home() {
	return <></>;
}

export const getServerSideProps = async (
	context: GetServerSidePropsContext
) => {
	return {
		redirect: {
			permanent: false,
			destination: "auth/login",
		},
	};
};
