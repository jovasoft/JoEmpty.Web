<template>
	<div>
		<h4 class="font-weight-bold py-3 mb-3"><span class="text-muted font-weight-light">Sözleşmeler /</span> Sözleşme Listesi</h4>
		<hr class="container-m-nx border-light mt-0 mb-3" />
		<v-client-table :data="contracts" :options="options" :columns="columns">
			<template slot="beforeFilter">
				<b-form inline class="mr-3">
					<label class="mr-2">Müşteri:</label>
					<b-select v-model="clientId">
						<option value="" disabled>Müşteri seçiniz</option>
						<option v-for="(c, index) in clients" :value="c.id" :key="index">{{ c.title }}</option>
					</b-select>
				</b-form>
			</template>
			<template slot="edit" slot-scope="props">
				<div>
					<b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="editContract(props.row)"><i class="ion ion-md-create"></i></b-btn>
					<b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="removeContract(props.row)"><i class="ion ion-md-close"></i></b-btn>
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

Vue.use(ClientTable);

export default {
	name: "contracts-list",
	metaInfo: {
		title: "Sözleşme Listesi"
	},
	props: ["contractsClientId"],
	data: () => ({
		clientId: "",
		clients: [],
		contracts: [],
		columns: ["code", "amount", "currency", "supply", "facilityCount", "startDate", "finishDate", "edit"],
		options: {
			filterable: true,
			perPage: 10,
			perPageValues: [],
			pagination: { chunk: 5 },
			showChildRowToggler: false,
			headings: {
				code: "Sözleşme Kodu",
				amount: "Tutar",
				currency: "Para Birimi",
				supply: "Sarf Malzeme",
				facilityCount: "Tesis Sayısı",
				startDate: "Başlangıç Tarihi",
				finishDate: "Bitiş Tarihi",
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
			contractErrorMessage: "contract/errorMessage",
			contractErrorCode: "contract/errorCode",
			contractResponse: "contract/response",
			clientErrorMessage: "client/errorMessage",
			clientErrorCode: "client/errorCode",
			clientResponse: "client/response"
		})
	},
	async created() {
		await this.getClients();
		if (this.contractsClientId) this.clientId = this.contractsClientId;
	},
	watch: {
		clientId(id) {
			this.getContractByClient(id);
		},
		contracts(contracts) {
			contracts.forEach(contract => {
				if (contract.supply == 1) contract.supply = "Dahil";
				else contract.supply = "Hariç";
				if (contract.currency == 1) contract.currency = "TL";
				else if (contract.currency == 2) contract.currency = "Euro";
				else contract.currency = "Dolar";
			});
		}
	},
	methods: {
		async getClients() {
			await this.$store.dispatch("client/Get");
			if (this.clientResponse != null) {
				if (this.clientResponse.data.success) {
					this.clients = this.clientResponse.data.data;
				} else this.notify("error", "Hata", this.clientResponse.data.message);
			} else this.notify("error", "Hata", this.clientErrorMessage);
		},
		async getContracts() {
			await this.$store.dispatch("contract/Get");
			if (this.contractResponse != null) {
				if (this.contractResponse.data.success) this.contracts = this.contractResponse.data.data;
				else this.notify("error", "Hata", this.contractResponse.data.message);
			} else this.notify("error", "Hata", this.clientErrorMessage);
		},
		async getContractByClient(clientId) {
			await this.$store.dispatch("contract/GetContractsByClient", clientId);
			if (this.contractResponse != null) {
				if (this.contractResponse.data.success) this.contracts = this.contractResponse.data.data;
				else {
					this.notify("error", "Hata", this.contractResponse.data.message);
					this.contracts = [];
				}
			} else {
				this.notify("error", "Hata", this.contractErrorMessage);
				this.contracts = [];
			}
		},
		async removeContract(row) {
			var indexToDelete = this.contracts
				.map(x => {
					return x.id;
				})
				.indexOf(row.id);
			this.contracts.splice(indexToDelete, 1);
			await this.$store.dispatch("contract/Delete", row.id);
			if (this.contractResponse != null) {
				if (this.contractResponse.status == 204) {
					this.notify("success", "Başarılı", "Sözleşme başarıyla silindi.");
				} else this.notify("error", "Hata", this.contractResponse.data.message);
			} else this.notify("error", "Hata", this.contractErrorMessage);
		},
		editContract(row) {
			this.$router.push({ name: "addContract", params: { contractId: row.id } });
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
