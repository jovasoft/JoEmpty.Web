<template>
	<div class="authentication-wrapper authentication-2 ui-bg-cover ui-bg-overlay-container px-4" :style="`background-image: url('${publicUrl}img/bg/auth-background.jpg');`">
		<div class="ui-bg-overlay bg-dark opacity-25"></div>
		<div class="authentication-inner py-5">
			<notifications group="auth" position="bottom right" />
			<router-view />
		</div>
	</div>
</template>

<style src="@/vendor/styles/pages/authentication.scss" lang="scss"></style>
