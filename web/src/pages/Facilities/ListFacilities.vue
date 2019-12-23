<template>
	<div class="row">
		<!-- Title -->
		<div class="col-md-12">
			<h4 class="font-weight-bold py-3 mb-3"><span class="text-muted font-weight-light">Tesisler /</span> Tesis Listesi</h4>
			<hr class="container-m-nx border-light mt-0 mb-3" />
		</div>
		<!-- Table -->
		<div class="col-md-10">
			<loading :active.sync="isLoading" color="#e84c64" :can-cancel="false" :is-full-page="false"></loading>
			<v-client-table ref="facilityTable" :data="facilities" v-on:filter="filterChange" :options="options" :columns="columns">
				<template slot="beforeFilter">
					<b-form inline class="mr-3">
						<label class="mr-2">Müşteri:</label>
						<b-select v-model="contractClientId">
							<option value="" disabled>Müşteri seçiniz</option>
							<option>Tümü</option>
							<option v-for="(c, index) in clients" :value="c.id" :key="index">{{ c.title }}</option>
						</b-select>
					</b-form>
					<b-form inline class="mr-3">
						<label class="mr-2">Sözleşme:</label>
						<b-select :disabled="!isClientSelected" v-model="facilityContractId">
							<option value="" disabled>Sözleşme seçiniz</option>
							<option>Tümü</option>
							<option v-for="(c, index) in contracts" :value="c.id" :key="index">{{ c.code }}</option>
						</b-select>
					</b-form>
				</template>
				<template slot="edit" slot-scope="props">
					<div>
						<b-btn variant="outline-info borderless icon-btn" class="btn-xs" @click.prevent="show(props.row)"><i class="ion ion-md-eye"></i></b-btn>
						<b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="editFacility(props.row)"><i class="ion ion-md-create"></i></b-btn>
						<b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="showRemoveToast(props.row)"><i class="ion ion-md-close"></i></b-btn>
					</div>
				</template>
			</v-client-table>
			<sweet-modal ref="infoModal" title="Tesis Bilgileri" width="60%">
				<b-form class="mb-1">
					<b-form-row>
						<b-form-group label="Müşteri" class="col-md-4">
							<b-input readonly v-model="client" title="Müşteri" />
						</b-form-group>
						<b-form-group label="Sözleşme" class="col-md-4">
							<b-input readonly v-model="contractCode" placeholder="Sözleşme" />
						</b-form-group>
						<b-form-group label="Tesis Kodu" class="col-md-4">
							<b-input readonly v-model="facilityCode" placeholder="Tesis Kodu" />
						</b-form-group>
					</b-form-row>
					<b-form-group label="Tesis Adı">
						<b-input readonly v-model="facilityName" placeholder="Tesis Adı" />
					</b-form-group>
					<b-form-group label="Adres">
						<b-input readonly v-model="address" placeholder="Cadde/Mahalle" />
					</b-form-group>
					<b-form-row>
						<b-form-group label="İl" class="col-md-4">
							<b-input readonly v-model="province" placeholder="İl" />
						</b-form-group>
						<b-form-group label="İlçe" class="col-md-4">
							<b-input readonly v-model="district" placeholder="İlçe" />
						</b-form-group>
						<b-form-group label="Bölge" class="col-md-4">
							<b-input readonly v-model="area" placeholder="Bölge" />
						</b-form-group>
					</b-form-row>
					<b-form-row>
						<b-form-group label="Tesis Tipi" class="col-md-4">
							<b-input readonly v-model="facilityType" placeholder="Tesis Tipi" />
						</b-form-group>
						<b-form-group label="Marka" class="col-md-4">
							<b-input readonly v-model="brand" placeholder="Marka" />
						</b-form-group>
						<b-form-group label="Garanti Bitiş Tarihi" class="col-md-4">
							<b-input readonly v-model="warrantyDate" placeholder="Garanti Bitiş Tarihi" />
						</b-form-group>
					</b-form-row>
					<b-form-row>
						<b-form-group label="Durak Sayısı" class="col-md-4">
							<b-input readonly v-model="stationCount" placeholder="Durak Sayısı" />
						</b-form-group>
						<b-form-group label="Hız (m/s)" class="col-md-4">
							<b-input readonly v-model="speed" placeholder="Hız (m/s)" />
						</b-form-group>
						<b-form-group label="Kapasite (kg)" class="col-md-4">
							<b-input readonly v-model="capacity" placeholder="Kapasite (kg)" />
						</b-form-group>
					</b-form-row>
					<b-form-row>
						<b-form-group label="Bakım Durumu" class="col-md-3">
							<b-input readonly v-model="maintenanceStatus" placeholder="Bakım Durumu" />
						</b-form-group>
						<b-form-group label="Eski Bakım Ücreti" class="col-md-3">
							<b-input-group append="₺">
								<b-input readonly v-model="oldMaintenanceFee" placeholder="Eski Bakım Ücreti" />
							</b-input-group>
						</b-form-group>
						<b-form-group label="Güncel Bakım Ücreti" class="col-md-3">
							<b-input-group append="₺">
								<b-input readonly v-model="currentMaintenanceFee" placeholder="Güncel Bakım Ücreti" />
							</b-input-group>
						</b-form-group>
						<b-form-group label="Arıza Ücreti" class="col-md-3">
							<b-input-group append="₺">
								<b-input readonly v-model="breakdownFee" placeholder="Arıza Ücreti" />
							</b-input-group>
						</b-form-group>
					</b-form-row>
				</b-form>
			</sweet-modal>
		</div>
		<!-- Chart -->
		<div class="col-md-2">
			<client-chart :key="clientChartKey" />
		</div>
	</div>
