<template>
	<b-navbar toggleable="lg" :variant="getLayoutNavbarBg()" class="layout-navbar align-items-lg-center container-p-x">
		<b-navbar-brand to="/" class="app-brand d-lg-none py-0 mr-4">
			<img :src="`${publicUrl}img/logo.png`" alt class="app-brand-logo ui-w-40" />
			<span class="app-brand-text font-weight-normal ml-2" style="font-size:1.1rem">JoEmpty</span>
		</b-navbar-brand>

		<b-navbar-nav class="layout-sidenav-toggle d-lg-none align-items-lg-center mr-auto" v-if="sidenavToggle">
			<a class="nav-item nav-link px-0 mr-lg-4" href="javascript:void(0)" @click="toggleSidenav">
				<i class="ion ion-md-menu text-large align-middle" />
			</a>
		</b-navbar-nav>

		<b-navbar-toggle target="app-layout-navbar"></b-navbar-toggle>

		<b-collapse is-nav id="app-layout-navbar">
			<!-- Divider -->
			<hr class="d-lg-none w-100 my-2" />

			<b-navbar-nav class="align-items-lg-center ml-auto">
				<!--
				<b-nav-item-dropdown no-caret :right="true" class="navbar-notifications mr-lg-3">
					<template slot="button-content">
						<i class="ion ion-md-notifications-outline navbar-icon align-middle"></i>
						<span class="badge badge-primary badge-dot indicator"></span>
						<span class="d-lg-none align-middle">&nbsp; Notifications</span>
					</template>

					<div class="bg-primary text-center text-white font-weight-bold p-3">4 New Notifications</div>
					<b-list-group flush>
						<b-list-group-item href="javascript:void(0)" class="media d-flex align-items-center">
							<div class="ui-icon ui-icon-sm ion ion-md-home bg-secondary border-0 text-white"></div>
							<div class="media-body line-height-condenced ml-3">
								<div class="text-dark">Login from 192.168.1.1</div>
								<div class="text-light small mt-1">Aliquam ex eros, imperdiet vulputate hendrerit et.</div>
								<div class="text-light small mt-1">12h ago</div>
							</div>
						</b-list-group-item>
					</b-list-group>

					<a href="javascript:void(0)" class="d-block text-center text-light small p-2 my-1">Show all notifications</a>
				</b-nav-item-dropdown>

				<b-nav-item-dropdown no-caret :right="true" class="navbar-messages mr-lg-3">
					<template slot="button-content">
						<i class="ion ion-ios-mail navbar-icon align-middle"></i>
						<span class="badge badge-primary badge-dot indicator"></span>
						<span class="d-lg-none align-middle">&nbsp; Messages</span>
					</template>

					<div class="bg-primary text-center text-white font-weight-bold p-3">4 New Messages</div>
					<b-list-group flush>
						<b-list-group-item href="javascript:void(0)" class="media d-flex align-items-center">
							<img :src="`${publicUrl}img/avatars/6-small.png`" class="d-block ui-w-40 rounded-circle" alt />
							<div class="media-body ml-3">
								<div class="text-dark line-height-condenced">Sit meis deleniti eu, pri vidit meliore docendi ut.</div>
								<div class="text-light small mt-1">Mae Gibson &nbsp;·&nbsp; 58m ago</div>
							</div>
						</b-list-group-item>
					</b-list-group>

					<a href="javascript:void(0)" class="d-block text-center text-light small p-2 my-1">Show all messages</a>
				</b-nav-item-dropdown>

				<div class="nav-item d-none d-lg-block text-big font-weight-light line-height-1 opacity-25 mr-3 ml-1">|</div>
				-->
				<b-nav-item-dropdown :right="true" class="navbar-user">
					<template slot="button-content">
						<span class="d-inline-flex flex-lg-row-reverse align-items-center align-middle">
							<img :src="`${publicUrl}img/user.png`" alt class="d-block ui-w-30 rounded-circle" />
							<span class="px-1 mr-lg-2 ml-2 ml-lg-0">{{ user.firstName }} {{ user.lastName }}</span>
						</span>
					</template>

					<b-dd-item> <i class="ion ion-ios-person text-lightest"></i> &nbsp; My profile </b-dd-item>
					<b-dd-item> <i class="ion ion-ios-mail text-lightest"></i> &nbsp; Messages </b-dd-item>
					<b-dd-item @click="$router.push({ name: 'account-settings' })"> <i class="ion ion-md-settings text-lightest"></i> &nbsp; Account settings </b-dd-item>
					<b-dd-divider />
					<b-dd-item @click="$store.dispatch('auth/logout')"> <i class="ion ion-ios-log-out text-danger"></i> &nbsp; Log Out </b-dd-item>
				</b-nav-item-dropdown>
			</b-navbar-nav>
		</b-collapse>
	</b-navbar>
</template>

<script>
export default {
	name: "app-layout-navbar",

	data() {
		return {
			user: JSON.parse(localStorage.getItem("user"))
		};
	},

	props: {
		sidenavToggle: {
			type: Boolean,
			default: true
		}
	},

	methods: {
		toggleSidenav() {
			this.layoutHelpers.toggleCollapsed();
		},

		getLayoutNavbarBg() {
			return this.layoutNavbarBg;
		}
	}
};
</script>

<style>
.navbar-messages .dropdown-toggle,
.navbar-notifications .dropdown-toggle,
.navbar-user .dropdown-toggle,
.navbar-messages.b-nav-dropdown .nav-link,
.navbar-notifications.b-nav-dropdown .nav-link,
.navbar-user.b-nav-dropdown .nav-link {
	white-space: nowrap;
}

.navbar-messages .dropdown-menu,
.navbar-notifications .dropdown-menu {
	overflow: hidden;
	padding: 0;
}

@media (min-width: 992px) {
	.navbar-messages .dropdown-menu,
	.navbar-notifications .dropdown-menu {
		margin-top: 0.5rem;
		width: 22rem;
	}

	.navbar-user .dropdown-menu {
		margin-top: 0.25rem;
	}
}
</style>
