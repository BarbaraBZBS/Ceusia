"use client";
import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import Loading from "./loading";
import { useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { PageWrap } from "@/components/motions/pageWrap";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LogInPage() {
	const router = useRouter();
	const [logState, setLogState] = useState();
	const [load, setLoad] = useState(false);
	const [submitBtnEffect, setSubmitBtnEffect] = useState(false);
	const errParams = useSearchParams();
	const error = errParams.get("error");
	const [eyePEffect, setEyePEffect] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const {
		register,
		handleSubmit,
		getValues,
		watch,
		setFocus,
		formState: { errors },
	} = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		mode: "onSubmit",
	});
	const eml = watch("email");
	const psw = watch("password");

	useEffect(() => {
		load && setLogState("Logging in");
	}, [load]);

	useEffect(() => {
		if (errors?.email) {
			setFocus("email");
		} else if (errors?.password) {
			setFocus("password");
		}
	});

	const submitForm = async () => {
		setTimeout(async () => {
			setLoad(true);
			await signIn("credentials", {
				email: getValues("email"),
				password: getValues("password"),
				redirect: true,
				callbackUrl: "/",
			});
		}, 700);
	};

	const signErrors = {
		CredentialsSignin:
			"Sign in failed. Check the details you provided are correct.",
		default: "Unable to sign in. Try again or come back later.",
	};
	const SignInError = ({ error }) => {
		const errorMessage = error && (signErrors[error] ?? signErrors.default);
		return (
			<motion.p
				initial={{ x: 70, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				exit={{ x: 70, opacity: 0 }}
				transition={{ type: "popLayout" }}
				className="self-center text-red-600 bg-white font-semibold drop-shadow-light mx-6 rounded-md w-fit px-2 text-clamp6 text-center"
				aria-live="assertive">
				{errorMessage}
			</motion.p>
		);
	};

	useEffect(() => {
		if (error) {
			setTimeout(() => {
				router.replace("/auth/signIn");
			}, 5000);
		}
	});

	return (
		<PageWrap>
			<section className="">
				<div className="mt-[6.4rem] mb-[16rem]">
					{logState === "Logging in" ? (
						<Loading />
					) : (
						<div>
							<p className="text-clamp7 text-center">
								No account yet ?
								<a
									className="text-appmauvedark hover:text-appturq hover:translate-y-1 active:text-appturq focus:text-appturq active:underline transition-all duration-200 ease-in-out uppercase"
									href="/auth/register"
									as={"/auth/register"}>
									{" "}
									Sign up
								</a>
							</p>
							<div className="flex flex-col border-2 border-apppink rounded-xl bg-apppink shadow-md m-[2rem] h-fit">
								<h1 className="text-clamp5 text-center mb-[1.6rem] mt-[0.8rem] uppercase">
									Sign In
								</h1>
								<AnimatePresence>
									{error && <SignInError error={error} />}
								</AnimatePresence>
								<form
									className="mb-[1.2rem] py-[0.8rem] flex flex-col items-center text-clamp6"
									onSubmit={handleSubmit(submitForm)}>
									<input
										type="email"
										placeholder="   Email"
										autoComplete="off"
										{...register("email", {
											required: "This field is required",
										})}
										className={`border-2 border-appstone rounded-md h-[4rem] w-[26rem] my-[1.2rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc focus:border-appturq focus:outline-none focus:invalid:border-appred ${
											errors.email
												? "border-appred focus:border-appred"
												: ""
										}`}
									/>
									{errors.email && (
										<span className="text-red-600 bg-white font-semibold shadow-elevated px-[0.8rem] rounded-md">
											This field is required
										</span>
									)}

									<div className="relative">
										<input
											type={
												showPassword
													? "text"
													: "password"
											}
											autoComplete="current-password"
											placeholder="   Password"
											{...register("password", {
												required:
													"This field is required",
											})}
											className={`border-2 border-appstone rounded-md h-[4rem] w-[26rem] my-[1.2rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc focus:border-appturq focus:outline-none focus:invalid:border-appred ${
												errors.password
													? "border-appred focus:border-appred"
													: ""
											}`}
										/>
										<button type="button">
											<FontAwesomeIcon
												icon={faEye}
												onTouchStart={() => {
													setEyePEffect(true);
													setShowPassword(true);
												}}
												onTouchEnd={() =>
													setShowPassword(false)
												}
												onMouseDown={() => {
													setEyePEffect(true);
													setShowPassword(true);
												}}
												onMouseUp={() =>
													setShowPassword(false)
												}
												onAnimationEnd={() =>
													setEyePEffect(false)
												}
												className={`absolute top-[2.3rem] right-[0.5rem] hover:text-appmauvelight ${
													eyePEffect &&
													"animate-btnFlat"
												} ${
													showPassword &&
													"text-appmauvedark"
												}`}
											/>
										</button>
									</div>
									{errors.password && (
										<span className="text-red-600 bg-white font-semibold drop-shadow-light px-[0.8rem] rounded-md">
											This field is required
										</span>
									)}

									<button
										type="submit"
										disabled={!eml || !psw}
										onClick={() => setSubmitBtnEffect(true)}
										onAnimationEnd={() =>
											setSubmitBtnEffect(false)
										}
										className={`bg-appstone text-white uppercase w-fit rounded-xl px-[1.2rem] py-[0.3rem] mt-[3.2rem] mb-[1.6rem] transition-all duration-300 ease-in-out hover:enabled:bg-[#D9FFC5] hover:enabled:text-appblck hover:enabled:translate-y-[-7px] hover:enabled:shadow-btngreen disabled:opacity-50 shadow-neatcard ${
											submitBtnEffect &&
											"animate-btnFlat bg-apppastgreen text-appblck"
										}`}>
										Submit
									</button>
								</form>
							</div>
						</div>
					)}
				</div>
			</section>
		</PageWrap>
	);
}
