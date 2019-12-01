import { ClientService } from "@/services/clientTransactions/client.service";

export const namespaced = true;

export const state = {
	status: "init",
	response: null,
	errorCode: 0,
	errorMessage: ""
};

export const getters = {
	response: state => {
		return state.response;
	},
	errorCode: state => {
		return state.errorCode;
	},
	errorMessage: state => {
		return state.errorMessage;
	},
	status: state => {
		return state.status;
	}
};

export const actions = {
	async Get({ commit }) {
		try {
			commit("changeStatus", "loading");
			const response = await ClientService.Get();
			commit("success", response);
		} catch (error) {
			commit("error", {
				errorCode: error.errorCode,
				errorMessage: error.message
			});
		}
	},

	async GetOne({ commit }, id) {
		try {
			commit("changeStatus", "loading");
			const response = await ClientService.GetOne(id);
			commit("success", response);
		} catch (error) {
			commit("error", {
				errorCode: error.errorCode,
				errorMessage: error.message
			});
		}
	},

	async Add({ commit }, client) {
		try {
			commit("changeStatus", "loading");
			const response = await ClientService.Add(client);
			commit("success", response);
		} catch (error) {
			commit("error", {
				errorCode: error.errorCode,
				errorMessage: error.message
			});
		}
	},

	async Update({ commit }, client) {
		try {
			commit("changeStatus", "loading");
			const response = await ClientService.Update(client.id, client.client);
			commit("success", response);
		} catch (error) {
			commit("error", {
				errorCode: error.errorCode,
				errorMessage: error.message
			});
		}
	},

	async Delete({ commit }, id) {
		try {
			commit("changeStatus", "loading");
			const response = await ClientService.Delete(id);
			commit("success", response);
		} catch (error) {
			commit("error", {
				errorCode: error.errorCode,
				errorMessage: error.message
			});
		}
	}
};

export const mutations = {
	success(state, response) {
		state.response = response;
		state.errorCode = 0;
		state.errorMessage = "";
		state.status = "loaded";
	},

	error(state, { errorCode, errorMessage }) {
		state.response = null;
		state.errorCode = errorCode;
		state.errorMessage = errorMessage;
		state.status = "failed";
	},

	changeStatus(state, status) {
		state.status = status;
	}
};
