<template>
	<div>
		<h4 class="font-weight-bold py-3 mb-3"><span class="text-muted font-weight-light">Sözleşmeler /</span> Sözleşme Ekle</h4>

		<hr class="container-m-nx border-light mt-0 mb-3" />
		<b-card header="Sözleşme Bilgileri" header-tag="h6" class="mb-3">
			<b-form class="mb-1">
				<b-form-row>
					<b-form-group label="Sözleşme Kodu" class="col-md-3">
						<b-input placeholder="Sözleşme Kodu" />
					</b-form-group>
				</b-form-row>
				<b-form-row>
					<b-form-group label="Başlangıç Tarihi" class="col-md-4">
						<datepicker :language="tr" :bootstrapStyling="true" :monday-first="true" :full-month-name="true" placeholder="Başlangıç Tarihi" :calendar-button="true" calendar-button-icon="ion ion-md-calendar" :clear-button="true" />
					</b-form-group>
					<b-form-group label="Bitiş Tarihi" class="col-md-4">
						<datepicker :language="tr" :bootstrapStyling="true" :monday-first="true" :full-month-name="true" placeholder="Bitiş Tarihi" :calendar-button="true" calendar-button-icon="ion ion-md-calendar" :clear-button="true" />
					</b-form-group>
				</b-form-row>
				<b-form-row>
					<b-form-group label="Tutar" class="col-md-3">
						<masked-input placeholder="Tutar" type="text" class="form-control" :mask="numberMask" />
					</b-form-group>
					<b-form-group label="Para Birimi" class="col-md-3">
						<b-select value="TL" :options="['TL', 'Dolar', 'Euro']" />
					</b-form-group>
				</b-form-row>
				<b-form-row>
					<b-form-group label="Sarf Malzeme" class="col-md-3">
						<b-select value="Dahil" :options="['Dahil', 'Hariç']" />
					</b-form-group>
					<b-form-group label="Tesis Sayısı" class="col-md-3">
						<masked-input placeholder="Tesis Sayısı" type="text" class="form-control" :mask="numberMask" />
					</b-form-group>
				</b-form-row>
				<b-btn class="btn-flat" type="submit" variant="primary">Sözleşme Ekle</b-btn>
			</b-form>
		</b-card>
	</div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import MaskedInput from "vue-text-mask";
import * as textMaskAddons from "text-mask-addons/dist/textMaskAddons";
import Datepicker from "vuejs-datepicker";
import { en, tr } from "vuejs-datepicker/dist/locale";

export default {
	name: "contracts-add",
	metaInfo: {
		title: "Sözleşme Ekle"
	},
	components: {
		Datepicker,
		MaskedInput
	},
	data: () => ({
		en: en,
		tr: tr,
		numberMask: textMaskAddons.createNumberMask({
			prefix: ""
		})
	})
};
</script>
