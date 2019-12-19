import { FileService } from "@/services/file.service";

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
	async Get({ commit }, file) {
		try {
			commit("changeStatus", "loading");
			const response = await FileService.Get(file.url);
			var blob = new Blob([response.data], { type: file.type });
			commit("success", URL.createObjectURL(blob));
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
