import router from "@/router/router";
import { AuthService, AuthenticationError } from "@/services/auth.service";
import { StorageService } from "@/services/storage.service";

export const namespaced = true;

export const state = {
	token: StorageService.getToken(),
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
			const userData = await AuthService.register(credentials);
			commit("loginSuccess", userData.token);
			router.push("/");
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
			const userData = await AuthService.login(credentials);
			commit("loginSuccess", userData.token);
			router.push(router.history.current.query.redirect || "/");
			return true;
		} catch (error) {
			if (error instanceof AuthenticationError) {
				if (error.errorCode == 400) {
					commit("loginError", {
						errorCode: error.errorCode,
						errorMessage: "Hatalı kullanıcı adı veya şifre."
					});
				} else {
					commit("loginError", {
						errorCode: error.errorCode,
						errorMessage: error.message
					});
				}
			}
			return false;
		}
	},

	logout({ commit }) {
		AuthService.logout();
		commit("logoutSuccess");
		router.push({ name: "login" });
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
