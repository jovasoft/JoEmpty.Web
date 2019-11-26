<template>
	<div>
		<h4 class="font-weight-bold py-3 mb-3"><span class="text-muted font-weight-light">Tesisler /</span> Tesis Ekle</h4>
		<hr class="container-m-nx border-light mt-0 mb-3" />
		<b-card header="Tesis Bilgileri" header-tag="h6" class="mb-3">
			<b-form @submit.prevent="addFacility" class="mb-1">
				<b-form-row>
					<b-form-group label="Müşteri" class="col-md-4">
						<b-select v-model="client" @blur="$v.client.$touch()">
							<option value="" disabled>Müşteri seçiniz</option>
							<option v-for="(c, index) in clients" :value="index" :key="c"> {{ c.name }} </option>
						</b-select>
						<template v-if="$v.client.$error">
							<small v-if="!$v.client.required" class="form-text text-danger">Müşteri boş geçilemez.</small>
						</template>
					</b-form-group>
					<b-form-group label="Sözleşme" class="col-md-4">
						<b-select v-model="contract" @blur="$v.contract.$touch()">
							<option value="" disabled>Sözleşme seçiniz</option>
							<option v-for="(c, index) in clientContracts" :value="index" :key="c"> {{ c.name }} </option>
						</b-select>
						<template v-if="$v.contract.$error">
							<small v-if="!$v.contract.required" class="form-text text-danger">Sözleşme boş geçilemez.</small>
						</template>
					</b-form-group>
					<b-form-group label="Tesis Kodu" class="col-md-4">
						<b-input v-model="facilityCode" @blur="$v.facilityCode.$touch()" placeholder="Tesis Kodu" />
						<template v-if="$v.facilityCode.$error">
							<small v-if="!$v.facilityCode.required" class="form-text text-danger">Tesis kodu boş geçilemez.</small>
						</template>
					</b-form-group>
				</b-form-row>
				<b-form-group label="Tesis Adı">
					<b-input v-model="facilityName" @blur="$v.facilityName.$touch()" placeholder="Tesis Adı" />
					<template v-if="$v.facilityName.$error">
						<small v-if="!$v.facilityName.required" class="form-text text-danger">Tesis adı boş geçilemez.</small>
					</template>
				</b-form-group>
				<b-form-group label="Adres">
					<b-input v-model="address" @blur="$v.address.$touch()" placeholder="Cadde/Mahalle" />
					<template v-if="$v.address.$error">
						<small v-if="!$v.address.required" class="form-text text-danger">Adres boş geçilemez.</small>
					</template>
				</b-form-group>
				<b-form-row>
					<b-form-group label="İl" class="col-md-4">
						<b-select v-model="province" @blur="$v.province.$touch()">
							<option value="" disabled>İl seçiniz</option>
							<option v-for="(p, index) in provinces" :value="p" :key="index">{{ index }}</option>
						</b-select>
						<template v-if="$v.province.$error">
							<small v-if="!$v.province.required" class="form-text text-danger">İl boş geçilemez.</small>
						</template>
					</b-form-group>
					<b-form-group label="İlçe" class="col-md-4">
						<b-select v-model="district" @blur="$v.district.$touch()" :disabled="!province">
							<option value="" disabled>İlçe seçiniz</option>
							<option v-for="(d, index) in province" :key="index">{{ d }}</option>
						</b-select>
						<template v-if="$v.district.$error">
							<small v-if="!$v.district.required" class="form-text text-danger">İlçe boş geçilemez.</small>
						</template>
					</b-form-group>
					<b-form-group label="Bölge" class="col-md-4">
						<b-select v-model="area" @blur="$v.area.$touch()">
							<option value="" disabled>Bölge seçiniz</option>
							<option v-for="(a, index) in areas" :key="index" :value="a"> {{ a.name }} </option>
						</b-select>
						<template v-if="$v.area.$error">
							<small v-if="!$v.area.required" class="form-text text-danger">Bölge boş geçilemez.</small>
						</template>
					</b-form-group>
				</b-form-row>
				<b-form-row>
					<b-form-group label="Tesis Tipi" class="col-md-4">
						<b-select v-model="facilityType" @blur="$v.facilityType.$touch()">
							<option value="" disabled>Tesis tipi seçiniz</option>
							<option>MR</option>
							<option>MRL</option>
							<option>Hydraulic</option>
							<option>MW</option>
							<option>ESC</option>
						</b-select>
						<template v-if="$v.facilityType.$error">
							<small v-if="!$v.facilityType.required" class="form-text text-danger">Tesis tipi boş geçilemez.</small>
						</template>
					</b-form-group>
					<b-form-group label="Marka" class="col-md-4">
						<b-input v-model="brand" placeholder="Marka" />
					</b-form-group>
					<b-form-group label="Garanti Bitiş Tarihi" class="col-md-4">
						<datepicker v-model="warrantyDate" @blur="$v.warrantyDate.$touch()" :language="tr" :bootstrapStyling="true" :monday-first="true" :full-month-name="true" placeholder="Garanti Bitiş Tarihi" :calendar-button="true" calendar-button-icon="ion ion-md-calendar" :clear-button="true" />
						<template v-if="$v.warrantyDate.$error">
							<small v-if="!$v.warrantyDate.required" class="form-text text-danger">Garanti bitiş tarihi boş geçilemez.</small>
						</template>
					</b-form-group>
				</b-form-row>
				<b-form-row>
					<b-form-group label="Durak Sayısı" class="col-md-4">
						<b-input v-model="stationCount" @blur="$v.stationCount.$touch()" @keypress="onlyNumber" placeholder="Durak Sayısı" />
						<template v-if="$v.stationCount.$error">
							<small v-if="!$v.stationCount.required" class="form-text text-danger">Durak sayısı boş geçilemez.</small>
						</template>
					</b-form-group>
					<b-form-group label="Hız (m/s)" class="col-md-4">
						<b-input v-model="speed" @blur="$v.speed.$touch()" @keypress="onlyNumber" placeholder="Hız (m/s)" />
						<template v-if="$v.speed.$error">
							<small v-if="!$v.speed.required" class="form-text text-danger">Hız boş geçilemez.</small>
						</template>
					</b-form-group>
					<b-form-group label="Kapasite (kg)" class="col-md-4">
						<b-input v-model="capacity" @blur="$v.capacity.$touch()" @keypress="onlyNumber" placeholder="Kapasite (kg)" />
						<template v-if="$v.capacity.$error">
							<small v-if="!$v.capacity.required" class="form-text text-danger">Kapasite boş geçilemez.</small>
						</template>
					</b-form-group>
				</b-form-row>
				<b-form-row>
					<b-form-group label="Bakım Durumu" class="col-md-3">
						<b-select v-model="maintenanceStatus" @blur="$v.maintenanceStatus.$touch()">
							<option value="" disabled>Bakım durumunu seçiniz</option>
							<option>Aktif</option>
							<option>Pasif</option>
						</b-select>
						<template v-if="$v.maintenanceStatus.$error">
							<small v-if="!$v.maintenanceStatus.required" class="form-text text-danger">Bakım durumu boş geçilemez.</small>
						</template>
					</b-form-group>
					<b-form-group label="Eski Bakım Ücreti" class="col-md-3">
						<masked-input v-model="oldMaintenanceFee" @blur="$v.oldMaintenanceFee.$touch()" placeholder="Eski Bakım Ücreti" type="text" class="form-control" :mask="priceMask" />
						<template v-if="$v.oldMaintenanceFee.$error">
							<small v-if="!$v.oldMaintenanceFee.required" class="form-text text-danger">Eski bakım ücreti boş geçilemez.</small>
						</template>
					</b-form-group>
					<b-form-group label="Güncel Bakım Ücreti" class="col-md-3">
						<masked-input v-model="currentMaintenanceFee" @blur="$v.currentMaintenanceFee.$touch()" placeholder="Güncel Bakım Ücreti" type="text" class="form-control" :mask="priceMask" />
						<template v-if="$v.currentMaintenanceFee.$error">
							<small v-if="!$v.currentMaintenanceFee.required" class="form-text text-danger">Güncel bakım ücreti boş geçilemez.</small>
						</template>
					</b-form-group>
					<b-form-group label="Arıza Ücreti" class="col-md-3">
						<masked-input v-model="breakdownFee" @blur="$v.breakdownFee.$touch()" placeholder="Arıza Ücreti" type="text" class="form-control" :mask="priceMask" />
						<template v-if="$v.breakdownFee.$error">
							<small v-if="!$v.breakdownFee.required" class="form-text text-danger">Arıza ücreti boş geçilemez.</small>
						</template>
					</b-form-group>
				</b-form-row>
				<b-form-group>
					<b-btn class="btn-flat float-right" type="submit" variant="primary">Sözleşme Ekle</b-btn>
					<b-btn class="btn-flat float-right mr-2" @click="clearForm" variant="secondary">Temizle</b-btn>
				</b-form-group>
			</b-form>
		</b-card>
	</div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import Datepicker from "vuejs-datepicker";
