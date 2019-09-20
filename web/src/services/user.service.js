import ApiService from "../services/api.service";
import { TokenService } from "../services/storage.service";

class AuthenticationError extends Error {
	constructor(errorCode, message) {
		super(message);
		this.name = this.constructor.name;
		this.message = message;
		this.errorCode = errorCode;
	}
}

const UserService = {
	register: async function(credentials) {
		try {
			const response = await ApiService.post("http://207.154.196.92/api/auth/register", credentials);
			TokenService.saveUser(response.data);
			ApiService.setHeader();
			ApiService.mount401Interceptor();
			return response.data;
		} catch (error) {
			throw new AuthenticationError(error.response.status, error.response.data.message);
		}
	},

	login: async function(credentials) {
		try {
			const response = await ApiService.post("http://207.154.196.92/api/auth/login", credentials);
			TokenService.saveUser(response.data);
			ApiService.setHeader();
			ApiService.mount401Interceptor();
			return response.data;
		} catch (error) {
			throw new AuthenticationError(error.response.status, error.response.data.message);
		}
	},

	logout() {
		TokenService.removeUser();
		ApiService.removeHeader();
		ApiService.unmount401Interceptor();
	}
};

export default UserService;
export { UserService, AuthenticationError };
