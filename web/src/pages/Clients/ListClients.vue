<template>
	<div>
		<loading :active.sync="isLoading" color="#e84c64" :can-cancel="false" :is-full-page="false"></loading>
		<h4 class="font-weight-bold py-3 mb-3"><span class="text-muted font-weight-light">Müşteriler /</span> Müşteri Listesi</h4>
		<hr class="container-m-nx border-light mt-0 mb-3" />
		<v-client-table ref="clientTable" :data="clients" :columns="columns" :options="options">
			<template slot="edit" slot-scope="props">
				<div>
					<b-btn variant="outline-info borderless icon-btn" class="btn-xs" @click.prevent="show(props.row)"><i class="ion ion-md-eye"></i></b-btn>
					<b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="edit(props.row)"><i class="ion ion-md-create"></i></b-btn>
					<b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="remove(props.row)"><i class="ion ion-md-close"></i></b-btn>
				</div>
			</template>
		</v-client-table>
		<sweet-modal ref="infoModal" title="Müşteri Bilgileri" width="60%" :enableMobileFullscreen="true">
			<b-form>
				<b-form-row>
					<b-form-group label="Cari Kod" class="col-md-6">
						<b-input readonly v-model="currentCode" placeholder="Cari Kod" />
					</b-form-group>
					<b-form-group label="Ünvan" class="col-md-6">
						<b-input readonly v-model="title" placeholder="Ünvan" />
					</b-form-group>
				</b-form-row>
				<b-form-group label="Adres">
					<b-input readonly v-model="address" placeholder="Cadde/Mahalle" />
				</b-form-group>
				<b-form-row>
					<b-form-group label="İl" class="col-md-6">
						<b-input readonly v-model="province" placeholder="İl" />
					</b-form-group>
					<b-form-group label="İlçe" class="col-md-6">
						<b-input readonly v-model="district" placeholder="İlçe" />
					</b-form-group>
				</b-form-row>
				<b-form-group label="Notlar">
					<b-textarea readonly v-model="notes" placeholder="Notlar" :rows="4" :max-rows="6" />
				</b-form-group>
			</b-form>
			<v-client-table :data="clientContacts" :columns="contactColumns" :options="contactTableOptions"> </v-client-table>
		</sweet-modal>
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

Vue.use(ClientTable);

export default {
	name: "clients-list",
	metaInfo: {
		title: "Müşteri Listesi"
	},
	components: {
		Loading,
		SweetModal
	},
	data: () => ({
		isLoading: false,
		clients: [],
		clientContacts: [],
		notes: "",
		province: "",
		district: "",
		address: "",
		title: "",
		currentCode: "",
		contactColumns: ["firstName", "lastName", "title", "department", "internalNumber", "phoneNumber", "mailAddress"],
		contactTableOptions: {
			filterable: false,
			perPage: 10,
			perPageValues: [],
			pagination: { chunk: 5 },
			showChildRowToggler: false,
			headings: {
				firstName: "Ad",
				lastName: "Soyad",
				title: "Ünvan",
				department: "Departman",
				internalNumber: "Sabit Telefon",
				phoneNumber: "Cep Telefonu",
				mailAddress: "E-Posta"
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
				page: "Sayfa:",
				noResults: "Eşleşen kayıt bulunamadı",
				loading: "Yükleniyor..."
			}
		},
		columns: ["currentCode", "title", "province", "district", "edit"],
		options: {
			perPage: 10,
			perPageValues: [],
			pagination: { chunk: 5 },
			showChildRowToggler: false,
			headings: {
				currentCode: "Cari Kod",
				title: "Ünvan",
				province: "İl",
				district: "İlçe",
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
			clientContactErrorMessage: "clientContact/errorMessage",
			clientContactErrorCode: "clientContact/errorCode",
			clientContactResponse: "clientContact/response",
			clientContactStatus: "clientContact/status",
			errorMessage: "client/errorMessage",
			errorCode: "client/errorCode",
			response: "client/response",
			status: "client/status"
		})
	},
	created() {
		this.getClients();
	},
	watch: {
		status(status) {
			if (status == "loading") this.isLoading = true;
			else this.isLoading = false;
		}
	},
	methods: {
		async getClients() {
			await this.$store.dispatch("client/Get");
			if (this.response != null) {
				if (this.response.data.success) {
					this.clients = this.response.data.data;
				} else this.notify("error", "Hata", this.response.data.message);
			} else if (this.errorCode != 404) this.notify("error", "Hata", this.errorMessage);
		},
		async remove(row) {
			var indexToDelete = this.clients
				.map(x => {
					return x.id;
				})
				.indexOf(row.id);
			this.clients.splice(indexToDelete, 1);
			await this.$store.dispatch("client/Delete", row.id);
			if (this.response != null) {
				if (this.response.status == 204) {
					this.notify("success", "Başarılı", "Müşteri başarıyla silindi.");
				} else this.notify("error", "Hata", this.response.data.message);
			} else this.notify("error", "Hata", this.errorMessage);
		},
		async getClientContacts(clientId) {
			await this.$store.dispatch("clientContact/Get", clientId);
			if (this.clientContactResponse != null) {
				if (this.clientContactResponse.data.success) this.clientContacts = this.clientContactResponse.data.data;
				else this.notify("error", "Hata", this.clientContactResponse.data.message);
			} else if (this.clientContactErrorCode != 404) this.notify("error", "Hata", this.clientContactErrorMessage);
		},
		show(row) {
			this.clearInfos();
			this.clients.forEach(async client => {
				if (client.id == row.id) {
					await this.getClientContacts(client.id);
					this.currentCode = client.currentCode;
					this.title = client.title;
					this.address = client.address;
					this.province = client.province;
					this.district = client.district;
					this.notes = client.notes;
					this.$refs.infoModal.open();
				}
			});
		},
		edit(row) {
			this.$router.push({ name: "editClients", params: { clientId: row.id } });
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
		clearInfos() {
			this.clientContacts = [];
			this.currentCode = "";
			this.title = "";
			this.address = "";
			this.province = "";
			this.district = "";
			this.notes = "";
		}
	}
};
</script>
