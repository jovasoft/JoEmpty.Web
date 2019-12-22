<template>
	<b-card no-body>
		<loading :active.sync="isLoading" color="#e84c64" :can-cancel="false" :is-full-page="false"></loading>
		<!-- Modal -->
		<b-modal id="modals-default" size="medium" hide-footer="true">
			<div slot="modal-title">
				JOVASOFT
				<span class="font-weight-light">SOFTWARE END USER LICENSE AGREEMENT</span>
				<br />
				<small class="text-muted">By registering, you agree to our terms of service and privacy policy.</small>
			</div>
			<perfect-scrollbar style="height: 500px">
				<div class="eula" style="padding: 1em">
					<p style="text-align: center;">
						<span style="font-family: 'Arial',sans-serif;">JOVASOFT</span>
					</p>
					<p style="text-align: center;">
						<span style="font-family: 'Arial',sans-serif;">SOFTWARE END USER LICENSE AGREEMENT</span>
					</p>
					<p style="text-align: center;">
						<span style="font-family: 'Arial',sans-serif;">&nbsp;</span>
					</p>
					<p style="text-align: justify; text-justify: inter-ideograph;">
						<span style="font-family: 'Arial',sans-serif;">This End User License Agreement (&ldquo;License&rdquo;) is an agreement between you and Electronic Arts Inc., its subsidiaries and affiliates (&ldquo;EA&rdquo;).&nbsp; This License governs your use of this software product and all related documentation, and updates and upgrades that replace or supplement the software in any respect and which are not distributed with a separate license (collectively, the "</span>
					</p>
					<p style="text-align: justify; text-justify: inter-ideograph;">
						<span style="font-family: 'Arial',sans-serif;">&nbsp;</span>
					</p>
					<p style="text-align: justify; text-justify: inter-ideograph;">
						<span style="font-family: 'Arial',sans-serif;">
							By installing or using the Software, you agree to the terms of this License and agree to be bound by it.&nbsp; Section 2 below describes the data EA may use to provide services and support to you in connection with the Software.&nbsp; If you do not agree to this use of data, do not install or use the Software. Section 15, below, provides that any disputes must be resolved by binding arbitration on an individual basis.&nbsp; IF YOU INSTALL the Software, the terms and conditions of
							this License are fully accepted by you. If you do not agree to the terms of this License, then do not install or use the Software.
						</span>
					</p>
					<p style="text-align: justify; text-justify: inter-ideograph;">
						<span style="font-family: 'Arial',sans-serif;">&nbsp;</span>
					</p>
					<p>
						<strong>
							<span style="font-family: 'Arial',sans-serif;">Right to Return (Applicable To Those Who Purchased Packaged Software From Physical Retail Stores In the United States)</span>
						</strong>
						<span style="font-family: 'Arial',sans-serif;">
							.&nbsp; If you do not agree to the terms of this License or the Origin Software Application License and you have not fully installed or used the Software, you may return the Software for a refund or exchange within thirty (30) days from the date of purchase to the original place of purchase by following the instructions for return available at http://warrantyinfo.ea.com
							<strong>
								<em>.</em>
							</strong>
						</span>
						<span style="font-family: 'Arial',sans-serif;">
							.&nbsp; If you do not agree to the terms of this License or the Origin Software Application License and you have not fully installed or used the Software, you may return the Software for a refund or exchange within thirty (30) days from the date of purchase to the original place of purchase by following the instructions for return available at http://warrantyinfo.ea.com
							<strong>
								<em>.</em>
							</strong>
						</span>
					</p>
				</div>
			</perfect-scrollbar>
		</b-modal>
		<!-- / Modal -->

		<div class="p-4 px-sm-5 pt-sm-5">
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

			<h5 class="text-center text-muted font-weight-normal mb-4">Create an Account</h5>

			<!-- Form -->
			<form @submit.prevent="register">
				<b-form-group label="Your name">
					<b-input maxlength="20" v-model="name" @blur="$v.name.$touch()" />
					<template v-if="$v.name.$error">
						<small v-if="!$v.name.required" class="form-text text-danger">Please enter your first name.</small>
						<small v-if="!$v.name.minLength || !$v.name.validLastname" class="form-text text-danger">Your first name must be at least 3 characters and only contain letters.</small>
					</template>
				</b-form-group>
				<b-form-group label="Your last name">
					<b-input maxlength="20" v-model="lastname" @blur="$v.lastname.$touch()" />
					<template v-if="$v.lastname.$error">
						<small v-if="!$v.lastname.required" class="form-text text-danger">Please enter your last name.</small>
						<small v-if="!$v.lastname.minLength || !$v.lastname.validLastname" class="form-text text-danger">Your last name must be at least 3 characters and only contain letters.</small>
					</template>
				</b-form-group>
				<b-form-group label="Your email">
					<b-input v-model="email" @blur="$v.email.$touch()" />
					<template v-if="$v.email.$error">
						<small v-if="!$v.email.required" class="form-text text-danger">Please enter a email address.</small>
						<small v-if="!$v.email.email" class="form-text text-danger">Please enter a valid email address.</small>
					</template>
				</b-form-group>
				<b-form-group label="Password">
					<b-input maxlength="32" type="password" v-model="password" @blur="$v.password.$touch()" />
					<template>
						<small v-if="$v.password.$error" class="form-text text-danger">Your password must be 6-32 characters long, contain letters and numbers.</small>
						<small v-else class="form-text text-muted">Your password must be 6-32 characters long, contain letters and numbers.</small>
					</template>
				</b-form-group>
				<b-btn type="submit" variant="primary" :block="true" :disabled="$v.$invalid" class="mt-4">Sign Up</b-btn>
				<div class="text-light small mt-4">
					By clicking "Sign Up", you agree to our
					<a tabindex="-1" v-b-modal.modals-default>terms of service and privacy policy</a>. We’ll occasionally send you account related emails.
				</div>
			</form>
			<!-- / Form -->
		</div>
		<b-card-footer class="py-3 px-4 px-sm-5">
			<div class="text-center text-muted">
				Already have an account?
				<router-link tabindex="-1" :to="{ name: 'login' }">Sign In</router-link>
			</div>
		</b-card-footer>
	</b-card>
</template>

<script>
import { required, email, minLength } from "vuelidate/lib/validators/";
import { mapGetters } from "vuex";
import PerfectScrollbar from "@/vendor/libs/perfect-scrollbar/PerfectScrollbar";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
	metaInfo: {
		title: "Register"
	},
	data: () => ({
		isLoading: false,
		name: "",
		lastname: "",
		email: "",
		password: ""
	}),
	components: {
		Loading,
		PerfectScrollbar
	},
	computed: {
		...mapGetters({
			authenticating: "auth/authenticating",
			authenticationError: "auth/authenticationError",
			authenticationErrorCode: "auth/authenticationErrorCode"
		})
	},
	watch: {
		authenticating(authStatus) {
			if (authStatus == true) this.isLoading = true;
			else this.isLoading = false;
		}
	},
	methods: {
		register: async function() {
			this.$v.$touch();
			if (!this.$v.$invalid) {
				const isSuccess = await this.$store.dispatch("auth/register", {
					firstname: this.name,
					lastname: this.lastname,
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
	},
	validations: {
		email: {
			required,
			email
		},
		name: {
			required,
			validName: name => {
				return /^[a-zA-ZğüçışöĞÜÇİŞÖ]+(?: [a-zA-ZğüçışöĞÜÇİŞÖ]+)*$/.test(name);
			},
			minLength: minLength(3)
		},
		lastname: {
			required,
			validLastname: lastname => {
				return /^[a-zA-ZğüçışöĞÜÇİŞÖ]+(?: [a-zA-ZğüçışöĞÜÇİŞÖ]+)*$/.test(lastname);
			},
			minLength: minLength(3)
		},
		password: {
			required,
			validPassword: password => {
				return /^((?=.*?[a-z])(?=.*?[0-9])).{6,32}$/.test(password);
			}
		}
	}
};
</script>
