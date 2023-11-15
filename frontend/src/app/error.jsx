"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { logout } from "./actions";

export default function Error({ error, reset }) {
	const router = useRouter();

	useEffect(() => {
		console.error(error);
	}, [error]);

	const logOut = async () => {
		router.push("/");
		logout();
		signOut({
			callbackUrl: "/auth/signIn",
		});
	};

	return (
		<div className="h-fit pt-[4rem] pb-[11.2rem] my-[6.4rem] flex flex-col items-center text-clamp1">
			<h2 className="text-clamp3">Something went wrong !</h2>
			<p className="text-clamp4 mt-[1.6rem]">
				Reload page or sign back in
			</p>
			{/* <p>{ error.message }</p> */}
			<button
				className="bg-appstone text-white uppercase w-fit rounded-xl px-[1.2rem] py-[0.3rem] mt-[3.2rem] mb-[1.6rem] transition-all duration-300 ease-in-out hover:bg-indigo-700 hover:text-white hover:translate-y-[-7px] hover:shadow-btnindigo"
				onClick={
					// Attempt to recover by trying to re-render the segment
					// () => reset()
					() => window.location.reload()
				}>
				Reload
			</button>
			<p>or</p>
			<button
				className="bg-appstone text-white uppercase w-fit rounded-xl px-[1.2rem] py-[0.3rem] mt-[3.2rem] mb-[1.6rem] transition-all duration-300 ease-in-out hover:bg-indigo-700 hover:text-white hover:translate-y-[-7px] hover:shadow-btnindigo"
				onClick={() => logOut()}>
				Sign Out
			</button>
		</div>
	);
}
