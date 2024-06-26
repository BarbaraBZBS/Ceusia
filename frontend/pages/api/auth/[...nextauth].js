import nextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions = {
	session: { maxAge: 2 * 24 * 60 * 60, strategy: "jwt" }, //2d or 5h: 5 * 60 * 60
	jwt: {
		secret: process.env.NEXTAUTH_SECRET,
		maxAge: 600,
	},
	providers: [
		CredentialsProvider({
			// The name to display on the sign in form (e.g. "Sign in with...")
			name: "Credentials",
			// `credentials` is used to generate a form on the sign in page.
			// You can specify which fields should be submitted, by adding keys to the `credentials` object.
			// e.g. domain, username, password, 2FA token, etc.
			// You can pass any HTML attribute to the <input> tag through the object.
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				try {
					const response = await axios({
						method: "post",
						url: `${process.env.NEXT_PUBLIC_API}/api/auth/login`,
						data: {
							email: credentials.email,
							password: credentials.password,
						},
						withCredentials: true,
					});
					return response.data;
				} catch (error) {
					console.log("msg : ", error.response.data.message);
					// throw new Error( error.response.data.message );
					return null;
				}
			},
		}),
	],

	callbacks: {
		//async redirect({ url, baseUrl }) {
		//	// Allows relative callback URLs
		//	if (url.startsWith("/")) return `${baseUrl}${url}`;
		//	// Allows callback URLs on the same origin
		//	else if (new URL(url).origin === baseUrl) return url;
		//	return baseUrl;
		//},
		async jwt({ token, user, trigger, session }) {
			if (user) {
				user.tokenExp = Date.now() + 600000;
			}
			if (trigger === "update" && session) {
				console.log("updated sess: ", { token, user, session });
				return { ...token, ...user, ...session?.user };
			}
			if (token.tokenExp <= Date.now()) {
				console.log(
					"expired token date :",
					new Date(token.tokenExp).toISOString()
				);
				console.log("now date :", new Date(Date.now()).toISOString());
				const data = { refreshToken: token.refreshToken };
				const tokenRes = await axios({
					method: "post",
					url: `${process.env.NEXT_PUBLIC_API}/api/auth/refresh`,
					data: data,
				});
				token.token = tokenRes.data.token;
				token.tokenExp = Date.now() + 600000;
				console.log("refreshed exp: ", token.tokenExp);
				return { ...token, ...token?.tokenExp, ...user };
			}
			console.log("jwt callback", { token, user, session });
			return { ...token, ...user };
		},
		async session({ session, token, user }) {
			session.user = token;
			console.log("session callback: ", { session, token, user });
			return session;
		},
	},
	pages: {
		signIn: "/auth/signIn",
		error: "/auth/signIn",
	},
};

export default nextAuth(authOptions);
