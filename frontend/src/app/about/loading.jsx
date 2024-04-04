export default function Loading() {
	return (
		<div className="flex justify-center w-full h-full min-h-[80rem] mt-[16rem]">
			<div
				role="status"
				className="w-[4.8rem] h-[4.8rem] rounded-full animate-spin border-x-4 border-dashed border-appturq border-t-transparent"></div>
		</div>
	);
}
