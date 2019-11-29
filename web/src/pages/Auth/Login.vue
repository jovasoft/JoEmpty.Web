<template>
	<b-card no-body>
		<div class="p-4 p-sm-5">
			<!-- Logo -->
			<div class="d-flex justify-content-center align-items-center pb-2 mb-4">
				<div class="ui-w-60">
					<div class="w-100 position-relative" style="padding-bottom: 54%">
						<svg class="w-100 h-100 position-absolute" viewBox="0 0 148 80" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
							<defs>
								<linearGradient id="a" x1="46.49" x2="62.46" y1="53.39" y2="48.2" gradientUnits="userSpaceOnUse">
									<stop stop-opacity=".25" offset="0"></stop>
									<stop stop-opacity=".1" offset=".3"></stop>
									<stop stop-opacity="0" offset=".9"></stop>
								</linearGradient>
								<linearGradient id="e" x1="76.9" x2="92.64" y1="26.38" y2="31.49" xlink:href="#a"></linearGradient>
								<linearGradient id="d" x1="107.12" x2="122.74" y1="53.41" y2="48.33" xlink:href="#a"></linearGradient>
							</defs>
							<path class="fill-primary" transform="translate(-.1)" d="M121.36,0,104.42,45.08,88.71,3.28A5.09,5.09,0,0,0,83.93,0H64.27A5.09,5.09,0,0,0,59.5,3.28L43.79,45.08,26.85,0H.1L29.43,76.74A5.09,5.09,0,0,0,34.19,80H53.39a5.09,5.09,0,0,0,4.77-3.26L74.1,35l16,41.74A5.09,5.09,0,0,0,94.82,80h18.95a5.09,5.09,0,0,0,4.76-3.24L148.1,0Z"></path>
							<path transform="translate(-.1)" d="M52.19,22.73l-8.4,22.35L56.51,78.94a5,5,0,0,0,1.64-2.19l7.34-19.2Z" fill="url(#a)"></path>
							<path transform="translate(-.1)" d="M95.73,22l-7-18.69a5,5,0,0,0-1.64-2.21L74.1,35l8.33,21.79Z" fill="url(#e)"></path>
							<path transform="translate(-.1)" d="M112.73,23l-8.31,22.12,12.66,33.7a5,5,0,0,0,1.45-2l7.3-18.93Z" fill="url(#d)"></path>
						</svg>
					</div>
				</div>
			</div>
			<!-- / Logo -->

			<h5 class="text-center text-muted font-weight-normal mb-4">Login to Your Account</h5>

			<!-- Form -->
			<form @submit.prevent="login">
				<b-form-group label="Email">
					<b-input v-model="email" @blur="$v.email.$touch()" />
					<template v-if="$v.email.$error">
						<small v-if="!$v.email.required" class="form-text text-danger">Please enter a email address.</small>
						<small v-if="!$v.email.email" class="form-text text-danger">Please enter a valid email address.</small>
					</template>
				</b-form-group>

				<b-form-group>
					<div slot="label" class="d-flex justify-content-between align-items-end">
						<div>Password</div>
						<router-link tabindex="-1" class="d-block small" :to="{ name: 'forgot-password' }">Forgot password?</router-link>
					</div>
					<b-input type="password" v-model="password" @blur="$v.password.$touch()" />
					<template v-if="$v.password.$error">
						<small v-if="!$v.password.required" class="form-text text-danger">Please enter a password.</small>
					</template>
				</b-form-group>
				<b-btn type="submit" variant="primary" class="mt-4" :block="true" :disabled="$v.$invalid">Sign In</b-btn>
			</form>
			<!-- / Form -->
		</div>
		<b-card-footer class="py-3 px-4 px-sm-5">
			<div class="text-center text-muted">
				Don't have an account yet?
				<router-link tabindex="-1" :to="{ name: 'register' }">Sign Up</router-link>
			</div>
		</b-card-footer>
	</b-card>
</template>

<script>
import { required, email } from "vuelidate/lib/validators/";
import { mapGetters } from "vuex";
export default {
	metaInfo: {
		title: "Giriş"
	},
	data: () => ({
		email: "",
		password: ""
	}),
	validations: {
		email: {
			required,
			email
		},
		password: {
			required
		}
	},
	computed: {
		...mapGetters({
			authenticationError: "auth/authenticationError"
		})
	},
	methods: {
		login: async function() {
			this.$v.$touch();
			if (!this.$v.$invalid) {
				const isSuccess = await this.$store.dispatch("auth/login", {
					mail: this.email,
					password: this.password
				});
				if (!isSuccess) {
					this.$notify({
						group: "auth",
						type: "error",
						title: "ERROR",
						text: this.authenticationError,
						ignoreDuplicates: true
					});
				}
			}
		}
	}
};
</script>
