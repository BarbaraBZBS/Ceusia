"use server";

import { cookies } from "next/headers";

export async function logout() {
	cookies().set("jwt", "");
}

export async function create(data) {
	cookies().set("jwt", data, { secure: true });
}

export async function getStored() {
	const cookieStore = cookies();
	const tok = cookieStore.get("jwt");
	//console.log(tok.value);
	return tok;
}
