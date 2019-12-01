import { PersonalService } from "@/services/clientTransactions/personal.service";

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
			const response = await PersonalService.Get();
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
			const response = await PersonalService.GetOne(id);
			commit("success", response);
		} catch (error) {
			commit("error", {
				errorCode: error.errorCode,
				errorMessage: error.message
			});
		}
	},

	async Add({ commit }, personal) {
		try {
			commit("changeStatus", "loading");
			const response = await PersonalService.Add(personal);
			commit("success", response);
		} catch (error) {
			commit("error", {
				errorCode: error.errorCode,
				errorMessage: error.message
			});
		}
	},

	async Update({ commit }, personal) {
		try {
			commit("changeStatus", "loading");
			const response = await PersonalService.Update(personal);
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
			const response = await PersonalService.Delete(id);
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
