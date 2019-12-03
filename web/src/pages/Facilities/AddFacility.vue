<template>
	<div>
		<h4 class="font-weight-bold py-3 mb-3"><span class="text-muted font-weight-light">Tesisler /</span> Tesis Ekle</h4>
		<hr class="container-m-nx border-light mt-0 mb-3" />
		<b-card header="Tesis Bilgileri" header-tag="h6" class="mb-3">
			<b-form class="mb-1">
				<b-form-row>
					<b-form-group label="Müşteri" class="col-md-4">
						<b-select v-model="contractClientId" :disabled="facilityEditMode" @blur="$v.client.$touch()">
							<option value="" disabled>Müşteri seçiniz</option>
							<option v-for="(c, index) in clients" :value="c.id" :key="index"> {{ c.title }} </option>
						</b-select>
						<template v-if="$v.contractClientId.$error">
							<small v-if="!$v.contractClientId.required" class="form-text text-danger">Müşteri boş geçilemez.</small>
						</template>
					</b-form-group>
					<b-form-group label="Sözleşme" class="col-md-4">
						<b-select v-model="facilityContractId" :disabled="facilityEditMode" @blur="$v.contract.$touch()">
							<option value="" disabled>Sözleşme seçiniz</option>
							<option v-for="(c, index) in clientContracts" :value="c.id" :key="index"> {{ c.code }} </option>
						</b-select>
						<template v-if="$v.facilityContractId.$error">
							<small v-if="!$v.facilityContractId.required" class="form-text text-danger">Sözleşme boş geçilemez.</small>
						</template>
					</b-form-group>
					<b-form-group label="Tesis Kodu" class="col-md-4">
						<b-input v-model="facilityCode" @blur="$v.facilityCode.$touch()" placeholder="Tesis Kodu" />
						<template v-if="$v.facilityCode.$error">
							<small v-if="!$v.facilityCode.required || !$v.facilityCode.validFacilityCode" class="form-text text-danger">Tesis kodu boş geçilemez.</small>
						</template>
					</b-form-group>
				</b-form-row>
				<b-form-group label="Tesis Adı">
					<b-input v-model="facilityName" @blur="$v.facilityName.$touch()" placeholder="Tesis Adı" />
					<template v-if="$v.facilityName.$error">
						<small v-if="!$v.facilityName.required || !$v.facilityName.validFacilityName" class="form-text text-danger">Tesis adı boş geçilemez.</small>
					</template>
				</b-form-group>
				<b-form-group label="Adres">
					<b-input v-model="address" @blur="$v.address.$touch()" placeholder="Cadde/Mahalle" />
					<template v-if="$v.address.$error">
						<small v-if="!$v.address.required || !$v.address.validAddress" class="form-text text-danger">Adres boş geçilemez.</small>
					</template>
				</b-form-group>
				<b-form-row>
					<b-form-group label="İl" class="col-md-4">
						<b-select v-model="province" @blur="$v.province.$touch()">
							<option value="" disabled>İl seçiniz</option>
							<option v-for="(p, index) in provinces" :value="index" :key="index">{{ index }}</option>
						</b-select>
						<template v-if="$v.province.$error">
							<small v-if="!$v.province.required" class="form-text text-danger">İl boş geçilemez.</small>
						</template>
					</b-form-group>
					<b-form-group label="İlçe" class="col-md-4">
						<b-select v-model="district" @blur="$v.district.$touch()" :disabled="!province">
							<option value="" disabled>İlçe seçiniz</option>
							<option v-for="(d, index) in provinces[province]" :key="index">{{ d }}</option>
						</b-select>
						<template v-if="$v.district.$error">
							<small v-if="!$v.district.required" class="form-text text-danger">İlçe boş geçilemez.</small>
						</template>
					</b-form-group>
					<b-form-group label="Bölge" class="col-md-4">
						<b-select v-model="area" @blur="$v.area.$touch()">
							<option value="" disabled>Bölge seçiniz</option>
							<option value="0cdf0c96-3269-40e7-a92e-3b33994c93be">Bölge</option>
							<option v-for="(a, index) in areas" :value="a.id" :key="index"> {{ a.name }} </option>
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
						<b-input v-model="stationCount" :disabled="!isElevator" @blur="$v.stationCount.$touch()" @keypress="onlyNumber" placeholder="Durak Sayısı" />
						<template v-if="$v.stationCount.$error">
							<small v-if="!$v.stationCount.required || (!$v.stationCount.validStationCount && isElevator)" class="form-text text-danger">Durak sayısı boş geçilemez.</small>
						</template>
					</b-form-group>
					<b-form-group label="Hız (m/s)" class="col-md-4">
						<b-input v-model="speed" :disabled="!isElevator" @blur="$v.speed.$touch()" @keypress="onlyNumber" placeholder="Hız (m/s)" />
						<template v-if="$v.speed.$error">
							<small v-if="!$v.speed.required || (!$v.speed.validSpeed && isElevator)" class="form-text text-danger">Hız boş geçilemez.</small>
						</template>
					</b-form-group>
					<b-form-group label="Kapasite (kg)" class="col-md-4">
						<b-input v-model="capacity" :disabled="!isElevator" @blur="$v.capacity.$touch()" @keypress="onlyNumber" placeholder="Kapasite (kg)" />
						<template v-if="$v.capacity.$error">
							<small v-if="!$v.capacity.required || (!$v.capacity.validCapacity && isElevator)" class="form-text text-danger">Kapasite boş geçilemez.</small>
						</template>
					</b-form-group>
				</b-form-row>
				<b-form-row>
					<b-form-group label="Bakım Durumu" class="col-md-3">
						<b-select v-model="maintenanceStatus" @blur="$v.maintenanceStatus.$touch()">
							<option value="" disabled>Bakım durumunu seçiniz</option>
							<option value="Active">Aktif</option>
							<option value="Passive">Pasif</option>
						</b-select>
						<template v-if="$v.maintenanceStatus.$error">
							<small v-if="!$v.maintenanceStatus.required" class="form-text text-danger">Bakım durumu boş geçilemez.</small>
						</template>
					</b-form-group>
					<b-form-group label="Eski Bakım Ücreti" class="col-md-3">
						<b-input-group append="₺">
							<b-input v-model="oldMaintenanceFee" @keypress="onlyNumber" @blur="$v.oldMaintenanceFee.$touch()" placeholder="Eski Bakım Ücreti" />
						</b-input-group>
						<template v-if="$v.oldMaintenanceFee.$error">
							<small v-if="!$v.oldMaintenanceFee.required || !$v.oldMaintenanceFee.validOldMaintenanceFee" class="form-text text-danger">Eski bakım ücreti boş geçilemez.</small>
						</template>
					</b-form-group>
					<b-form-group label="Güncel Bakım Ücreti" class="col-md-3">
						<b-input-group append="₺">
							<b-input v-model="currentMaintenanceFee" @keypress="onlyNumber" @blur="$v.currentMaintenanceFee.$touch()" placeholder="Güncel Bakım Ücreti" />
						</b-input-group>
						<template v-if="$v.currentMaintenanceFee.$error">
							<small v-if="!$v.currentMaintenanceFee.required || !$v.currentMaintenanceFee.validCurrentMaintenanceFee" class="form-text text-danger">Güncel bakım ücreti boş geçilemez.</small>
						</template>
					</b-form-group>
					<b-form-group label="Arıza Ücreti" class="col-md-3">
						<b-input-group append="₺">
							<b-input v-model="breakdownFee" @blur="$v.breakdownFee.$touch()" @keypress="onlyNumber" placeholder="Arıza Ücreti" />
						</b-input-group>
						<template v-if="$v.breakdownFee.$error">
							<small v-if="!$v.breakdownFee.required || !$v.breakdownFee.validBreakdownFee" class="form-text text-danger">Arıza ücreti boş geçilemez.</small>
						</template>
					</b-form-group>
				</b-form-row>
				<b-form-group>
					<b-btn class="btn-flat float-right" @click="addFacility" variant="primary">{{ buttonTitle }}</b-btn>
					<b-btn class="btn-flat float-right mr-2" @click="clearForm" variant="secondary">Temizle</b-btn>
				</b-form-group>
			</b-form>
		</b-card>
		<sweet-modal v-on:close="modalClosing" ref="successModal" icon="success" :hide-close-button="true">
			<h4 class="font-weight-bold">Tesis Başarıyla Eklendi.</h4>
			<div>
				<small style="cursor: pointer;" v-on:click="refreshPage">Yeni bir tesis eklemek için <span class="font-weight-bold">buraya</span> tıklayınız.</small>
			</div>
		</sweet-modal>
	</div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import Datepicker from "vuejs-datepicker";
