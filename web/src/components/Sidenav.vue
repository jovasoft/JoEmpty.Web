<template>
	<sidenav class="sidenav sidenav-vertical bg-sidenav-theme layout-sidenav">
		<!-- Inner -->
		<div class="app-brand py-3" style="height:66px">
			<img :src="`${publicUrl}img/logo.png`" alt class="app-brand-logo ui-w-40" />
			<router-link to="/" class="app-brand-text sidenav-text font-weight-normal ml-2" style="font-size:1.1rem">JoEmpty</router-link>
			<a href="javascript:void(0)" class="layout-sidenav-toggle sidenav-link text-large ml-auto" @click="toggleSidenav">
				<i class="ion ion-md-menu align-middle"></i>
			</a>
		</div>
		<div class="sidenav-divider mt-0"></div>
		<div class="sidenav-inner py-1">
			<sidenav-menu icon="ion ion-md-people" :active="isMenuActive('/clients')" :open="isMenuOpen('/clients')">
				<template slot="link-text"
					>Müşteriler</template
				>
				<sidenav-router-link to="/clients/list" :exact="true">Müşteri Listesi</sidenav-router-link>
				<sidenav-router-link to="/clients/add" :exact="true">Müşteri Ekle</sidenav-router-link>
			</sidenav-menu>
			<sidenav-menu icon="ion ion-md-copy" :active="isMenuActive('/contracts')" :open="isMenuOpen('/contracts')">
				<template slot="link-text"
					>Sözleşmeler</template
				>
				<sidenav-router-link to="/contracts/list" :exact="true">Sözleşme Listesi</sidenav-router-link>
				<sidenav-router-link to="/contracts/add" :exact="true">Sözleşme Ekle</sidenav-router-link>
			</sidenav-menu>
			<sidenav-menu icon="ion ion-md-business" :active="isMenuActive('/facilities')" :open="isMenuOpen('/facilities')">
				<template slot="link-text"
					>Tesisler</template
				>
				<sidenav-router-link to="/facilities/list" :exact="true">Tesis Listesi</sidenav-router-link>
				<sidenav-router-link to="/facilities/add" :exact="true">Tesis Ekle</sidenav-router-link>
			</sidenav-menu>
		</div>
	</sidenav>
</template>

<script>
import { Sidenav, SidenavLink, SidenavRouterLink, SidenavMenu, SidenavHeader, SidenavBlock, SidenavDivider } from "@/vendor/libs/sidenav";

export default {
	name: "app-layout-sidenav",
	components: {
		/* eslint-disable vue/no-unused-components */
		Sidenav,
		SidenavLink,
		SidenavRouterLink,
		SidenavMenu,
		SidenavHeader,
		SidenavBlock,
		SidenavDivider
		/* eslint-enable vue/no-unused-components */
	},

	methods: {
		isMenuActive(url) {
			return this.$route.path.indexOf(url) === 0;
		},

		isMenuOpen(url) {
			return this.$route.path.indexOf(url) === 0;
		},

		toggleSidenav() {
			this.layoutHelpers.toggleCollapsed();
		}
	}
};
</script>
