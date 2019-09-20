const USER = "user";

const TokenService = {
	getToken() {
		if (JSON.parse(localStorage.getItem(USER))) return JSON.parse(localStorage.getItem(USER)).token;
		else return null;
	},
	saveUser(user) {
		localStorage.setItem(USER, JSON.stringify(user));
	},
	removeUser() {
		localStorage.removeItem(USER);
	}
};

export { TokenService };
