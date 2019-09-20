import { UserService, UpdateError } from "@/services/user.service";

export const namespaced = true;

export const state = {
	updating: false,
	updateErrorCode: 0,
	updateError: ""
};

export const getters = {
	updating: state => {
		return state.updating;
	},
	updateErrorCode: state => {
		return state.updateErrorCode;
	},
	updateError: state => {
		return state.updateError;
	}
};

export const actions = {
	async updateUser({ commit }, credentials) {
		commit("updateRequest");
		try {
			await UserService.updateUser(credentials);
			commit("updateSuccess");
			return true;
		} catch (error) {
			if (error instanceof UpdateError) {
				commit("updateError", {
					errorCode: error.errorCode,
					errorMessage: error.message
				});
			}
			return false;
		}
	},
	async updatePassword({ commit }, credentials) {
		commit("updateRequest");
		try {
			const response = await UserService.updatePassword(credentials);
			if (response.data.status == "success") {
				commit("updateSuccess");
				return true;
			} else {
				commit("updateError", { errorCode: response.status, errorMessage: response.data.message });
				return false;
			}
		} catch (error) {
			if (error instanceof UpdateError) {
				commit("updateError", {
					errorCode: error.errorCode,
					errorMessage: error.message
				});
			}
		}
	}
};

export const mutations = {
	updateRequest(state) {
		state.updating = true;
		state.updateErrorCode = 0;
		state.updateError = "";
	},
	updateSuccess(state) {
		state.updating = false;
	},
	updateError(state, { errorCode, errorMessage }) {
		state.updating = false;
		state.updateErrorCode = errorCode;
		state.updateError = errorMessage;
	}
};
