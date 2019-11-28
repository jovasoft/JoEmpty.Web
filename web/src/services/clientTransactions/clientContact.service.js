import ApiService from "../api.service";

class UpdateError extends Error {
	constructor(errorCode, message) {
		super(message);
		this.name = this.constructor.name;
		this.message = message;
		this.errorCode = errorCode;
	}
}

const ClientContactService = {
	Get: async function(clientId) {
		try {
			const response = await ApiService.get(ApiService.baseAddress + "clientContact/" + clientId);
			return response;
		} catch (error) {
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	GetOne: async function(id) {
		try {
			const response = await ApiService.Get(ApiService.baseAddress + "clientContact/GetOne/" + id);
			return response;
		} catch (error) {
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	Add: async function(clientContact) {
		try {
			const response = await ApiService.post(ApiService.baseAddress + "clientContact", clientContact);
			return response;
		} catch (error) {
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	Update: async function(id, clientContact) {
		try {
			const response = await ApiService.put(ApiService.baseAddress + "clientContact/" + id, clientContact);
			return response;
		} catch (error) {
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	Delete: async function(id) {
		try {
			const response = await ApiService.delete(ApiService.baseAddress + "clientContact/" + id);
			return response;
		} catch (error) {
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	}
};

export default ClientContactService;
export { ClientContactService, UpdateError };
