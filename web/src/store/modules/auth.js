//import axios from "axios";
import router from "@/router";
import { UserService, AuthenticationError } from "@/services/user.service";
import { TokenService } from "@/services/storage.service";

export const namespaced = true;

export const state = {
	token: TokenService.getToken(),
	authenticating: false,
	authenticationErrorCode: 0,
	authenticationError: ""
};

export const getters = {
	loggedIn: state => {
		return state.token ? true : false;
	},

	authenticationErrorCode: state => {
		return state.authenticationErrorCode;
	},

	authenticationError: state => {
		return state.authenticationError;
	},

	authenticating: state => {
		return state.authenticating;
	}
};

export const actions = {
	async register({ commit }, credentials) {
		commit("loginRequest");
		try {
			const userData = await UserService.register(credentials);
			commit("loginSuccess", userData.token);
			router.push("/dashboard");
			return true;
		} catch (error) {
			if (error instanceof AuthenticationError) {
				commit("loginError", {
					errorCode: error.errorCode,
					errorMessage: error.message
				});
			}
			return false;
		}
	},

	async login({ commit }, credentials) {
		commit("loginRequest");
		try {
			const userData = await UserService.login(credentials);
			commit("loginSuccess", userData.token);
			router.push(router.history.current.query.redirect || "/dashboard");
			return true;
		} catch (error) {
			if (error instanceof AuthenticationError) {
				commit("loginError", {
					errorCode: error.errorCode,
					errorMessage: error.message
				});
			}
			return false;
		}
	},

	logout({ commit }) {
		UserService.logout();
		commit("logoutSuccess");
		router.push({ name: "landing" });
	}
};

export const mutations = {
	loginRequest(state) {
		state.authenticating = true;
		state.authenticationError = "";
		state.authenticationErrorCode = 0;
	},

	loginSuccess(state, accessToken) {
		state.token = accessToken;
		state.authenticating = false;
	},

	loginError(state, { errorCode, errorMessage }) {
		state.authenticating = false;
		state.authenticationErrorCode = errorCode;
		state.authenticationError = errorMessage;
	},

	logoutSuccess(state) {
		state.token = "";
	}
};
