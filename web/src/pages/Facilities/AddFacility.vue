<template>
	<div>
		<loading :active.sync="isLoading" color="#e84c64" :can-cancel="false" :is-full-page="false"></loading>
		<h4 class="font-weight-bold py-3 mb-3"><span class="text-muted font-weight-light">Tesisler /</span> {{ pageTitle }}</h4>
		<hr class="container-m-nx border-light mt-0 mb-3" />
		<b-card header="Tesis Bilgileri" header-tag="h6" class="mb-3">
			<b-form class="mb-1" @submit.prevent="addFacility">
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
						<b-select v-model="areaId" @blur="$v.areaId.$touch()">
							<option value="" disabled>Bölge seçiniz</option>
							<option value="0cdf0c96-3269-40e7-a92e-3b33994c93be">Bölge</option>
							<option v-for="(a, index) in areas" :value="a.id" :key="index"> {{ a.name }} </option>
						</b-select>
						<template v-if="$v.areaId.$error">
							<small v-if="!$v.areaId.required" class="form-text text-danger">Bölge boş geçilemez.</small>
						</template>
					</b-form-group>
				</b-form-row>
				<b-form-row>
					<b-form-group label="Tesis Tipi" class="col-md-4">
						<b-select v-model="facilityType" @blur="$v.facilityType.$touch()">
							<option value="" disabled>Tesis tipi seçiniz</option>
							<option value="MR">MR (Makine Daireli)</option>
							<option value="MRL">MRL (Makine Dairesiz)</option>
							<option value="Hydraulic">Hidrolik</option>
							<option value="MW">MW (Yürüyen Bant)</option>
							<option value="ESC">ESC (Yürüyen Merdiven)</option>
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
						<b-input v-model="speed" :disabled="!isElevator" @blur="$v.speed.$touch()" @keypress="onlyFloatingNumber" placeholder="Hız (m/s)" />
						<template v-if="$v.speed.$error">
							<small v-if="!$v.speed.required || isElevator" class="form-text text-danger">Hız boş geçilemez.</small>
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
					<b-btn class="btn-flat float-right" type="submit" variant="primary">{{ buttonTitle }}</b-btn>
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
import "vue-loading-overlay/dist/vue-loading.css";
import { tr } from "vuejs-datepicker/dist/locale";
import { required, requiredIf } from "vuelidate/lib/validators/";
import { mapGetters } from "vuex";
import Loading from "vue-loading-overlay";
import Datepicker from "vuejs-datepicker";

