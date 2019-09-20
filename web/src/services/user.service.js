import ApiService from "../services/api.service";
import { StorageService } from "../services/storage.service";

class UpdateError extends Error {
	constructor(errorCode, message) {
		super(message);
		this.name = this.constructor.name;
		this.message = message;
		this.errorCode = errorCode;
	}
}

const UserService = {
	updateUser: async function(credentials) {
		try {
			await ApiService.put("http://207.154.196.92/api/user", credentials);
			StorageService.updateUser(credentials.firstname, credentials.lastname);
		} catch (error) {
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	updatePassword: async function(credentials) {
		try {
			const response = await ApiService.post("http://207.154.196.92/api/user/changepassword", credentials);
			return response;
		} catch (error) {
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	}
};

export default UserService;
export { UserService, UpdateError };
