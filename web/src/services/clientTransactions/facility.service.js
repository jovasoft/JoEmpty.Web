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
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	GetOne: async function(id) {
		try {
			const response = await ApiService.Get(ApiService.baseAddress + "facility/GetOne/" + id);
			return response;
		} catch (error) {
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	GeyFacilitiesByContract: async function(contractId) {
		try {
			const response = await ApiService.get(ApiService.baseAddress + "facility/GeyFacilitiesByContract/" + contractId);
			return response;
		} catch (error) {
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	GetFacilitiesByClient: async function(clientId) {
		try {
			const response = await ApiService.get(ApiService.baseAddress + "facility/GetFacilitiesByClient/" + clientId);
			return response;
		} catch (error) {
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	Add: async function(facility) {
		try {
			const response = await ApiService.post(ApiService.baseAddress + "facility", facility);
			return response;
		} catch (error) {
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	Update: async function(id, facility) {
		try {
			await ApiService.put(ApiService.baseAddress + "facility/" + id, facility);
		} catch (error) {
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	Delete: async function(id) {
		try {
			const response = await ApiService.delete(ApiService.baseAddress + "facility/" + id);
			return response;
		} catch (error) {
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	}
};

export default FacilityService;
export { FacilityService, UpdateError };