export default {
	name: "facilities-add",
	metaInfo: {
		title: "Tesis Ekle"
	},
	props: ["clientId", "contractId", "facilityId"],
	components: {
		Datepicker,
		Loading
	},
	data: () => ({
		isLoading: false,
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
		areaId: "",
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
		areaId: { required },
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
			})
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
			clientStatus: "client/status",
			contractErrorMessage: "contract/errorMessage",
			contractErrorCode: "contract/errorCode",
			contractResponse: "contract/response",
			contractStatus: "contract/status",
			facilityErrorMessage: "facility/errorMessage",
			facilityErrorCode: "facility/errorCode",
			facilityResponse: "facility/response",
			facilityStatus: "facility/status"
		})
	},
	async created() {
		this.getLocations();
		await this.getClients();
		if (this.clientId) this.contractClientId = this.clientId;
		if (this.facilityId) {
			this.facilityEditMode = true;
			this.pageTitle = "Tesis Düzenle";
			this.buttonTitle = "Kaydet";
			this.getFacility(this.facilityId);
		}
	},
	watch: {
		facilityContractId(contractId) {
			this.clientContracts.forEach(contract => {
				if (contract.id == contractId) {
					this.currentMaintenanceFee = contract.amount;
				}
			});
		},
		contractClientId(clientId) {
			if (clientId != "") {
				this.getContractsByClient(clientId);
				this.fillAddress(clientId);
			}
		},
		facilityType(type) {
			if (type == "MW") this.isElevator = false;
			else if (type == "ESC") this.isElevator = false;
			else if (type == "MR") this.isElevator = true;
			else if (type == "MRL") this.isElevator = true;
			else this.isElevator = true;
		},
		clientStatus(status) {
			if (status == "loading") this.isLoading = true;
			else this.isLoading = false;
		},
		contractStatus(status) {
			if (status == "loading") this.isLoading = true;
			else this.isLoading = false;
		},
		facilityStatus(status) {
			if (status == "loading") this.isLoading = true;
			else this.isLoading = false;
		}
	},
	methods: {
		async addFacility() {
			this.$v.$touch();
			if (!this.$v.$invalid) {
				if (!this.facilityEditMode) {
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
				} else {
					await this.$store.dispatch("facility/Update", {
						id: this.facilityId,
						facility: {
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
						}
					});
				}
				if (this.facilityResponse != null) {
					if (this.facilityResponse.data.success) {
						if (!this.facilityEditMode) this.notify("success", "Başarılı", this.facilityCode + " numaralı tesis başarıyla eklendi.");
						else {
							this.notify("success", "Başarılı", "Tesis başarıyla güncellendi.");
							await this.sleep(1000);
							this.$router.push({ name: "listFacilities", params: { clientId: this.contractClientId, contractId: this.facilityContractId } });
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
				if (this.contractResponse.data.success) {
					this.clientContracts = this.contractResponse.data.data;
					if (this.contractId) this.facilityContractId = this.contractId;
				} else {
					this.notify("error", "Hata", this.contractResponse.data.message);
					this.clientContracts = [];
				}
			} else {
				if (this.contractErrorCode != 404) this.notify("error", "Hata", this.contractErrorMessage);
				this.clientContracts = [];
			}
		},
		async getFacility(facilityId) {
			await this.$store.dispatch("facility/GetOne", facilityId);
			if (this.facilityResponse != null) {
				if (this.facilityResponse.data.success) {
					this.fillForms(this.facilityResponse.data.data);
				} else this.notify("error", "Hata", this.facilityResponse.data.message);
			} else this.notify("error", "Hata", this.facilityErrorMessage);
		},
		fillAddress(clientId) {
			this.clients.forEach(client => {
				if (client.id == clientId) {
					this.address = client.address;
					this.province = client.province;
					this.district = client.district;
				}
			});
		},
		fillForms(facility) {
			this.contractClientId = facility.clientId;
			this.facilityContractId = facility.contractId;
			this.facilityCode = facility.code;
			this.facilityName = facility.name;
			this.address = facility.address;
			this.province = facility.province;
			this.district = facility.district;
			this.areaId = facility.areaId;
			if (facility.type == 1) this.facilityType = "MR";
			else if (facility.type == 2) this.facilityType = "MRL";
			else if (facility.type == 3) this.facilityType = "Hydraulic";
			else if (facility.type == 4) this.facilityType = "DumbWaiter";
			else if (facility.type == 5) this.facilityType = "MW";
			else this.facilityType = "ESC";
			this.brand = facility.brand;
			this.warrantyDate = facility.warrantyFinishDate;
			if (facility.type == 1 || facility.type == 2 || facility.type == 3 || facility.type == 4) {
				this.stationCount = facility.station;
				this.speed = facility.speed;
				this.capacity = facility.capacity;
			}
			if (facility.maintenanceStatus == 1) this.maintenanceStatus = "Active";
			else this.maintenanceStatus = "Passive";
			this.oldMaintenanceFee = facility.oldMaintenanceFee;
			this.currentMaintenanceFee = facility.currentMaintenanceFee;
			this.breakdownFee = facility.breakdownFee;
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
			if ((keyCode < 48 || keyCode > 57) && keyCode !== 13) $event.preventDefault();
		},
		onlyFloatingNumber($event) {
			let keyCode = $event.keyCode;
			if ((keyCode < 48 || keyCode > 57) && keyCode !== 13 && keyCode !== 44) $event.preventDefault();
		},
		clearForm() {
			this.$v.$reset();
			(this.contractClientId = ""), (this.facilityContractId = ""), (this.facilityCode = "");
			this.facilityName = "";
			this.address = "";
			this.province = "";
			this.district = "";
			this.areaId = "";
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
			if (this.$refs.successModal.is_open && !this.isModalClosing) {
				this.$router.push({ name: "listFacilities", params: { clientId: this.contractClientId, contractId: this.facilityContractId } });
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
