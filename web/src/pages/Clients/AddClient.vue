<template>
	<div>
		<h4 class="font-weight-bold py-3 mb-3"><span class="text-muted font-weight-light">Müşteriler /</span> Müşteri Ekle</h4>

		<hr class="container-m-nx border-light mt-0 mb-3" />

		<form-wizard class="form-wizard-vertical-left mb-5">
			<template slot="step" slot-scope="props">
				<wizard-step :tab="props.tab" @click.native="props.navigateToTab(props.index)" @keyup.enter.native="props.navigateToTab(props.index)" :transition="props.transition" :index="props.index">
					<span slot="title" :class="{ 'text-danger': props.tab.validationError }" v-html="props.tab.title"></span>
				</wizard-step>
			</template>

			<tab-content icon="ion ion-ios-information-circle" title="Müşteri Bilgileri">
				<b-card header="Müşteri Bilgileri" header-tag="h6" class="mb-3">
					<b-form>
						<b-form-row>
							<b-form-group label="Cari Kod" class="col-md-3">
								<b-input placeholder="Cari Kod" />
							</b-form-group>
						</b-form-row>
						<b-form-group label="Ünvan">
							<b-input placeholder="Ünvan" />
						</b-form-group>
						<b-form-group label="Adres">
							<b-input placeholder="Cadde/Mahalle" />
						</b-form-group>
						<b-form-row>
							<b-form-group label="İl" class="col-md-4">
								<b-select v-model="il">
									<option value="" disabled>İl seçiniz</option>
									<option v-for="(i, index) in iller" :value="i" :key="index">{{ index }}</option>
								</b-select>
							</b-form-group>
							<b-form-group label="İlçe" class="col-md-4">
								<b-select v-model="ilce" :disabled="!il">
									<option value="" disabled>İlçe seçiniz</option>
									<option v-for="(t, index) in il" :key="index">{{ t }}</option>
								</b-select>
							</b-form-group>
							<b-form-group label="Posta Kodu" class="col-md-4">
								<b-input placeholder="Posta Kodu" />
							</b-form-group>
						</b-form-row>
						<b-form-group label="Notlar">
							<b-textarea placeholder="Notlar" :rows="4" :max-rows="6" />
						</b-form-group>
					</b-form>
				</b-card>
			</tab-content>

			<tab-content icon="ion ion-md-person" title="Yetkililer">
				<b-card header="Yetkililer" header-tag="h6" class="mb-3">
					<b-form class="mb-3">
						<b-form-row>
							<b-form-group label="Ad" class="col-md-4">
								<b-input placeholder="Ad" />
							</b-form-group>
							<b-form-group label="Soyad" class="col-md-4">
								<b-input placeholder="Soyad" />
							</b-form-group>
						</b-form-row>
						<b-form-group label="Ünvan">
							<b-input placeholder="Ünvan" />
						</b-form-group>
						<b-form-group label="Departman">
							<b-input placeholder="Departman" />
						</b-form-group>
						<b-form-row>
							<b-form-group label="Sabit Telefon" class="col-md-4">
								<masked-input type="text" class="form-control" placeholder="Sabit Telefon" :mask="phoneMask" />
							</b-form-group>
							<b-form-group label="Cep Telefonu" class="col-md-4">
								<masked-input type="text" class="form-control" placeholder="Cep Telefonu" :mask="phoneMask" />
							</b-form-group>
							<b-form-group label="E-Posta" class="col-md-4">
								<masked-input type="text" class="form-control" placeholder="E-Posta" :mask="emailMask" />
							</b-form-group>
						</b-form-row>
						<div v-if="isEdit">
							<b-btn class="btn btn-block" type="submit" variant="primary">Yetkiliyi Güncelle</b-btn>
							<b-btn class="btn btn-block" @click.prevent="closeEditing()" variant="secondary">İptal</b-btn>
						</div>
						<b-btn class="btn-block" v-if="!isEdit" type="submit" variant="primary">Yetkili Ekle</b-btn>
					</b-form>
					<v-client-table :data="tableData" :columns="columns" :options="options">
						<template slot="düzenle" slot-scope="props">
							<div>
								<b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="edit(props.row)"><i class="ion ion-md-create"></i></b-btn>
								<b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="remove(props.row)"><i class="ion ion-md-close"></i></b-btn>
							</div>
						</template>
					</v-client-table>
				</b-card>
			</tab-content>

			<!-- Buttons -->
			<b-btn variant="default" slot="prev">Geri</b-btn>
			<b-btn variant="default" slot="next">İleri</b-btn>
			<b-btn variant="primary" slot="finish">Tamamla</b-btn>
		</form-wizard>
	</div>
</template>

<style src="@/vendor/libs/vue-form-wizard/vue-form-wizard.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-data-tables/vue-data-tables.scss" lang="scss"></style>

<script>
import * as textMaskAddons from "text-mask-addons/dist/textMaskAddons";
import MaskedInput from "vue-text-mask";
import { FormWizard, TabContent, WizardStep } from "vue-form-wizard";
import { ClientTable } from "vue-tables-2";
import Vue from "vue";

Vue.use(ClientTable);

export default {
	name: "clients-add",
	metaInfo: {
		title: "Müşteri Ekle"
	},
	components: {
		FormWizard,
		TabContent,
		WizardStep,
		MaskedInput
	},
	data: () => ({
		emailMask: textMaskAddons.emailMask,
		phoneMask: ["(", /[1-9]/, /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/],
		isEdit: false,
		iller: [],
		il: "",
		ilce: "",
		tableData: [],
		columns: ["Ad", "Soyad", "Ünvan", "Departman", "Sabit Telefon", "Cep Telefonu", "E-Posta", "düzenle"],
		options: {
			filterable: false,
			perPage: 10,
			perPageValues: [],
			pagination: { chunk: 0 },
			showChildRowToggler: false,
			sortIcon: {
				is: "fa-sort",
				base: "fas",
				up: "fa-sort-up",
				down: "fa-sort-down"
			},
			texts: {
				count: "{count} kayıttan {from} ile {to} arasındakiler gösteriliyor|{count} records|One record",
				first: "İlk",
				last: "Son",
				page: "Sayfa:",
				noResults: "Eşleşen kayıt bulunamadı",
				loading: "Yükleniyor..."
			}
		}
	}),
	created() {
		// Fetch json data
		const req = new XMLHttpRequest();
		req.open("GET", `${this.publicUrl}json/locations.json`);

		req.onload = () => {
			this.iller = JSON.parse(req.response);
		};
		req.send();
	},
	watch: {
		il() {
			this.ilce = "";
		}
	},
	methods: {
		edit() {
			this.isEdit = !this.isEdit;
		},
		remove() {},
		closeEditing() {
			this.isEdit = !this.isEdit;
		}
	}
};
</script>
