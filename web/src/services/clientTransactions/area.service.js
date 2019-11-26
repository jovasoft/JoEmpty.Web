import ApiService from "../api.service";

class UpdateError extends Error {
	constructor(errorCode, message) {
		super(message);
		this.name = this.constructor.name;
		this.message = message;
		this.errorCode = errorCode;
	}
}

const AreaService = {
	Get: async function() {
		try {
			const response = await ApiService.get(ApiService.baseAddress + "area");
			return response;
		} catch (error) {
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	GetOne: async function(id) {
		try {
			const response = await ApiService.Get(ApiService.baseAddress + "area/GetOne/" + id);
			return response;
		} catch (error) {
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	Add: async function(area) {
		try {
			const response = await ApiService.post(ApiService.baseAddress + "area", area);
			return response;
		} catch (error) {
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	Update: async function(id, area) {
		try {
			await ApiService.put(ApiService.baseAddress + "area/" + id, area);
		} catch (error) {
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	Delete: async function(id) {
		try {
			const response = await ApiService.delete(ApiService.baseAddress + "area/" + id);
			return response;
		} catch (error) {
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	}
};

export default AreaService;
export { AreaService, UpdateError };
