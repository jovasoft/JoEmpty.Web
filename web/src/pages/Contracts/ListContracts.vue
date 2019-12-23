<template>
	<div class="row">
		<!-- Title -->
		<div class="col-md-12">
			<h4 class="font-weight-bold py-3 mb-3"><span class="text-muted font-weight-light">Sözleşmeler /</span> Sözleşme Listesi</h4>
			<hr class="container-m-nx border-light mt-0 mb-3" />
		</div>
		<!-- Table -->
		<div class="col-md-10">
			<loading :active.sync="isLoading" color="#e84c64" :can-cancel="false" :is-full-page="false"></loading>
			<v-client-table :data="contracts" :options="options" :columns="columns">
				<template slot="beforeFilter">
					<b-form inline class="mr-3">
						<label class="mr-2">Müşteri:</label>
						<b-select v-model="clientId">
							<option value="" disabled>Müşteri seçiniz</option>
							<option>Tümü</option>
							<option v-for="(c, index) in clients" :value="c.id" :key="index">{{ c.title }}</option>
						</b-select>
					</b-form>
				</template>
				<template slot="edit" slot-scope="props">
					<div>
						<b-btn variant="outline-info borderless icon-btn" class="btn-xs" @click.prevent="show(props.row)"><i class="ion ion-md-eye"></i></b-btn>
						<b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="editContract(props.row)"><i class="ion ion-md-create"></i></b-btn>
						<b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="showRemoveToast(props.row)"><i class="ion ion-md-close"></i></b-btn>
					</div>
				</template>
			</v-client-table>
			<sweet-modal ref="infoModal" title="Sözleşme Bilgileri" width="60%">
				<b-form class="mb-1">
					<b-form-row>
						<b-form-group label="Müşteri" class="col-md-6">
							<b-input readonly v-model="client" placeholder="Müşteri" />
						</b-form-group>
						<b-form-group label="Sözleşme Kodu" class="col-md-6">
							<b-input readonly v-model="contractCode" placeholder="Sözleşme Kodu" />
						</b-form-group>
					</b-form-row>
					<b-form-row>
						<b-form-group label="Başlangıç Tarihi" class="col-md-6">
							<b-input readonly v-model="startDate" />
						</b-form-group>
						<b-form-group label="Bitiş Tarihi" class="col-md-6">
							<b-input readonly v-model="endDate" />
						</b-form-group>
					</b-form-row>
					<b-form-row>
						<b-form-group label="Tutar" class="col-md-6">
							<b-input readonly v-model="price" placeholder="Tutar" type="text" class="form-control" />
						</b-form-group>
						<b-form-group label="Sarf Malzeme" class="col-md-6">
							<b-input readonly v-model="supply" />
						</b-form-group>
					</b-form-row>
					<b-form-group label="Dosyalar">
						<vue-dropzone ref="fileUpload" @vdropzone-file-added="vattachListener" id="my-dropzone" :duplicateCheck="true" :options="dropzoneOptions" />
					</b-form-group>
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
<style src="@/vendor/libs/vue-dropzone/vue-dropzone.scss" lang="scss"></style>

<script>
import "vue-loading-overlay/dist/vue-loading.css";
import Vue from "vue";
import { ClientTable } from "vue-tables-2";
import { mapGetters } from "vuex";
import { SweetModal } from "sweet-modal-vue";
import Loading from "vue-loading-overlay";
import vue2Dropzone from "vue2-dropzone";
import Toasted from "vue-toasted";
import ClientChart from "../../components/ClientChart";

Vue.use(ClientTable);
Vue.use(Toasted);