</template>

<style src="@/vendor/libs/vue-data-tables/vue-data-tables.scss" lang="scss"></style>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>

<script>
import "vue-loading-overlay/dist/vue-loading.css";
import Vue from "vue";
import { ClientTable } from "vue-tables-2";
import { mapGetters } from "vuex";
import { SweetModal } from "sweet-modal-vue";
import Loading from "vue-loading-overlay";
import Toasted from "vue-toasted";
import ClientChart from "../../components/ClientChart";

Vue.use(ClientTable);
Vue.use(Toasted);

export default {
	name: "facilities-list",
	metaInfo: {
		title: "Tesis Ekle"
	},
	props: ["clientId", "contractId"],
	components: {
		ClientChart,
		Loading,
		SweetModal
	},
	beforeRouteLeave(to, from, next) {
		this.$toasted.clear();
		next();
	},
	data: () => ({
		clientChartKey: 0,
		client: "",
		contractCode: "",
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
		isLoading: false,
		isClientSelected: false,
		contractClientId: "",
		facilityContractId: "",
		clients: [],
		contracts: [],
		facilities: [],
		columns: ["code", "name", "province", "district", "area", "type", "maintenanceStatus", "formattedWarrantyFinishDate", "edit"],
		options: {
			filterable: true,
			perPage: 10,
			perPageValues: [],
			pagination: { chunk: 5 },
			showChildRowToggler: false,
			headings: {
				code: "Tesis Kodu",
				name: "Tesis Adı",
				province: "İl",
				district: "İlçe",
				area: "Bölge",
				type: "Tesis Tipi",
				maintenanceStatus: "Bakım Durumu",
				formattedWarrantyFinishDate: "Garanti Bitiş Tarihi",
				edit: "Düzenle"
			},
			sortIcon: {
				is: "fa-sort",
				base: "fas",
				up: "fa-sort-up",
				down: "fa-sort-down"
			},
			texts: {
				count: "{count} kayıttan {from} ile {to} arasındakiler gösteriliyor|{count} kayıt|Bir kayıt",
				first: "İlk",
				last: "Son",
				filter: "Arama:",
				filterPlaceholder: "Anahtar Kelime",
				page: "Sayfa:",
				noResults: "Eşleşen kayıt bulunamadı",
				loading: "Yükleniyor..."
			}
		}
	}),
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
		this.contractClientId = "Tümü";
		await this.getClients();
		this.facilityContractId = "Tümü";
		if (this.clientId) this.contractClientId = this.clientId;
	},
	watch: {
		contractClientId(id) {
			this.facilities = [];
			this.facilityContractId = "";
			if (id != "Müşteri seçiniz" && id != "") this.isClientSelected = true;
			if (id == "Tümü") this.getContracts();
			else this.getContractsByClient(id);
		},
		facilityContractId(id) {
			if (id != "") {
				if (id == "Tümü" && this.contractClientId == "Tümü") this.getFacilities();
				else if (id == "Tümü" && this.contractClientId != "Tümü") this.getFacilitiesByClient(this.contractClientId);
				else this.getFacilitiesByContract(id);
			}
		},
		facilities(facilities) {
			facilities.forEach(facility => {
				if (facility.type == 1) facility.type = "MR";
				else if (facility.type == 2) facility.type = "MRL";
				else if (facility.type == 3) facility.type = "Hidrolik";
				else if (facility.type == 4) facility.type = "DumbWaiter";
				else if (facility.type == 5) facility.type = "MW";
				else facility.type = "ESC";
				if (facility.maintenanceStatus == 1) facility.maintenanceStatus = "Aktif";
				else facility.maintenanceStatus = "Pasif";
			});
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
		async getClients() {
			await this.$store.dispatch("client/Get");
			if (this.clientResponse != null) {
				if (this.clientResponse.data.success) this.clients = this.clientResponse.data.data;
				else this.notify("error", "Hata", this.clientResponse.data.message);
			} else this.notify("error", "Hata", this.clientErrorMessage);
		},
		async getContracts() {
			await this.$store.dispatch("contract/Get");
			if (this.contractResponse != null) {
				if (this.contractResponse.data.success) this.contracts = this.contractResponse.data.data;
				else {
					this.notify("error", "Hata", this.contractResponse.data.message);
					this.contracts = [];
				}
			} else {
				if (this.contractErrorCode != 404) this.notify("error", "Hata", this.contractErrorMessage);
				this.contracts = [];
			}
		},
		async getContractsByClient(clientId) {
			await this.$store.dispatch("contract/GetContractsByClient", clientId);
			if (this.contractResponse != null) {
				if (this.contractResponse.data.success) {
					this.contracts = this.contractResponse.data.data;
					if (this.contractId) this.facilityContractId = this.contractId;
				} else {
					this.notify("error", "Hata", this.contractResponse.data.message);
					this.contracts = [];
				}
			} else {
				if (this.contractErrorCode != 404) this.notify("error", "Hata", this.contractErrorMessage);
				this.contracts = [];
			}
		},
		async getFacilities() {
			await this.$store.dispatch("facility/Get");
			if (this.facilityResponse != null) {
				if (this.facilityResponse.data.success) this.facilities = this.facilityResponse.data.data;
				else {
					this.notify("error", "Hata", this.facilityResponse.data.message);
					this.facilities = [];
				}
			} else {
				if (this.facilityErrorCode != 404) this.notify("error", "Hata", this.facilityErrorMessage);
				this.facilities = [];
			}
		},
		async getFacilitiesByContract(id) {
			await this.$store.dispatch("facility/GetFacilitiesByContract", id);
			if (this.facilityResponse != null) {
				if (this.facilityResponse.data.success) this.facilities = this.facilityResponse.data.data;
				else {
					this.notify("error", "Hata", this.facilityResponse.data.message);
					this.facilities = [];
				}
			} else {
				if (this.facilityErrorCode != 404) this.notify("error", "Hata", this.facilityErrorMessage);
				this.facilities = [];
			}
		},
		async getFacilitiesByClient(id) {
			await this.$store.dispatch("facility/GetFacilitiesByClient", id);
			if (this.facilityResponse != null) {
				if (this.facilityResponse.data.success) this.facilities = this.facilityResponse.data.data;
				else {
					this.notify("error", "Hata", this.facilityResponse.data.message);
					this.facilities = [];
				}
			} else {
				if (this.facilityErrorCode != 404) this.notify("error", "Hata", this.facilityErrorMessage);
				this.facilities = [];
			}
		},
		async removeFacility(row) {
			var indexToDelete = this.facilities
				.map(x => {
					return x.id;
				})
				.indexOf(row.id);
			this.facilities.splice(indexToDelete, 1);
			await this.$store.dispatch("facility/Delete", row.id);
			if (this.facilityResponse != null) {
				if (this.facilityResponse.status == 204) {
					this.notify("success", "Başarılı", "Tesis başarıyla silindi.");
					this.clientChartKey += 1;
				} else this.notify("error", "Hata", this.facilityResponse.data.message);
			} else this.notify("error", "Hata", this.facilityErrorMessage);
		},
		clearModal() {
			this.client = "";
			this.contractCode = "";
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
		show(row) {
			this.facilities.forEach(facility => {
				if (facility.id == row.id) {
					this.clearModal();
					this.clients.forEach(client => {
						if (client.id == row.clientId) this.client = client.title;
					});
					this.contracts.forEach(contract => {
						if (contract.id == row.contractId) this.contractCode = contract.code;
					});
					this.facilityCode = row.code;
					this.facilityName = row.name;
					this.address = row.address;
					this.province = row.province;
					this.district = row.district;
					this.area = row.area; // Area Title
					this.facilityType = row.type;
					this.brand = row.brand;
					this.warrantyDate = row.formattedWarrantyFinishDate;
					this.stationCount = row.station;
					this.speed = row.speed;
					this.capacity = row.capacity;
					this.maintenanceStatus = row.maintenanceStatus;
					this.oldMaintenanceFee = row.oldMaintenanceFee;
					this.currentMaintenanceFee = row.currentMaintenanceFee;
					this.breakdownFee = row.breakdownFee;
					this.$refs.infoModal.open();
				}
			});
		},
		editFacility(row) {
			this.$router.push({ name: "editFacility", params: { facilityId: row.id } });
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
		turkishToUpperCase(string) {
			var letters = { i: "İ", ş: "Ş", ğ: "Ğ", ü: "Ü", ö: "Ö", ç: "Ç", ı: "I" };
			string = string.replace(/(([iışğüçö]))/g, function(letter) {
				return letters[letter];
			});
			return string.toUpperCase();
		},
		filterChange(query) {
			if (query != "") this.$refs.facilityTable.setFilter(this.turkishToUpperCase(query[0]) + query.slice(1));
		},
		sleep(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		},
		onlyNumber($event) {
			let keyCode = $event.keyCode;
			if ((keyCode < 48 || keyCode > 57) && keyCode !== 13) $event.preventDefault();
		},
		showRemoveToast(row) {
			this.$toasted.clear();
			const actions = [
				{
					text: "Evet",
					onClick: (e, toastObject) => {
						this.removeFacility(row);
						toastObject.goAway(0);
					},
					class: `opacity-75 text-dark`
				},
				{
					text: "Hayır",
					onClick: (e, toastObject) => {
						toastObject.goAway(0);
					},
					class: `opacity-75 text-dark`
				}
			];
			var toastText = '<i class="ion ion-md-information-circle mr-2"></i> ' + row.name + " adlı tesisi silmek istediğinize emin misiniz?";
			this.$toasted.show(toastText, {
				theme: "bubble",
				position: `bottom-center`,
				action: actions,
				icon: null,
				className: `bg-warning text-dark`,
				duration: 5000,
				singleton: true
			});
		}
	}
};
</script>
