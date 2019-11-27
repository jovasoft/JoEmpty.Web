import { FacilityService } from "@/services/clientTransactions/facility.service";

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
	async Get({ commit }) {
		try {
			const response = await FacilityService.Get();
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
			const response = await FacilityService.GetOne(id);
			commit("success", response);
		} catch (error) {
			commit("error", {
				errorCode: error.errorCode,
				errorMessage: error.message
			});
		}
	},

	async GetByContractFacilities({ commit }, contractId) {
		try {
			const response = await FacilityService.GetByContractFacilities(contractId);
			commit("success", response);
		} catch (error) {
			commit("error", {
				errorCode: error.errorCode,
				errorMessage: error.message
			});
		}
	},

	async Add({ commit }, facility) {
		try {
			const response = await FacilityService.Add(facility);
			commit("success", response);
		} catch (error) {
			commit("error", {
				errorCode: error.errorCode,
				errorMessage: error.message
			});
		}
	},

	async Update({ commit }, facility) {
		try {
			const response = await FacilityService.Update(facility);
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
			const response = await FacilityService.Delete(id);
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
