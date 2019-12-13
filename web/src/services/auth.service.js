import ApiService from "../services/api.service";
import { StorageService } from "../services/storage.service";

class AuthenticationError extends Error {
	constructor(errorCode, message) {
		super(message);
		this.name = this.constructor.name;
		this.message = message;
		this.errorCode = errorCode;
	}
}

const AuthService = {
	register: async function(credentials) {
		try {
			const response = await ApiService.post(ApiService.baseAddress + "auth/register", credentials);
			StorageService.saveUser(response.data);
			ApiService.setHeader();
			ApiService.mount401Interceptor();
			return response.data;
		} catch (error) {
			throw new AuthenticationError(error.response.status, error.response.data.message);
		}
	},

	login: async function(credentials) {
		try {
			const response = await ApiService.post(ApiService.baseAddress + "auth/login", credentials);
			StorageService.saveUser(response.data);
			ApiService.setHeader();
			ApiService.mount401Interceptor();
			return response.data;
		} catch (error) {
			throw new AuthenticationError(error.response.status, error.response.data.message);
		}
	},

	logout() {
		StorageService.removeUser();
		ApiService.removeHeader();
		ApiService.unmount401Interceptor();
	}
};

export default AuthService;
export { AuthService, AuthenticationError };
