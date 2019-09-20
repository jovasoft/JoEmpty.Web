import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store/store";
import Vuelidate from "vuelidate";
import Notifications from "vue-notification";
import BootstrapVue from "bootstrap-vue";
import ApiService from "./services/api.service";
import { StorageService } from "./services/storage.service";
import globals from "./globals";
import Popper from "popper.js";

ApiService.init(process.env.VUE_APP_ROOT_API);

// If token exists set header
if (StorageService.getToken()) {
	ApiService.setHeader();
}

// Required to enable animations on dropdowns/tooltips/popovers
Popper.Defaults.modifiers.computeStyle.gpuAcceleration = false;

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(Vuelidate);
Vue.use(Notifications);

// Global RTL flag
Vue.mixin({
	data: globals
});

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount("#app");
