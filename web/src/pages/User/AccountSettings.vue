<template>
	<div>
		<h4 class="font-weight-bold py-3 mb-4">Account settings</h4>

		<b-card no-body class="overflow-hidden">
			<div class="row no-gutters row-bordered row-border-light">
				<div class="col-md-3 pt-0">
					<b-list-group class="account-settings-links" flush>
						<b-list-group-item button :active="curTab === 'general'" @click="curTab = 'general'">General</b-list-group-item>
						<b-list-group-item button :active="curTab === 'password'" @click="curTab = 'password'">Change password</b-list-group-item>
					</b-list-group>
				</div>

				<div class="col-md-9" v-if="curTab === 'general'">
					<form @submit.prevent="updateUser">
						<b-card-body>
							<b-form-group label="First name">
								<b-input maxlength="20" v-model="accountData.firstName" @blur="$v.accountData.firstName.$touch()" />
								<template v-if="$v.accountData.firstName.$error">
									<small v-if="!$v.accountData.firstName.required" class="form-text text-danger">Please enter your first name.</small>
									<small v-if="!$v.accountData.firstName.minLength || !$v.accountData.firstName.validName" class="form-text text-danger">Your name must be at least 3 characters and only contain letters.</small>
								</template>
							</b-form-group>

							<b-form-group label="Last name">
								<b-input maxlength="20" v-model="accountData.lastName" @blur="$v.accountData.lastName.$touch()" />
								<template v-if="$v.accountData.lastName.$error">
									<small v-if="!$v.accountData.lastName.required" class="form-text text-danger">Please enter your last name.</small>
									<small v-if="!$v.accountData.lastName.minLength || !$v.accountData.lastName.validLastname" class="form-text text-danger">Your name must be at least 3 characters and only contain letters.</small>
								</template>
							</b-form-group>

							<b-form-group label="Phone number">
								<masked-input disabled type="text" class="form-control" placeholder="Phone" :mask="phoneMask" v-model="accountData.phone" />
							</b-form-group>

							<b-form-group label="Email">
								<b-input v-model="accountData.email" disabled />
								<b-alert variant="warning" show class="mt-3 mb-0" v-if="!accountData.verified">
									Your email is not confirmed. Please check your inbox.
									<br />
									<a href="javascript:void(0)">Resend confirmation</a>
								</b-alert>
							</b-form-group>
							<div class="text-right mt-3">
								<b-btn type="submit" variant="primary" :disabled="$v.accountData.$invalid">Save changes</b-btn>
							</div>
						</b-card-body>
					</form>
				</div>

				<div class="col-md-9" v-if="curTab === 'password'">
					<form @submit.prevent="updatePassword">
						<b-card-body class="pb-2">
							<b-form-group label="Current password">
								<b-input maxlength="32" type="password" v-model="password.currentPassword" @blur="$v.password.currentPassword.$touch()" />
							</b-form-group>

							<b-form-group label="New password">
								<b-input maxlength="32" type="password" v-model="password.newPassword" @blur="$v.password.newPassword.$touch()" />
								<template>
									<small v-if="$v.password.newPassword.$error" class="form-text text-danger">Your password must be 6-32 characters long, contain letters and numbers.</small>
									<small v-else class="form-text text-muted">Your password must be 6-32 characters long, contain letters and numbers.</small>
								</template>
							</b-form-group>

							<b-form-group label="Repeat new password">
								<b-input maxlength="32" type="password" v-model="password.newPasswordRepeat" @blur="$v.password.newPasswordRepeat.$touch()" />
								<template>
									<small v-if="$v.password.newPasswordRepeat.$error" class="form-text text-danger">The passwords must match each other.</small>
									<small v-else class="form-text text-muted">The passwords must match each other.</small>
								</template>
							</b-form-group>
							<div class="text-right mt-3">
								<b-btn type="submit" variant="primary" :disabled="$v.password.$invalid">Save changes</b-btn>
							</div>
						</b-card-body>
					</form>
				</div>
			</div>
		</b-card>
	</div>
</template>

<script>
import MaskedInput from "vue-text-mask";
import { mapGetters } from "vuex";
import { required, minLength, sameAs } from "vuelidate/lib/validators/";

export default {
	metaInfo: {
		title: "Account Settings"
	},
	validations: {
		accountData: {
			firstName: {
				required,
				validFirstName: firstName => {
					return /^[a-zA-ZğüçışöĞÜÇİŞÖ]+(?: [a-zA-ZğüçışöĞÜÇİŞÖ]+)*$/.test(firstName);
				},
				minLength: minLength(3)
			},
			lastName: {
				required,
				validLastName: lastName => {
					return /^[a-zA-ZğüçışöĞÜÇİŞÖ]+(?: [a-zA-ZğüçışöĞÜÇİŞÖ]+)*$/.test(lastName);
				},
				minLength: minLength(3)
			}
		},
		password: {
			currentPassword: {
				required
			},
			newPassword: {
				required,
				validNewPassword: newPassword => {
					return /^((?=.*?[a-z])(?=.*?[0-9])).{6,32}$/.test(newPassword);
				}
			},
			newPasswordRepeat: {
				required,
				SameAsPassword: sameAs("newPassword")
			}
		}
	},
	components: {
		MaskedInput
	},
	data: () => ({
		curTab: "general",
		phoneMask: ["(", /[1-9]/, /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/],
		accountData: {
			firstName: JSON.parse(localStorage.getItem("user")).firstName,
			lastName: JSON.parse(localStorage.getItem("user")).lastName,
			email: JSON.parse(localStorage.getItem("user")).mail,
			phone: "",
			verified: false
		},
		password: {
			currentPassword: "",
			newPassword: "",
			newPasswordRepeat: ""
		}
	}),
	computed: {
		...mapGetters({
			updateError: "user/updateError"
		})
	},
	methods: {
		updateUser: async function() {
			this.$v.accountData.$touch();
			if (!this.$v.accountData.$invalid) {
				const isSuccess = await this.$store.dispatch("user/updateUser", {
					firstname: this.accountData.firstName,
					lastname: this.accountData.lastName
				});
				if (isSuccess) {
					this.$notify({
						group: "app",
						type: "success",
						title: "SUCCESS",
						text: "Account settings updated.",
						ignoreDuplicates: true
					});
				} else {
					this.$notify({
						group: "app",
						type: "error",
						title: "ERROR",
						text: this.updateError,
						ignoreDuplicates: true
					});
				}
			}
		},
		updatePassword: async function() {
			this.$v.password.$touch();
			if (!this.$v.password.$invalid) {
				const isSuccess = await this.$store.dispatch("user/updatePassword", {
					oldpassword: this.password.currentPassword,
					newpassword: this.password.newPassword
				});
				if (isSuccess) {
					this.$notify({
						group: "app",
						type: "success",
						title: "SUCCESS",
						text: "Password successfully changed.",
						ignoreDuplicates: true
					});
				} else {
					this.$notify({
						group: "app",
						type: "error",
						title: "ERROR",
						text: this.updateError,
						ignoreDuplicates: true
					});
				}
			}
		}
	}
};
</script>

<style src="@/vendor/styles/pages/account.scss" lang="scss"></style>