import { tr } from "vuejs-datepicker/dist/locale";
import MaskedInput from "vue-text-mask";
import * as textMaskAddons from "text-mask-addons/dist/textMaskAddons";
import { required } from "vuelidate/lib/validators/";

export default {
	name: "facilities-add",
	metaInfo: {
		title: "Tesis Ekle"
	},
	components: {
		Datepicker,
		MaskedInput
	},
	validations: {
		client: { required },
		contract: { required },
		facilityCode: { required },
		facilityName: { required },
		address: { required },
		province: { required },
		district: { required },
		area: { required },
		facilityType: { required },
		warrantyDate: { required },
		stationCount: { required },
		speed: { required },
		capacity: { required },
		maintenanceStatus: { required },
		oldMaintenanceFee: { required },
		currentMaintenanceFee: { required },
		breakdownFee: { required }
	},
	methods: {
		addFacility: async function() {
			this.$v.$touch();
		},
		onlyNumber: function($event) {
			let keyCode = $event.keyCode;
			if (keyCode < 48 || keyCode > 57) {
				$event.preventDefault();
			}
		},
		clearForm: function() {
			this.$v.$reset();
			this.client = "";
			this.contract = "";
			this.facilityCode = "";
			this.facilityName = "";
			this.address = "";
			this.province = "";
			this.district = "";
			this.area = "";
			this.facilityType = "";
			this.brand = "";
			this.warrantyDate = "";
			this.stationCount = "";
			this.speed = "";
			this.capacity = "";
			this.maintenanceStatus = "";
			this.oldMaintenanceFee = "";
			this.currentMaintenanceFee = "";
			this.breakdownFee = "";
		}
	},
	data: () => ({
		clients: [],
		clientContracts: [],
		areas: [],
		provinces: [],
		client: "",
		contract: "",
		facilityCode: "",
		facilityName: "",
		address: "",
		province: "",
		district: "",
		area: "",
		facilityType: "",
		brand: "",
		warrantyDate: "",
		stationCount: "",
		speed: "",
		capacity: "",
		maintenanceStatus: "",
		oldMaintenanceFee: "",
		currentMaintenanceFee: "",
		breakdownFee: "",
		tr: tr,
		priceMask: textMaskAddons.createNumberMask({
			prefix: "",
			suffix: " ₺"
		})
	}),
	created() {
		const req = new XMLHttpRequest();
		req.open("GET", `${this.publicUrl}json/locations.json`);
		req.onload = () => {
			this.provinces = JSON.parse(req.response);
		};
		req.send();
	},
	watch: {
		province() {
			this.district = "";
		}
	}
};
</script>
