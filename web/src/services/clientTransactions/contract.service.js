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
			if (!error.response) throw new UpdateError(500, "Sunucuya bağlanılamadı.");
			else throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	GetOne: async function(id) {
		try {
			const response = await ApiService.get(ApiService.baseAddress + "contract/GetOne/" + id);
			return response;
		} catch (error) {
			if (!error.response) throw new UpdateError(500, "Sunucuya bağlanılamadı.");
			else throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	GetContractsByClient: async function(clientId) {
		try {
			const response = await ApiService.get(ApiService.baseAddress + "contract/GetContractsByClient/" + clientId);
			return response;
		} catch (error) {
			if (!error.response) throw new UpdateError(500, "Sunucuya bağlanılamadı.");
			else throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	Add: async function(contract) {
		try {
			const response = await ApiService.post(ApiService.baseAddress + "contract", contract);
			return response;
		} catch (error) {
			if (!error.response) throw new UpdateError(500, "Sunucuya bağlanılamadı.");
			else throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	Update: async function(id, contract) {
		try {
			const response = await ApiService.put(ApiService.baseAddress + "contract/" + id, contract);
			return response;
		} catch (error) {
			if (!error.response) throw new UpdateError(500, "Sunucuya bağlanılamadı.");
			else throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	Delete: async function(id) {
		try {
			const response = await ApiService.delete(ApiService.baseAddress + "contract/" + id);
			return response;
		} catch (error) {
			if (!error.response) throw new UpdateError(500, "Sunucuya bağlanılamadı.");
			else throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	UploadFile: async function(id, files) {
		try {
			const response = await ApiService.post(ApiService.baseAddress + "contract/Upload/" + id, files);
			return response;
		} catch (error) {
			if (!error.response) throw new UpdateError(500, "Sunucuya bağlanılamadı.");
			else throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	GetFiles: async function(contractId) {
		try {
			const response = await ApiService.get(ApiService.baseAddress + "contract/GetFiles/" + contractId);
			return response;
		} catch (error) {
			if (!error.response) throw new UpdateError(500, "Sunucuya bağlanılamadı.");
			else throw new UpdateError(error.response.status, error.response.data.message);
		}
	},

	DeleteFile: async function(contractId, fileId) {
		try {
			const response = await ApiService.delete(ApiService.baseAddress + "contract/DeleteFile/" + contractId + "/" + fileId);
			return response;
		} catch (error) {
			if (!error.response) throw new UpdateError(500, "Sunucuya bağlanılamadı.");
			else throw new UpdateError(error.response.status, error.response.data.message);
		}
	}
};

export default ContractService;
export { ContractService, UpdateError };
