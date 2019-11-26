import ApiService from "../api.service";

class UpdateError extends Error {
	constructor(errorCode, message) {
		super(message);
		this.name = this.constructor.name;
		this.message = message;
		this.errorCode = errorCode;
	}
}

const PersonalService = {
	Get: async function() {
		try {
			const response = await ApiService.get(ApiService.baseAddress + "personal");
			return response;
		} catch (error) {
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	GetOne: async function(id) {
		try {
			const response = await ApiService.Get(ApiService.baseAddress + "personal/GetOne/" + id);
			return response;
		} catch (error) {
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	Add: async function(personal) {
		try {
			const response = await ApiService.post(ApiService.baseAddress + "personal", personal);
			return response;
		} catch (error) {
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	Update: async function(id, personal) {
		try {
			await ApiService.put(ApiService.baseAddress + "personal/" + id, personal);
		} catch (error) {
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	Delete: async function(id) {
		try {
			const response = await ApiService.delete(ApiService.baseAddress + "personal/" + id);
			return response;
		} catch (error) {
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	}
};

export default PersonalService;
export { PersonalService, UpdateError };
