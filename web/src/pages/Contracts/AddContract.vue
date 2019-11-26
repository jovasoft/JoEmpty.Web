<template>
	<div>
		<h4 class="font-weight-bold py-3 mb-3"><span class="text-muted font-weight-light">Sözleşmeler /</span> Sözleşme Ekle</h4>
		<hr class="container-m-nx border-light mt-0 mb-3" />
		<b-card header="Sözleşme Bilgileri" header-tag="h6" class="mb-3">
			<b-form class="mb-1">
				<b-form-row>
					<b-form-group label="Müşteri" class="col-md-6">
						<b-select :options="['XX', 'XX']" />
					</b-form-group>
					<b-form-group label="Sözleşme Kodu" class="col-md-6">
						<b-input placeholder="Sözleşme Kodu" />
					</b-form-group>
				</b-form-row>
				<b-form-row>
					<b-form-group label="Başlangıç Tarihi" class="col-md-6">
						<datepicker v-model="startDate" :disabledDates="startDisabledDates" :language="tr" :bootstrapStyling="true" :monday-first="true" :full-month-name="true" placeholder="Başlangıç Tarihi" :calendar-button="true" calendar-button-icon="ion ion-md-calendar" :clear-button="true" />
					</b-form-group>
					<b-form-group label="Bitiş Tarihi" class="col-md-6">
						<datepicker v-model="endDate" :disabledDates="endDisabledDates" :language="tr" :bootstrapStyling="true" :monday-first="true" :full-month-name="true" placeholder="Bitiş Tarihi" :calendar-button="true" calendar-button-icon="ion ion-md-calendar" :clear-button="true" />
					</b-form-group>
				</b-form-row>
				<b-form-row>
					<b-form-group label="Tutar" class="col-md-6">
						<masked-input placeholder="Tutar" type="text" class="form-control" :mask="priceMask" />
					</b-form-group>
					<b-form-group label="Para Birimi" class="col-md-6">
						<b-select value="TL" :options="['TL', 'Dolar', 'Euro']" />
					</b-form-group>
				</b-form-row>
				<b-form-row>
					<b-form-group label="Sarf Malzeme" class="col-md-6">
						<b-select value="Dahil" :options="['Dahil', 'Hariç']" />
					</b-form-group>
					<b-form-group label="Tesis Sayısı" class="col-md-6">
						<b-input maxLength="3" placeholder="Tesis Sayısı" type="text" class="form-control" />
					</b-form-group>
				</b-form-row>
				<b-form-group label="Dosyalar">
					<vue-dropzone id="my-dropzone" :options="dropzoneOptions" ref="dropzoneInstance" />
				</b-form-group>

				<b-btn class="btn-flat float-right" type="submit" variant="primary">Sözleşme Ekle</b-btn>
			</b-form>
		</b-card>
	</div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-dropzone/vue-dropzone.scss" lang="scss"></style>

<script>
import MaskedInput from "vue-text-mask";
import * as textMaskAddons from "text-mask-addons/dist/textMaskAddons";
import Datepicker from "vuejs-datepicker";
import { tr } from "vuejs-datepicker/dist/locale";
import vue2Dropzone from "vue2-dropzone";

export default {
	name: "contracts-add",
	metaInfo: {
		title: "Sözleşme Ekle"
	},
	components: {
		vueDropzone: vue2Dropzone,
		Datepicker,
		MaskedInput
	},
	watch: {
		startDate(newValue) {
			this.endDisabledDates = {
				to: new Date(newValue)
			};
			if (!newValue) this.endDate = "";
			else {
				var newDate = new Date(newValue.getTime());
				this.endDate = newDate.setFullYear(newDate.getFullYear() + 2);
			}
		}
	},
	data: () => ({
		startDisabledDates: {
			to: new Date(2010, 1, 1)
		},
		endDisabledDates: {},
		startDate: "",
		endDate: "",
		tr: tr,
		priceMask: textMaskAddons.createNumberMask({
			prefix: ""
		}),
		dropzoneOptions: {
			url: "/upload",
			parallelUploads: 2,
			maxFilesize: 50000,
			filesizeBase: 1000,
			addRemoveLinks: true,
			dictDefaultMessage: `Dosya yüklemek için tıklayın`,
			previewTemplate: `
<div class="dz-preview dz-file-preview">
  <div class="dz-details">
    <div class="dz-thumbnail">
      <img data-dz-thumbnail>
      <span class="dz-nopreview">No preview</span>
      <div class="dz-success-mark"></div>
      <div class="dz-error-mark"></div>
      <div class="dz-error-message"><span data-dz-errormessage></span></div>
      <div class="progress"><div class="progress-bar progress-bar-primary" role="progressbar" aria-valuemin="0" aria-valuemax="100" data-dz-uploadprogress></div></div>
    </div>
    <div class="dz-filename" data-dz-name></div>
    <div class="dz-size" data-dz-size></div>
  </div>
</div>`
		}
	})
};
</script>
