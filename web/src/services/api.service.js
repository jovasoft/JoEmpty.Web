import axios from "axios";
import store from "../store/store";
import { StorageService } from "../services/storage.service";

const ApiService = {
	_401interceptor: null,
	baseAddress: "http://172.17.0.2:5000/api/",
	//baseAddress: "http://207.154.196.92:5000/api/",
	init() {},

	setHeader() {
		axios.defaults.headers.common["Authorization"] = `Bearer ${StorageService.getToken()}`;
	},

	removeHeader() {
		axios.defaults.headers.common = {};
	},

	get(resource) {
		return axios.get(resource);
	},

	post(resource, data) {
		return axios.post(resource, data);
	},

	put(resource, data) {
		return axios.put(resource, data);
	},

	delete(resource) {
		return axios.delete(resource);
	},

	customRequest(data) {
		return axios(data);
	},

	mount401Interceptor() {
		this._401interceptor = axios.interceptors.response.use(
			response => {
				return response;
			},
			error => {
				if (error.request.status == 401) {
					if (error.config.url.include("/o/token/")) {
						store.dispatch("auth/logout");
						throw error;
					} else {
						try {
							store.dispatch("auth/refreshToken");
							return this.customRequest({
								method: error.config.method,
								url: error.config.url,
								data: error.config.data
							});
						} catch (e) {
							throw error;
						}
					}
				}
				throw error;
			}
		);
	},

	unmount401Interceptor() {
		axios.interceptors.response.eject(this._401interceptor);
	}
};

export default ApiService;
