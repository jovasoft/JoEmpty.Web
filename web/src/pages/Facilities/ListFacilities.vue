<template>
	<div>
		<loading :active.sync="isLoading" color="#e84c64" :can-cancel="false" :is-full-page="false"></loading>
		<h4 class="font-weight-bold py-3 mb-3"><span class="text-muted font-weight-light">Tesisler /</span> Tesis Listesi</h4>
		<hr class="container-m-nx border-light mt-0 mb-3" />
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
					<b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="editFacility(props.row)"><i class="ion ion-md-create"></i></b-btn>
					<b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="removeFacility(props.row)"><i class="ion ion-md-close"></i></b-btn>
				</div>
			</template>
		</v-client-table>
	</div>
</template>

<style src="@/vendor/libs/vue-data-tables/vue-data-tables.scss" lang="scss"></style>

<script>
import { ClientTable } from "vue-tables-2";
import Vue from "vue";
import { mapGetters } from "vuex";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

Vue.use(ClientTable);

export default {
	name: "facilities-list",
	metaInfo: {
		title: "Tesis Ekle"
	},
	props: ["clientId", "contractId"],
	components: {
		Loading
	},
	data: () => ({
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
				} else this.notify("error", "Hata", this.facilityResponse.data.message);
			} else this.notify("error", "Hata", this.facilityErrorMessage);
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
		}
	}
};
</script>
