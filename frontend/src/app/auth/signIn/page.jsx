"use client";
import React, { useEffect, useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import Loading from "./loading";
import { useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { PageWrap } from "@/app/(components)/motions/pageWrap";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LogInPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const cbu = searchParams.get("callbackUrl") ?? "";
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
	const isDisabled = !eml || !psw;

	//set focus on first input when page is loaded
	useEffect(() => {
		setTimeout(() => {
			if (!eml) {
				setFocus("email");
			}
		}, 100);
	}, [setFocus, eml]);

	//handle logging in loader display
	useEffect(() => {
		load && setLogState("Logging in");
	}, [load]);

	//set focus if error
	useEffect(() => {
		if (errors?.email) {
			setFocus("email");
		} else if (errors?.password) {
			setFocus("password");
		}
	});

	//submit form
	const submitForm = async () => {
		setTimeout(async () => {
			setLoad(true);
			await signIn("credentials", {
				email: getValues("email"),
				password: getValues("password"),
				redirect: true,
				callbackUrl: cbu ? cbu : "/thread",
			});
		}, 700);
	};

	//handle nextauth signin error page display
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
				role="alert"
				aria-live="assertive">
				{errorMessage}
			</motion.p>
		);
	};

	//handle callback navigate if error
	useEffect(() => {
		if (error) {
			const newcbu = cbu?.split("/")[2] ?? "/thread";
			setTimeout(() => {
				router.replace(`/auth/signIn?callbackUrl=${newcbu}`);
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
							<Suspense>
								<p className="text-clamp7 text-center">
									No account yet ?
									<a
										className="text-appmauvedark hover:text-appturq hover:translate-y-1 active:text-appturq focus:text-appturq active:underline transition-all duration-200 ease-in-out uppercase"
										href={
											cbu
												? `/auth/register?callbackUrl=${cbu}`
												: "/auth/register"
										}
										as={"/auth/register"}>
										{" "}
										Sign up
									</a>
								</p>
								<div className="flex flex-col border-2 border-apppink dark:border-appstone rounded-xl bg-apppink dark:bg-appstone shadow-md m-[2rem] h-fit lg:w-[60%] lg:mx-auto lg:my-[3rem]">
									<h1 className="text-clamp5 text-center mb-[1.6rem] mt-[0.8rem] uppercase">
										Sign In
									</h1>
									<AnimatePresence>
										<Suspense>
											{error && (
												<SignInError error={error} />
											)}
										</Suspense>
									</AnimatePresence>
									<form
										className="mb-[1.2rem] py-[0.8rem] flex flex-col items-center text-clamp6"
										onSubmit={handleSubmit(submitForm)}>
										<input
											type="email"
											placeholder="   Email"
											autoComplete="off"
											{...register("email", {
												required:
													"This field is required",
											})}
											className={`border-2 border-appstone rounded-md h-[4rem] w-[26rem] mob20:w-[92%] lg:w-[50%] my-[1.2rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc focus:border-appturq focus:outline-none focus:invalid:border-appred ${
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

										<div className="relative mob20:flex mob20:justify-center mob20:w-full lg:w-full lg:justify-center lg:flex">
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
												className={`border-2 border-appstone rounded-md h-[4rem] w-[26rem] mob20:w-[92%] lg:w-[50%] my-[1.2rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc focus:border-appturq focus:outline-none focus:invalid:border-appred ${
													errors.password
														? "border-appred focus:border-appred"
														: ""
												}`}
											/>
											<button
												type="button"
												title="show password"
												aria-roledescription="click and hold or hold enter or numpad / to show password"
												className="absolute top-[2rem] right-[0.5rem] mob20:right-[6%] lg:right-[26%]"
												onKeyDown={(e) => {
													if (
														e.key === "/" ||
														e.key === "Enter"
													) {
														setEyePEffect(true);
														setShowPassword(true);
													}
												}}
												onKeyUp={(e) => {
													if (
														e.key === "/" ||
														e.key === "Enter"
													) {
														setEyePEffect(false);
														setShowPassword(false);
													}
												}}>
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
													className={`hover:text-appmauvelight dark:hover:text-appmauvedark active:text-appmauvedark dark:active:text-appgreenlight ${
														eyePEffect &&
														"animate-btnFlat"
													} ${
														showPassword &&
														"text-appmauvedark dark:text-appgreenlight"
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
											aria-disabled={isDisabled}
											onClick={(e) => {
												isDisabled
													? e.preventDefault
													: setSubmitBtnEffect(true);
											}}
											onAnimationEnd={() =>
												setSubmitBtnEffect(false)
											}
											className={`bg-appstone dark:bg-appmauvedark text-white uppercase w-fit rounded-xl px-[1.2rem] py-[0.3rem] mt-[3.2rem] mb-[1.6rem] shadow-neatcard ${
												submitBtnEffect &&
												"animate-btnFlat bg-apppastgreen text-appblck"
											} ${
												isDisabled
													? "opacity-50 cursor-not-allowed"
													: "transition-all duration-300 ease-in-out hover:bg-[#D9FFC5] hover:text-appblck hover:translate-y-[-7px] hover:shadow-btngreen"
											}`}>
											Submit
										</button>
									</form>
								</div>
							</Suspense>
						</div>
					)}
				</div>
			</section>
		</PageWrap>
	);
}
