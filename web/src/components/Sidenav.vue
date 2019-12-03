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
			<sidenav-menu icon="ion ion-md-people" :active="isMenuActive('/client-transactions')" :open="isMenuOpen('/client-transactions')">
				<template slot="link-text">
					Müşteri İşlemleri
				</template>
				<sidenav-menu icon="ion ion-md-person" :active="isMenuActive('/client-transactions/clients')" :open="isMenuOpen('/client-transactions/clients')">
					<template slot="link-text">
						Müşteriler
					</template>
					<sidenav-router-link to="/client-transactions/clients/list" :exact="true">Müşteri Listesi</sidenav-router-link>
					<sidenav-router-link to="/client-transactions/clients/add" :exact="true">Müşteri Ekle</sidenav-router-link>
				</sidenav-menu>
				<sidenav-menu icon="ion ion-md-copy" :active="isMenuActive('/client-transactions/contracts')" :open="isMenuOpen('/client-transactions/contracts')">
					<template slot="link-text">
						Sözleşmeler
					</template>
					<sidenav-router-link to="/client-transactions/contracts/list">Sözleşme Listesi</sidenav-router-link>
					<sidenav-router-link to="/client-transactions/contracts/add">Sözleşme Ekle</sidenav-router-link>
				</sidenav-menu>
				<sidenav-menu icon="ion ion-md-business" :active="isMenuActive('/client-transactions/facilities')" :open="isMenuOpen('/client-transactions/facilities')">
					<template slot="link-text">
						Tesisler
					</template>
					<sidenav-router-link to="/client-transactions/facilities/list">Tesis Listesi</sidenav-router-link>
					<sidenav-router-link to="/client-transactions/facilities/add">Tesis Ekle</sidenav-router-link>
				</sidenav-menu>
			</sidenav-menu>
			<sidenav-menu icon="ion ion-md-calculator" :active="isMenuActive('/accounting')" :open="isMenuOpen('/accounting')">
				<template slot="link-text">
					Muhasebe
				</template>
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
