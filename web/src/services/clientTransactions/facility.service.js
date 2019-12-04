import ApiService from "../api.service";

class UpdateError extends Error {
	constructor(errorCode, message) {
		super(message);
		this.name = this.constructor.name;
		this.message = message;
		this.errorCode = errorCode;
	}
}

const FacilityService = {
	Get: async function() {
		try {
			const response = await ApiService.get(ApiService.baseAddress + "facility");
			return response;
		} catch (error) {
			if (!error.response) throw new UpdateError(500, "Sunucuya bağlanılamadı.");
			else throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	GetOne: async function(id) {
		try {
			const response = await ApiService.get(ApiService.baseAddress + "facility/GetOne/" + id);
			return response;
		} catch (error) {
			if (!error.response) throw new UpdateError(500, "Sunucuya bağlanılamadı.");
			else throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	GetFacilitiesByContract: async function(contractId) {
		try {
			const response = await ApiService.get(ApiService.baseAddress + "facility/GetFacilitiesByContract/" + contractId);
			return response;
		} catch (error) {
			if (!error.response) throw new UpdateError(500, "Sunucuya bağlanılamadı.");
			else throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	GetFacilitiesByClient: async function(clientId) {
		try {
			const response = await ApiService.get(ApiService.baseAddress + "facility/GetFacilitiesByClient/" + clientId);
			return response;
		} catch (error) {
			if (!error.response) throw new UpdateError(500, "Sunucuya bağlanılamadı.");
			else throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	Add: async function(facility) {
		try {
			const response = await ApiService.post(ApiService.baseAddress + "facility", facility);
			return response;
		} catch (error) {
			if (!error.response) throw new UpdateError(500, "Sunucuya bağlanılamadı.");
			else throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	Update: async function(id, facility) {
		try {
			const response = await ApiService.put(ApiService.baseAddress + "facility/" + id, facility);
			return response;
		} catch (error) {
			if (!error.response) throw new UpdateError(500, "Sunucuya bağlanılamadı.");
			else throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	Delete: async function(id) {
		try {
			const response = await ApiService.delete(ApiService.baseAddress + "facility/" + id);
			return response;
		} catch (error) {
			if (!error.response) throw new UpdateError(500, "Sunucuya bağlanılamadı.");
			else throw new UpdateError(error.response.status, error.response.data.message);
		}
	}
};

export default FacilityService;
export { FacilityService, UpdateError };
