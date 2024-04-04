"use client";
import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Loading from "./loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { PageWrap } from "@/app/(components)/motions/pageWrap";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";

// eslint-disable-next-line max-len
const USER_REGEX = /(^[a-zA-Z]{2,})+([A-Za-z0-9-_])/;
const EMAIL_REGEX =
	/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
const PASSWORD_REGEX = /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9])/;
// const USER_REGEX = /^[a-zA-Z-_]{5,10}$/
// const USER_REGEX = /(^[a-zA-Z-_]{3,3})+([A-Za-z0-9]){1,12}$/
// const PASSWORD_REGEX = /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,15})$/
const REGISTER_URL = "/api/auth/signup";

export default function RegisterPage({ props }) {
	const searchParams = useSearchParams();
	const cbu = searchParams.get("callbackUrl");
	const {
		register,
		handleSubmit,
		getValues,
		watch,
		setError,
		setFocus,
		reset,
		formState: { errors, isSubmitSuccessful },
	} = useForm({
		defaultValues: {
			username: "",
			email: "",
			password: "",
		},
		mode: "onSubmit",
	});
	const password = useRef({});
	password.current = watch("password", "");
	const usrn = watch("username");
	const eml = watch("email");
	const psw = watch("password");
	const [signupState, setSignupState] = useState();
	const [load, setLoad] = useState(false);
	const [submitBtnEffect, setSubmitBtnEffect] = useState(false);
	const [errMsg, setErrMsg] = useState("");
	const [eyePEffect, setEyePEffect] = useState(false);
	const [eyeCPEffect, setEyeCPEffect] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const isDisabled = !usrn || !eml || !psw || !password;
	const [isSent, setIsSent] = useState(false);

	//set focus on first input when page is loaded
	useEffect(() => {
		setTimeout(() => {
			if (!usrn) {
				setFocus("username");
			}
		}, 100);
	}, [setFocus, usrn]);

	//handle signing up loader display
	useEffect(() => {
		load && setSignupState("Signing up");
	}, [load]);

	//set focus if error
	useEffect(() => {
		if (errors?.username) {
			setFocus("username");
		} else if (errors?.email) {
			setFocus("email");
		}
	});

	//submit form
	const submitForm = async (data, e) => {
		e.preventDefault();
		setErrMsg("");
		setIsSent(false);
		data = {
			username: getValues("username"),
			email: getValues("email"),
			password: getValues("password"),
		};
		setTimeout(async () => {
			setLoad(true);
			try {
				const response = await axios.post(
					process.env.NEXT_PUBLIC_API + REGISTER_URL,
					JSON.stringify(data),
					{
						headers: { "Content-Type": "application/json" },
						withCredentials: true,
					}
				);
				//console.log(response?.data);
				setIsSent(true);
				setSignupState("Signed up");
				setLoad(false);
			} catch (err) {
				setLoad(false);
				setSignupState();
				if (!err?.response) {
					setErrMsg(
						"Server unresponsive, please try again or come back later."
					);
				} else if (err.response?.status === 409) {
					setError("username", {
						type: "custom",
						message: "Username already taken",
					});
					setFocus("username");
				} else if (err.response?.status === 403) {
					setError("email", {
						type: "custom",
						message: "Email already taken",
					});
					setFocus("email");
				} else {
					setErrMsg("Inscription failed, please try again.");
				}
			}
		}, 700);
	};

	return (
		<PageWrap>
			<section className="">
				<div className="mt-[4.8rem] mb-[8rem]">
					<AnimatePresence>
						{signupState === "Signing up" ? (
							<Loading />
						) : isSubmitSuccessful &&
						  signupState === "Signed up" ? (
							<motion.p
								initial={{ x: 70, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								exit={{ x: 70, opacity: 0 }}
								transition={{ type: "popLayout" }}
								className="text-center text-clamp5 h-[32rem] mt-[11.2rem]">
								<p className="mb-[2.5rem]">
									Registered ! You can now sign in.
								</p>
								<a
									className="text-appmauvedark hover:text-appturq hover:translate-y-1 active:text-appturq focus:text-appturq active:underline transition-all duration-200 ease-in-out uppercase"
									href={
										cbu
											? `/auth/signIn?callbackUrl=${cbu}`
											: "/auth/signIn"
									}
									as={"/auth/signIn"}>
									{" "}
									Sign in
								</a>
							</motion.p>
						) : (
							<div>
								<p className="text-clamp7 text-center">
									Already have an account ?
									<a
										className="text-appmauvedark hover:text-appturq hover:translate-y-1 active:text-appturq focus:text-appturq active:underline transition-all duration-200 ease-in-out uppercase"
										href={
											cbu
												? `/auth/signIn?callbackUrl=${cbu}`
												: "/auth/signIn"
										}
										as={"/auth/signIn"}>
										{" "}
										Sign in
									</a>
								</p>

								<div className="border-2 border-apppastgreen dark:border-appstone rounded-xl bg-apppastgreen dark:bg-appstone shadow-md m-[2rem] h-fit lg:w-[60%] lg:mx-auto lg:my-[3rem]">
									<h1 className="text-clamp5 text-center mb-[1.6rem] mt-[0.8rem] uppercase">
										Sign up
									</h1>
									<AnimatePresence>
										{errMsg && (
											<motion.p
												initial={{ x: 70, opacity: 0 }}
												animate={{ x: 0, opacity: 1 }}
												exit={{ x: 70, opacity: 0 }}
												transition={{
													type: "popLayout",
												}}
												className="self-center text-red-600 bg-white font-semibold drop-shadow-light mx-[2.4rem] rounded-md w-fit px-[0.8rem] text-clamp6"
												role="alert"
												aria-live="assertive">
												{errMsg}
											</motion.p>
										)}
									</AnimatePresence>
									<form
										className="mb-[1.2rem] py-[0.8rem] flex flex-col items-center text-clamp6"
										onSubmit={handleSubmit(submitForm)}>
										<input
											placeholder="   Username"
											autoComplete="off"
											{...register("username", {
												required:
													"This field is required",
												minLength: {
													value: 4,
													message:
														"4 characters minimum",
												},
												maxLength: {
													value: 15,
													message:
														"15 characters maximum",
												},
												pattern: {
													value: USER_REGEX,
													message:
														"Username must start with letters (digits, -, _ allowed)",
												},
											})}
											className={`border-2 border-appstone rounded-md h-[4rem] w-[26rem] mob20:w-[92%] lg:w-[50%] my-[1.2rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc focus:border-appturq focus:outline-none focus:invalid:border-appred ${
												errors.username
													? "border-appred focus:border-appred"
													: ""
											}`}
										/>
										{errors.username && (
											<span className="text-red-600 bg-white font-semibold shadow-elevated px-[0.8rem] rounded-md">
												{errors.username.message}
											</span>
										)}

										<input
											type="email"
											placeholder="   Email"
											{...register("email", {
												required:
													"This field is required",
												pattern: {
													value: EMAIL_REGEX,
													message:
														"Email must have a valid format",
												},
											})}
											className={`border-2 border-appstone rounded-md h-[4rem] w-[26rem] mob20:w-[92%] lg:w-[50%] my-[1.2rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc focus:border-appturq focus:outline-none focus:invalid:border-appred ${
												errors.email
													? "border-appred focus:border-appred"
													: ""
											}`}
										/>
										{errors.email && (
											<span className="text-red-600 bg-white font-semibold shadow-elevated px-[0.8rem] rounded-md">
												{errors.email.message}
											</span>
										)}

										<div className="relative mob20:flex mob20:justify-center mob20:w-full lg:w-full lg:justify-center lg:flex">
											<input
												type={
													showPassword
														? "text"
														: "password"
												}
												autoComplete="new-password"
												placeholder="   Password"
												{...register("password", {
													required:
														"This field is required",
													minLength: {
														value: 6,
														message:
															"6 characters minimum",
													},
													maxLength: {
														value: 35,
														message:
															"35 characters maximum",
													},
													pattern: {
														value: PASSWORD_REGEX,
														message:
															"Password must have at least 1 digit and 1 letter",
													},
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
												aria-roledescription="click and hold or hold enter or numpad / to show"
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
											<span className="text-red-600 bg-white font-semibold shadow-elevated px-[0.8rem] rounded-md">
												{errors.password.message}
											</span>
										)}

										<div className="relative mob20:flex mob20:justify-center mob20:w-full lg:flex lg:w-full lg:justify-center">
											<input
												type={
													showConfirmPassword
														? "text"
														: "password"
												}
												autoComplete="off"
												placeholder="   Confirm password"
												{...register(
													"confirm_password",
													{
														required:
															"This field is required",
														validate: (value) =>
															value ===
																password.current ||
															"Passwords do not match",
													}
												)}
												className={`border-2 border-appstone rounded-md h-[4rem] w-[26rem] mob20:w-[92%] lg:w-[50%] my-[1.2rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc focus:border-appturq focus:outline-none focus:invalid:border-appred ${
													errors.confirm_password
														? "border-appred focus:border-appred"
														: ""
												}`}
											/>
											<button
												type="button"
												title="show confirm password"
												aria-roledescription="click and hold or hold enter or numpad / to show"
												className="absolute top-[2rem] right-[0.5rem] mob20:right-[6%] lg:right-[26%]"
												onKeyDown={(e) => {
													if (
														e.key === "/" ||
														e.key === "Enter"
													) {
														setEyeCPEffect(true);
														setShowConfirmPassword(
															true
														);
													}
												}}
												onKeyUp={(e) => {
													if (
														e.key === "/" ||
														e.key === "Enter"
													) {
														setEyeCPEffect(false);
														setShowConfirmPassword(
															false
														);
													}
												}}>
												<FontAwesomeIcon
													icon={faEye}
													onTouchStart={() => {
														setEyeCPEffect(true);
														setShowConfirmPassword(
															true
														);
													}}
													onTouchEnd={() =>
														setShowConfirmPassword(
															false
														)
													}
													onMouseDown={() => {
														setEyeCPEffect(true);
														setShowConfirmPassword(
															true
														);
													}}
													onMouseUp={() =>
														setShowConfirmPassword(
															false
														)
													}
													onAnimationEnd={() =>
														setEyeCPEffect(false)
													}
													className={`hover:text-appmauvelight dark:hover:text-appmauvedark active:text-appmauvedark dark:active:text-appgreenlight ${
														eyeCPEffect &&
														"animate-btnFlat"
													} ${
														showConfirmPassword &&
														"text-appmauvedark dark:text-appgreenlight"
													}`}
												/>
											</button>
										</div>
										{errors.confirm_password && (
											<span className="text-red-600 bg-white font-semibold shadow-elevated px-[0.8rem] rounded-md">
												{
													errors.confirm_password
														.message
												}
											</span>
										)}

										<button
											type="submit"
											aria-disabled={isDisabled}
											onClick={(e) => {
												isDisabled
													? e.preventDefault()
													: setSubmitBtnEffect(true);
											}}
											onAnimationEnd={() =>
												setSubmitBtnEffect(false)
											}
											className={`bg-appstone text-white uppercase w-fit rounded-xl px-[1.2rem] py-[0.3rem] mt-[3.2rem] mb-[1.6rem] shadow-neatcard ${
												submitBtnEffect &&
												"animate-btnFlat bg-apppastgreen text-appblck"
											} ${
												isDisabled
													? "opacity-50 cursor-not-allowed"
													: "transition-all duration-300 ease-in-out hover:bg-[#ffcec9] hover:text-appblck hover:translate-y-[-7px] hover:shadow-btnpink "
											}`}>
											Submit
										</button>
									</form>
								</div>
							</div>
						)}
					</AnimatePresence>
				</div>
			</section>
		</PageWrap>
	);
}