import { tr } from "vuejs-datepicker/dist/locale";
import { required, requiredIf } from "vuelidate/lib/validators/";
import { mapGetters } from "vuex";

export default {
	name: "facilities-add",
	metaInfo: {
		title: "Tesis Ekle"
	},
	props: ["clientId", "contractId", "facilityId"],
	components: {
		Datepicker
	},
	data: () => ({
		isElevator: true,
		facilityEditMode: false,
		isModalClosing: false,
		pageTitle: "Tesis Ekle",
		buttonTitle: "Tesis Ekle",
		clients: [],
		clientContracts: [],
		areas: [],
		provinces: [],
		contractClientId: "",
		facilityContractId: "",
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
		tr: tr
	}),
	validations: {
		contractClientId: { required },
		facilityContractId: { required },
		facilityCode: {
			required,
			validFacilityCode: facilityCode => {
				return /^(?!\s*$).+/.test(facilityCode);
			}
		},
		facilityName: {
			required,
			validFacilityName: facilityName => {
				return /^(?!\s*$).+/.test(facilityName);
			}
		},
		address: {
			required,
			validAddres: address => {
				return /^(?!\s*$).+/.test(address);
			}
		},
		province: { required },
		district: { required },
		area: { required },
		facilityType: { required },
		warrantyDate: { required },
		stationCount: {
			required: requiredIf(function() {
				return this.isElevator;
			}),
			validStationCount: function(stationCount) {
				return /^\d+$/.test(stationCount) || !this.isElevator;
			}
		},
		speed: {
			required: requiredIf(function() {
				return this.isElevator;
			}),
			validSpeed: function(speed) {
				return /^\d+$/.test(speed) || !this.isElevator;
			}
		},
		capacity: {
			required: requiredIf(function() {
				return this.isElevator;
			}),
			validCapacity: function(capacity) {
				return /^\d+$/.test(capacity) || !this.isElevator;
			}
		},
		maintenanceStatus: { required },
		oldMaintenanceFee: {
			required,
			validOldMaintenanceFee: oldMaintenanceFee => {
				return /^\d+$/.test(oldMaintenanceFee);
			}
		},
		currentMaintenanceFee: {
			required,
			validCurrentMaintenanceFee: currentMaintenanceFee => {
				return /^\d+$/.test(currentMaintenanceFee);
			}
		},
		breakdownFee: {
			required,
			validBreakdownFee: breakdownFee => {
				return /^\d+$/.test(breakdownFee);
			}
		}
	},
	computed: {
		...mapGetters({
			clientErrorMessage: "client/errorMessage",
			clientErrorCode: "client/errorCode",
			clientResponse: "client/response",
			contractErrorMessage: "contract/errorMessage",
			contractErrorCode: "contract/errorCode",
			contractResponse: "contract/response",
			facilityErrorMessage: "facility/errorMessage",
			facilityErrorCode: "facility/errorCode",
			facilityResponse: "facility/response"
		})
	},
	async created() {
		this.getLocations();
		await this.getClients();
		if (this.clientId && this.contractId) {
			this.contractClientId = this.clientId;
			this.facilityContractId = this.contractId;
		}
	},
	watch: {
		contractClientId(clientId) {
			this.getContractsByClient(clientId);
		},
		facilityType(type) {
			if (type == "MW") this.isElevator = false;
			else if (type == "ESC") this.isElevator = false;
			else if (type == "MR") this.isElevator = true;
			else if (type == "MRL") this.isElevator = true;
			else this.isElevator = true;
		}
	},
	methods: {
		async addFacility() {
			this.$v.$touch();
			if (!this.$v.$invalid) {
				await this.$store.dispatch("facility/Add", {
					clientId: this.contractClientId,
					contractId: this.facilityContractId,
					code: this.facilityCode,
					name: this.facilityName,
					address: this.address,
					province: this.province,
					district: this.district,
					areaId: this.areaId,
					type: this.facilityType,
					brand: this.brand,
					warrantyFinishDate: this.warrantyDate,
					station: this.stationCount,
					speed: this.speed,
					capacity: this.capacity,
					maintenanceStatus: this.maintenanceStatus,
					oldMaintenanceFee: this.oldMaintenanceFee,
					currentMaintenanceFee: this.currentMaintenanceFee,
					breakdownFee: this.breakdownFee
				});
				if (this.facilityResponse != null) {
					if (this.facilityResponse.data.success) {
						if (!this.contractEditMode) this.showModal();
						else {
							this.notify("success", "Başarılı", "Tesis başarıyla güncellendi.");
							await this.sleep(1000);
							this.$router.push({ name: "listFacilities", params: { contractsClientId: this.contractClientId, facilityContractId: this.facilityContractId } });
						}
					} else this.notify("error", "Hata", this.facilityResponse.data.message);
				} else this.notify("error", "Hata", this.facilityErrorMessage);
			}
		},
		async getClients() {
			await this.$store.dispatch("client/Get");
			if (this.clientResponse != null) {
				if (this.clientResponse.data.success) this.clients = this.clientResponse.data.data;
				else this.notify("error", "Hata", this.clientResponse.data.message);
			} else this.notify("error", "Hata", this.clientErrorMessage);
		},
		async getContractsByClient(clientId) {
			await this.$store.dispatch("contract/GetContractsByClient", clientId);
			if (this.contractResponse != null) {
				if (this.contractResponse.data.success) this.clientContracts = this.contractResponse.data.data;
				else {
					this.notify("error", "Hata", this.contractResponse.data.message);
					this.clientContracts = [];
				}
			} else {
				if (this.contractErrorCode != 404) this.notify("error", "Hata", this.contractErrorMessage);
				this.clientContracts = [];
			}
		},
		getLocations() {
			const req = new XMLHttpRequest();
			req.open("GET", `${this.publicUrl}json/locations.json`);
			req.onload = () => {
				this.provinces = JSON.parse(req.response);
			};
			req.send();
		},
		onlyNumber($event) {
			let keyCode = $event.keyCode;
			if (keyCode < 48 || keyCode > 57) $event.preventDefault();
		},
		clearForm() {
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
		},
		notify(type, title, text) {
			this.$notify({
				group: "app",
				type: type,
				title: title,
				text: text,
				ignoreDuplicates: true,
				duration: 5000
			});
		},
		showModal() {
			this.$refs.successModal.open();
		},
		modalClosing() {
			if (!this.isModalClosing) {
				this.$router.push({ name: "listFacilities", params: { contractsClientId: this.contractClientId, facilityContractId: this.facilityContractId } });
			}
		},
		refreshPage() {
			this.isModalClosing = true;
			this.$refs.successModal.close();
			this.$router.go(0);
		},
		sleep(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		}
	}
};
</script>
