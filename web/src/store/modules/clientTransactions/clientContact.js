import { ClientContactService } from "@/services/clientTransactions/clientContact.service";

export const namespaced = true;

export const state = {
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
	}
};

export const actions = {
	async Get({ commit }, clientId) {
		try {
			const response = await ClientContactService.Get(clientId);
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
			const response = await ClientContactService.GetOne(id);
			commit("success", response);
		} catch (error) {
			commit("error", {
				errorCode: error.errorCode,
				errorMessage: error.message
			});
		}
	},

	async Add({ commit }, clientContact) {
		try {
			const response = await ClientContactService.Add(clientContact);
			commit("success", response);
		} catch (error) {
			commit("error", {
				errorCode: error.errorCode,
				errorMessage: error.message
			});
		}
	},

	async Update({ commit }, clientContact) {
		try {
			const response = await ClientContactService.Update(clientContact.clientId, clientContact);
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
			const response = await ClientContactService.Delete(id);
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
	},

	error(state, { errorCode, errorMessage }) {
		state.response = null;
		state.errorCode = errorCode;
		state.errorMessage = errorMessage;
	}
};
