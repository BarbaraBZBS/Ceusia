'use server';

import { cookies } from "next/headers";

export async function logout() {
    cookies().set( 'jwt', '' );
};