import ApiService from "../api.service";

class UpdateError extends Error {
	constructor(errorCode, message) {
		super(message);
		this.name = this.constructor.name;
		this.message = message;
		this.errorCode = errorCode;
	}
}

const ClientService = {
	Get: async function() {
		try {
			const response = await ApiService.get(ApiService.baseAddress + "client");
			return response;
		} catch (error) {
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	GetOne: async function(id) {
		try {
			const response = await ApiService.get(ApiService.baseAddress + "client/GetOne/" + id);
			return response;
		} catch (error) {
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	Add: async function(client) {
		try {
			const response = await ApiService.post(ApiService.baseAddress + "client", client);
			return response;
		} catch (error) {
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	Update: async function(id, client) {
		try {
			const response = await ApiService.put(ApiService.baseAddress + "client/" + id, client);
			return response;
		} catch (error) {
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	Delete: async function(id) {
		try {
			const response = await ApiService.delete(ApiService.baseAddress + "client/" + id);
			return response;
		} catch (error) {
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	}
};

export default ClientService;
export { ClientService, UpdateError };
