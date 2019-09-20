<template>
	<div>
		<h4 class="font-weight-bold py-3 mb-4">Account settings</h4>

		<b-card no-body class="overflow-hidden">
			<div class="row no-gutters row-bordered row-border-light">
				<div class="col-md-3 pt-0">
					<b-list-group class="account-settings-links" flush>
						<b-list-group-item button :active="curTab === 'general'" @click="curTab = 'general'">General</b-list-group-item>
						<b-list-group-item button :active="curTab === 'password'" @click="curTab = 'password'">Change password</b-list-group-item>
						<b-list-group-item button :active="curTab === 'notifications'" @click="curTab = 'notifications'">Notifications</b-list-group-item>
					</b-list-group>
				</div>

				<div class="col-md-9" v-if="curTab === 'general'">
					<b-card-body>
						<b-form-group label="First name">
							<b-input v-model="accountData.firstName" />
						</b-form-group>

						<b-form-group label="Last name">
							<b-input v-model="accountData.lastName" />
						</b-form-group>

						<b-form-group label="Phone number">
							<masked-input type="text" class="form-control" placeholder="Phone" :mask="phoneMask" v-model="accountData.phone" />
						</b-form-group>

						<b-form-group label="Email">
							<b-input v-model="accountData.email" />
							<b-alert variant="warning" show class="mt-3 mb-0" v-if="!accountData.verified">
								Your email is not confirmed. Please check your inbox.
								<br />
								<a href="javascript:void(0)">Resend confirmation</a>
							</b-alert>
						</b-form-group>
					</b-card-body>
				</div>

				<div class="col-md-9" v-if="curTab === 'password'">
					<b-card-body class="pb-2">
						<b-form-group label="Current password">
							<b-input type="password" />
						</b-form-group>

						<b-form-group label="New password">
							<b-input type="password" />
						</b-form-group>

						<b-form-group label="Repeat new password">
							<b-input type="password" />
						</b-form-group>
					</b-card-body>
				</div>

				<div class="col-md-9" v-if="curTab === 'notifications'">
					<b-card-body class="pb-2">
						<h6 class="mb-4">Activity</h6>

						<b-form-group>
							<label class="switcher">
								<input type="checkbox" class="switcher-input" v-model="accountData.notifications.comments" />
								<span class="switcher-indicator">
									<span class="switcher-yes"></span>
									<span class="switcher-no"></span>
								</span>
								<span class="switcher-label">Email me when someone comments on my article</span>
							</label>
						</b-form-group>

						<b-form-group>
							<label class="switcher">
								<input type="checkbox" class="switcher-input" v-model="accountData.notifications.forum" />
								<span class="switcher-indicator">
									<span class="switcher-yes"></span>
									<span class="switcher-no"></span>
								</span>
								<span class="switcher-label">Email me when someone answers on my forum thread</span>
							</label>
						</b-form-group>

						<b-form-group>
							<label class="switcher">
								<input type="checkbox" class="switcher-input" v-model="accountData.notifications.followings" />
								<span class="switcher-indicator">
									<span class="switcher-yes"></span>
									<span class="switcher-no"></span>
								</span>
								<span class="switcher-label">Email me when someone follows me</span>
							</label>
						</b-form-group>
					</b-card-body>
					<hr class="border-light m-0" />
					<b-card-body class="pb-2">
						<h6 class="mb-4">Application</h6>

						<b-form-group>
							<label class="switcher">
								<input type="checkbox" class="switcher-input" v-model="accountData.notifications.news" />
								<span class="switcher-indicator">
									<span class="switcher-yes"></span>
									<span class="switcher-no"></span>
								</span>
								<span class="switcher-label">News and announcements</span>
							</label>
						</b-form-group>

						<b-form-group>
							<label class="switcher">
								<input type="checkbox" class="switcher-input" v-model="accountData.notifications.products" />
								<span class="switcher-indicator">
									<span class="switcher-yes"></span>
									<span class="switcher-no"></span>
								</span>
								<span class="switcher-label">Weekly product updates</span>
							</label>
						</b-form-group>

						<b-form-group>
							<label class="switcher">
								<input type="checkbox" class="switcher-input" v-model="accountData.notifications.blog" />
								<span class="switcher-indicator">
									<span class="switcher-yes"></span>
									<span class="switcher-no"></span>
								</span>
								<span class="switcher-label">Weekly blog digest</span>
							</label>
						</b-form-group>
					</b-card-body>
				</div>
			</div>
		</b-card>

		<div class="text-right mt-3">
			<b-btn variant="primary">Save changes</b-btn>&nbsp;
			<b-btn variant="default">Cancel</b-btn>
		</div>
	</div>
</template>

<script>
import MaskedInput from "vue-text-mask";

export default {
	name: "pages-account-settings",
	metaInfo: {
		title: "Account Settings"
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
			verified: false,

			notifications: {
				comments: true,
				forum: true,
				followings: false,
				news: true,
				products: false,
				blog: true
			}
		}
	})
};
</script>

<style src="@/vendor/styles/pages/account.scss" lang="scss"></style>