export default {
	name: "contracts-list",
	metaInfo: {
		title: "Sözleşme Listesi"
	},
	components: {
		ClientChart,
		vueDropzone: vue2Dropzone,
		Loading,
		SweetModal
	},
	props: ["contractsClientId"],
	data: () => ({
		clientChartKey: 0,
		isLoading: false,
		clientId: "",
		clients: [],
		contracts: [],
		files: [],
		client: "",
		contractCode: "",
		startDate: "",
		endDate: "",
		price: "",
		suffix: "",
		supply: "",
		dropzoneOptions: {
			url: "http://localhost:5000/api/Contract/Upload/",
			parallelUploads: 10,
			uploadMultiple: false,
			clickable: false,
			autoProcessQueue: false,
			dictDefaultMessage: "Dosya bulunamadı",
			previewTemplate: `
				<div class="dz-preview dz-file-preview">
					<div class="dz-details">
						<div class="dz-thumbnail">
							<img data-dz-thumbnail>
							<span class="dz-nopreview">Önizleme yok</span>
							<div class="dz-success-mark"></div>
							<div class="dz-error-mark"></div>
							<div class="dz-error-message">Hata</span></div>
							<div class="progress"><div class="progress-bar progress-bar-primary" role="progressbar" aria-valuemin="0" aria-valuemax="100" data-dz-uploadprogress></div></div>
						</div>
						<div class="dz-filename" data-dz-name></div>
						<div class="dz-size" data-dz-size></div>
					</div>
				</div>`
		},
		columns: ["code", "amount", "supply", "facilityCount", "formattedStartDate", "formattedFinishDate", "edit"],
		options: {
			filterable: true,
			perPage: 10,
			perPageValues: [],
			pagination: { chunk: 5 },
			showChildRowToggler: false,
			headings: {
				code: "Sözleşme Kodu",
				amount: "Tutar",
				supply: "Sarf Malzeme",
				facilityCount: "Tesis Sayısı",
				formattedStartDate: "Başlangıç Tarihi",
				formattedFinishDate: "Bitiş Tarihi",
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
			contractStatus: "contract/status",
			clientErrorMessage: "client/errorMessage",
			clientErrorCode: "client/errorCode",
			clientResponse: "client/response",
			clientStatus: "client/status",
			fileErrorMessage: "file/errorMessage",
			fileResponse: "file/response",
			fileStatus: "file/status"
		})
	},
	async created() {
		this.clientId = "Tümü";
		await this.getClients();
		if (this.contractsClientId) this.clientId = this.contractsClientId;
	},
	beforeRouteLeave(to, from, next) {
		this.$toasted.clear();
		next();
	},
	watch: {
		clientId(id) {
			if (id == "Tümü") this.getContracts();
			else this.getContractByClient(id);
		},
		contracts(contracts) {
			contracts.forEach(contract => {
				if (contract.supply == 1) contract.supply = "Dahil";
				else contract.supply = "Hariç";
				if (contract.currency == 1 && !contract.amount.toString().includes("₺")) contract.amount = contract.amount + " ₺";
				else if (contract.currency == 2 && !contract.amount.toString().includes("€")) contract.amount = "€ " + contract.amount;
				else if (contract.currency == 3 && !contract.amount.toString().includes("$")) contract.amount = "$ " + contract.amount;
			});
		},
		clientStatus(status) {
			if (status == "loading") this.isLoading = true;
			else this.isLoading = false;
		},
		contractStatus(status) {
			if (status == "loading") this.isLoading = true;
			else this.isLoading = false;
		}
	},
	methods: {
		async getFiles(contractId) {
			await this.$store.dispatch("contract/GetFiles", contractId);
			if (this.contractResponse != null) {
				if (this.contractResponse.data.success) {
					this.files = this.contractResponse.data.data.files;
					this.addFilesToDropzone();
				} else this.notify("error", "Hata", this.contractResponse.data.message);
			} else if (this.contractErrorCode != 404) this.notify("error", "Hata", this.contractErrorMessage);
		},
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
				else {
					this.notify("error", "Hata", this.contractResponse.data.message);
					this.contracts = [];
				}
			} else {
				if (this.contractErrorCode != 404) this.notify("error", "Hata", this.contractErrorMessage);
				this.contracts = [];
			}
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
				if (this.contractErrorCode != 404) this.notify("error", "Hata", this.contractErrorMessage);
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
					this.clientChartKey += 1;
				} else this.notify("error", "Hata", this.contractResponse.data.message);
			} else this.notify("error", "Hata", this.contractErrorMessage);
		},
		addFilesToDropzone() {
			this.files.forEach(async file => {
				var newFile = { size: file.size, name: file.name, type: file.type };
				await this.$store.dispatch("file/Get", {
					url: file.url,
					type: file.type
				});
				var url = this.fileResponse;
				this.$refs.fileUpload.manuallyAddFile(newFile, url);
			});
		},
		clearInfos() {
			this.files = [];
			this.$refs.fileUpload.removeAllFiles();
			this.client = "";
			this.contractId = "";
			this.startDate = "";
			this.endDate = "";
			this.price = "";
			this.supply = "";
		},
		show(row) {
			this.clearInfos();
			this.contracts.forEach(async contract => {
				if (contract.id == row.id) {
					await this.getFiles(contract.id);
					this.clients.forEach(client => {
						if (client.id == contract.clientId) this.client = client.title;
					});
					this.contractCode = contract.code;
					this.startDate = contract.formattedStartDate;
					this.endDate = contract.formattedFinishDate;
					this.price = contract.amount;
					this.supply = contract.supply;
					this.$refs.infoModal.open();
				}
			});
		},
		editContract(row) {
			this.$router.push({ name: "editContract", params: { contractId: row.id } });
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
		vattachListener: function(addedFile) {
			var self = this;
			addedFile.previewElement.addEventListener("click", async function() {
				if (self.files != null) {
					self.files.forEach(async file => {
						if (file.name == addedFile.name) {
							await self.$store.dispatch("file/Get", {
								url: file.url,
								type: file.type
							});
							if (self.fileResponse != null) {
								window.open(self.fileResponse, "_blank");
							} else self.notify("error", "Hata", self.fileErrorMessage);
						}
					});
				}
			});
		},
		showRemoveToast(row) {
			this.$toasted.clear();
			const actions = [
				{
					text: "Evet",
					onClick: (e, toastObject) => {
						this.removeContract(row);
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
			var toastText = '<i class="ion ion-md-information-circle mr-2"></i> ' + row.code + " kodlu sözleşmeyi silmek istediğinize emin misiniz?";
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
