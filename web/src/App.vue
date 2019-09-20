<template>
	<div id="app">
		<router-view />
	</div>
</template>

<style src="@/vendor/styles/bootstrap.scss" lang="scss"></style>
<style src="@/vendor/styles/appwork.scss" lang="scss"></style>
<style src="@/vendor/styles/theme-cotton.scss" lang="scss"></style>
<style src="@/vendor/styles/colors.scss" lang="scss"></style>
<style src="@/vendor/styles/uikit.scss" lang="scss"></style>
<style src="./style.scss" lang="scss"></style>
<script>
export default {
	name: "app",
	metaInfo: {
		title: "JOVASOFT",
		titleTemplate: "%s - JoEmpty"
	},
	updated() {
		// Remove loading state
		setTimeout(() => document.body.classList.remove("app-loading"), 1);
	}
};
</script>
