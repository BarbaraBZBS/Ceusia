import { ReverseProxyPathMapper } from "reverse_proxy_pathmapper";

const pathMapper = {
	"/db/?(.*)": "http://localhost:8000", // backend-api
	"/?(.*)": "http://localhost:3000", // frontend
	// ?(.*) -> Regex to match any
};

new ReverseProxyPathMapper({}, pathMapper).serve(9000);
