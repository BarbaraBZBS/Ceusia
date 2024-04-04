import apiCall from "../app/(utils)/axiosConfig";

export const getAllPosts = async () => {
	const res = await apiCall.get("/posts/all");
	if (!res) {
		console.log("error axios lib all posts");
	} else {
		const data = res.data;
		// console.log( 'res data: ', data )
		await renderDelay(1500);
		return data;
	}
};

export const getPosts = async (pg, ppg) => {
	const res = await apiCall.get(`/posts?page=${pg}&per_page=${ppg}`);
	if (!res) {
		console.log("error axios lib all posts");
	} else {
		const data = res.data;
		//console.log("paginated posts res data: ", data);
		await renderDelay(1500);
		return data;
	}
};

export async function renderDelay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getPost(num) {
	const res = await apiCall.get(`/posts/${num}`);
	if (!res) {
		console.log("error axios lib single post");
	} else {
		const data = res.data;
		// console.log( 'res data: ', data );
		return data;
	}
}

export const getPostComments = async (num) => {
	const res = await apiCall.get(`/posts/${num}/comments`);
	if (!res) {
		console.log("error axios lib all post comments");
	} else {
		const data = res.data;
		// console.log( 'res data: ', data )
		return data;
	}
};
