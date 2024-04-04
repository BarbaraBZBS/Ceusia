"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useAxiosAuth from "@/app/(utils)/hooks/useAxiosAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCheckDouble,
	faPenFancy,
	faEraser,
	faImagePortrait,
	faArrowRotateLeft,
} from "@fortawesome/free-solid-svg-icons";

const USER_REGEX = /(^[a-zA-Z]{2,})+([A-Za-z0-9-_])/;

export default function CeusianDetailsModifier(props) {
	const axiosAuth = useAxiosAuth();
	const isBrowser = () => typeof window !== "undefined";
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
			motto: "",
			picture: "",
		},
		mode: "onSubmit",
	});
	const filewatch = watch("picture");
	const usrN = watch("username");
	const mt = watch("motto");
	const [pictureUpdated, setPictureUpdated] = useState(false);
	const [usrnEffect, setUsrnEffect] = useState(false);
	const [mottoEffect, setMottoEffect] = useState(false);
	const [resetBtnEffect, setResetBtnEffect] = useState(false);
	const [defaultPicEffect, setDefaultPicEffect] = useState(false);
	const [isSent, setIsSent] = useState(false);
	const isUsrnDisabled = !usrN;
	const isMtDisabled = !mt;
	const isResetDisabled =
		props.user.picture === "http://localhost:8000/profile/defaultUser.png";

	//submit form function
	const submitUpdate = async (data) => {
		setPictureUpdated(false);
		setIsSent(false);
		props.seterr("");
		data = {
			username: getValues("username"),
			motto: getValues("motto"),
		};
		try {
			await axiosAuth({
				method: "put",
				url: `/auth/user/${props.user.id}`,
				data: data,
			}).then(async () => {
				const resp = await axiosAuth.get(`/auth/user/${props.user.id}`);
				setIsSent(true);
				props.setuser(resp.data);
			});
		} catch (err) {
			if (!err?.response) {
				props.seterr(
					"Server unresponsive, please try again or come back later."
				);
				if (!isBrowser()) return;
				window.scrollTo({ top: 0, behavior: "smooth" });
			} else if (err.response?.status === 409) {
				setError("username", {
					type: "custom",
					message: "Username already taken",
				});
				setFocus("username");
			} else {
				props.seterr("Update failed, please try again.");
				if (!isBrowser()) return;
				window.scrollTo({ top: 0, behavior: "smooth" });
			}
		}
	};

	//not used for admin
	//submit form for picture only
	const submitPicUpdate = async (data) => {
		if (data.picture <= 0) {
			return;
		}
		const form = new FormData();
		form.append("picture", data.picture[0]);
		//console.log("file upload? : ", form);
		const headers = {
			"Content-Type": "multipart/form-data",
		};
		setPictureUpdated(false);
		props.seterr();
		try {
			await axiosAuth({
				method: "post",
				url: `/auth/user/${props.user.id}/upload`,
				data: form,
				headers: headers,
			}).then(async (response) => {
				if (response) {
					const resp = await axiosAuth.get(
						`/auth/user/${props.user.id}`
					);
					setIsSent(true);
					props.setuser(resp.data);
					setPictureUpdated(true);
				}
			});
		} catch (err) {
			if (!err?.response) {
				props.seterr(
					"Server unresponsive, please try again or come back later."
				);
				if (!isBrowser()) return;
				window.scrollTo({ top: 0, behavior: "smooth" });
			} else if (err.response?.status === 409) {
				setError("picture", {
					type: "custom",
					message: "Max size reached. (8Mb max)",
				});
			} else if (err.response?.status === 403) {
				setError("picture", {
					type: "custom",
					message: "Bad file type. (video, picture or audio only)",
				});
			} else {
				props.seterr("Update failed, please try again.");
				if (!isBrowser()) return;
				window.scrollTo({ top: 0, behavior: "smooth" });
			}
		}
	};

	//reset picture to default function
	const restoreDefault = () => {
		setDefaultPicEffect(true);
		setPictureUpdated(false);
		props.seterr();
		const data = { picture: "" };
		setTimeout(async () => {
			try {
				await axiosAuth({
					method: "post",
					url: `/auth/user/${props.user.id}/upload`,
					data: data,
				}).then(async (response) => {
					if (response) {
						//console.log("response data: ", response.data);
						//console.log("updated and restored default pic");
						const resp = await axiosAuth.get(
							`/auth/user/${props.user.id}`
						);
						props.setuser(resp.data);
						setPictureUpdated(true);
					}
				});
			} catch (err) {
				if (!err?.response) {
					props.seterr(
						"Server unresponsive, please try again or come back later."
					);
					if (!isBrowser()) return;
					window.scrollTo({ top: 0, behavior: "smooth" });
				} else {
					props.seterr("Update failed, please try again.");
					if (!isBrowser()) return;
					window.scrollTo({ top: 0, behavior: "smooth" });
				}
			}
		}, 700);
	};

	//reset form after submit if ok
	useEffect(() => {
		if (isSubmitSuccessful && isSent) {
			props.seterr("");
			reset();
		}
	}, [isSubmitSuccessful, isSent, reset, props]);

	return (
		<>
			<div className="flex flex-col items-center">
				<hr className="w-[80vw] mb-[3.2rem] border-t-solid border-t-[4px] rounded-md border-t-gray-300 dark:border-t-gray-500" />
				<h2 className="m-[1.2rem] mb-[2rem] text-center uppercase text-appred font-medium text-clamp3  mob88:text-clamp5 ">
					Admin monitoring
				</h2>
			</div>

			<div className="flex flex-col items-center">
				<form
					className="mb-[0.4rem] py-[0.4rem] flex items-center justify-evenly text-clamp6 w-[80%]"
					onSubmit={handleSubmit(submitUpdate)}>
					<input
						placeholder={`  ${props.current.username}`}
						{...register("username", {
							minLength: {
								value: 4,
								message: "4 characters minimum",
							},
							maxLength: {
								value: 15,
								message: "15 characters maximum",
							},
							pattern: {
								value: USER_REGEX,
								message:
									"Username must start with letters (digits, -, _ allowed)",
							},
						})}
						className={`border-2 border-appstone rounded-md h-[3.2rem] shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc my-[0.4rem] focus:border-apppink focus:outline-none focus:invalid:border-appred w-[74%] ${
							errors.username
								? "border-appred focus:border-appred"
								: ""
						}`}
					/>
					<button
						title="confirm username update"
						type="submit"
						aria-disabled={isUsrnDisabled}
						onClick={(e) => {
							isUsrnDisabled
								? e.preventDefault
								: setUsrnEffect(true);
						}}
						onAnimationEnd={() => setUsrnEffect(false)}
						className={`bg-appstone dark:bg-appmauvedark text-white w-[3.6rem] h-[3.6rem] mob88:w-[2.8rem] mob88:h-[2.8rem] rounded-2xl mt-[0.8rem] mb-[0.8rem]
                        bg-[radial-gradient(closest-side,#7953be,#7953be,transparent)] bg-no-repeat bg-[size:0%_0%] bg-[position:50%_50%] ${
							usrnEffect && "animate-bgSize"
						} ${
							isUsrnDisabled
								? "opacity-40 cursor-not-allowed"
								: "transition-all duration-300 ease-in-out hover:bg-apppastgreen hover:text-appblck hover:translate-y-[5px] hover:shadow-btnpastgreen"
						}`}>
						<FontAwesomeIcon icon={faPenFancy} />
					</button>
				</form>
				{errors.username && (
					<span className="text-red-600 bg-white font-semibold drop-shadow-light px-[0.8rem] rounded-md">
						{errors.username.message}
					</span>
				)}
			</div>

			<div className="flex flex-col items-center">
				<form
					className="py-[0.4rem] flex justify-evenly items-center text-clamp6 w-[80%] mb-[0.9rem]"
					onSubmit={handleSubmit(submitUpdate)}>
					<textarea
						type="text"
						placeholder={
							props.current.motto == "" ||
							props.current.motto == null
								? "  No motto to modify"
								: `  ${props.current.motto}`
						}
						{...register("motto")}
						className="border-2 border-appstone rounded-md shadow-neatcard hover:shadow-inputboxtext focus:shadow-inputboxtextfoc my-[0.4rem] focus:border-apppink focus:outline-none focus:invalid:border-appred h-[9.6rem] resize w-[74%] max-w-[98%]"
					/>
					<div className="">
						<button
							title="confirm motto update"
							type="submit"
							aria-disabled={isMtDisabled}
							onClick={(e) => {
								isMtDisabled
									? e.preventDefault
									: setMottoEffect(true);
							}}
							onAnimationEnd={() => setMottoEffect(false)}
							className={`bg-appstone dark:bg-appmauvedark text-white w-[3.6rem] h-[3.6rem] mob88:w-[2.8rem] mob88:h-[2.8rem] rounded-2xl mt-[0.8rem] mb-[0.8rem] 
                            bg-[radial-gradient(closest-side,#7953be,#7953be,transparent)] bg-no-repeat bg-[size:0%_0%] bg-[position:50%_50%] ${
								mottoEffect && "animate-bgSize"
							} ${
								isMtDisabled
									? "opacity-40 cursor-not-allowed"
									: "transition-all duration-300 ease-in-out hover:bg-apppastgreen hover:text-appblck hover:translate-y-[5px] hover:shadow-btnpastgreen"
							}`}>
							<FontAwesomeIcon icon={faPenFancy} />
						</button>
					</div>
				</form>
			</div>
			<div className="flex flex-col items-center">
				<div className="py-[0.4rem] flex flex-col items-center text-clamp6 w-full">
					<div className="flex w-[45vw] justify-around items-center mt-[0.4rem] mb-[0.8rem]">
						{pictureUpdated && (
							<FontAwesomeIcon
								icon={faCheckDouble}
								size={"xl"}
								style={{ color: "#84CC16" }}
							/>
						)}
					</div>
					<button
						title="reset picture to default"
						type="button"
						aria-disabled={isResetDisabled}
						onClick={(e) => {
							isResetDisabled
								? e.preventDefault
								: restoreDefault();
						}}
						onAnimationEnd={() => setDefaultPicEffect(false)}
						className={`relative self-end mr-[20%] ${
							defaultPicEffect && "animate-btnFlat"
						} ${
							isResetDisabled
								? "opacity-40"
								: "hover:opacity-70 transition-all duration-300 ease-in-out hover:translate-y-[5px]"
						}`}>
						<FontAwesomeIcon
							icon={faImagePortrait}
							size="xl"
							className="text-appstone dark:text-appmauvedark absolute left-[0rem] top-[0rem]"
						/>
						<FontAwesomeIcon
							icon={faArrowRotateLeft}
							style={{ color: "#FF7900" }}
							className="absolute left-[1.1rem] top-[0rem]"
						/>
					</button>
				</div>
			</div>
			<div className="flex justify-center">
				<button
					title="reset"
					type="button"
					onClick={() => {
						setResetBtnEffect(true);
						reset();
					}}
					onAnimationEnd={() => setResetBtnEffect(false)}
					className={`bg-[#FF7900] text-appblck w-[3.6rem] h-[3.6rem] mob88:w-[2.8rem] mob88:h-[2.8rem] rounded-xl mb-[0.8rem] mt-[1.6rem] transition-all duration-300 ease-in-out hover:bg-yellow-300 hover:translate-y-[7px]
                    hover:shadow-btnorange bg-[radial-gradient(closest-side,#7953be,#7953be,transparent)] bg-no-repeat bg-[size:0%_0%] bg-[position:50%_50%] shadow-neatcard ${
						resetBtnEffect && "animate-bgSize"
					}`}>
					<FontAwesomeIcon icon={faEraser} size="2xl" />
				</button>
			</div>
		</>
	);
}
