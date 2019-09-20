const USER = "user";

const StorageService = {
	getToken() {
		if (JSON.parse(localStorage.getItem(USER))) return JSON.parse(localStorage.getItem(USER)).token;
		else return null;
	},
	saveUser(user) {
		localStorage.setItem(USER, JSON.stringify(user));
	},
	removeUser() {
		localStorage.removeItem(USER);
	},
	updateUser(firstName, lastName) {
		var user = JSON.parse(localStorage.getItem(USER));
		user.firstName = firstName;
		user.lastName = lastName;
		localStorage.setItem(USER, JSON.stringify(user));
	}
};

export { StorageService };
