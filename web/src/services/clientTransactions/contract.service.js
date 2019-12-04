import ApiService from "../api.service";

class UpdateError extends Error {
	constructor(errorCode, message) {
		super(message);
		this.name = this.constructor.name;
		this.message = message;
		this.errorCode = errorCode;
	}
}

const ContractService = {
	Get: async function() {
		try {
			const response = await ApiService.get(ApiService.baseAddress + "contract");
			return response;
		} catch (error) {
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	GetOne: async function(id) {
		try {
			const response = await ApiService.get(ApiService.baseAddress + "contract/GetOne/" + id);
			return response;
		} catch (error) {
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	GetContractsByClient: async function(clientId) {
		try {
			const response = await ApiService.get(ApiService.baseAddress + "contract/GetContractsByClient/" + clientId);
			return response;
		} catch (error) {
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	Add: async function(contract) {
		try {
			const response = await ApiService.post(ApiService.baseAddress + "contract", contract);
			return response;
		} catch (error) {
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	Update: async function(id, contract) {
		try {
			const response = await ApiService.put(ApiService.baseAddress + "contract/" + id, contract);
			return response;
		} catch (error) {
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	Delete: async function(id) {
		try {
			const response = await ApiService.delete(ApiService.baseAddress + "contract/" + id);
			return response;
		} catch (error) {
			throw new UpdateError(error.response.status, error.response.data.message);
		}
	}
};

export default ContractService;
export { ContractService, UpdateError };
