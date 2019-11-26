import Vue from "vue";
import Vuex from "vuex";
import * as auth from "@/store/modules/auth.js";
import * as user from "@/store/modules/user.js";
import * as area from "@/store/modules/clientTransactions/area.js";
import * as client from "@/store/modules/clientTransactions/client.js";
import * as clientContact from "@/store/modules/clientTransactions/clientContact.js";
import * as contract from "@/store/modules/clientTransactions/contract.js";
import * as facility from "@/store/modules/clientTransactions/facility.js";
import * as personal from "@/store/modules/clientTransactions/personal.js";

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		auth,
		user,
		area,
		client,
		clientContact,
		contract,
		facility,
		personal
	}
});
