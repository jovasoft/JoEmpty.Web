<template>
	<div>
		<loading :active.sync="isLoading" color="#e84c64" :can-cancel="false" :is-full-page="false"></loading>
		<h4 class="font-weight-bold py-3 mb-3"><span class="text-muted font-weight-light">Sözleşmeler /</span> {{ pageTitle }}</h4>
		<hr class="container-m-nx border-light mt-0 mb-3" />
		<b-card header="Sözleşme Bilgileri" header-tag="h6" class="mb-3">
			<b-form class="mb-1" @submit.prevent="addContract">
				<b-form-row>
					<b-form-group label="Müşteri" class="col-md-6">
						<b-select v-model="contractClientId" :disabled="contractEditMode" @blur="$v.contractClientId.$touch()">
							<option value="" disabled>Müşteri seçiniz</option>
							<option v-for="(c, index) in clients" :value="c.id" :key="index">{{ c.title }}</option>
						</b-select>
						<template v-if="$v.contractClientId.$error">
							<small v-if="!$v.contractClientId.required" class="form-text text-danger">Müşteri boş geçilemez.</small>
						</template>
					</b-form-group>
					<b-form-group label="Sözleşme Kodu" class="col-md-6">
						<b-input v-model="contractCode" @blur="$v.contractCode.$touch()" placeholder="Sözleşme Kodu" />
						<template v-if="$v.contractCode.$error">
							<small v-if="!$v.contractCode.required" class="form-text text-danger">Sözleşme kodu geçilemez.</small>
						</template>
					</b-form-group>
				</b-form-row>
				<b-form-row>
					<b-form-group label="Başlangıç Tarihi" class="col-md-6">
						<datepicker v-model="startDate" @blur="$v.startDate.$touch()" :disabledDates="startDisabledDates" :language="tr" :bootstrapStyling="true" :monday-first="true" :full-month-name="true" placeholder="Başlangıç Tarihi" :calendar-button="true" calendar-button-icon="ion ion-md-calendar" :clear-button="true" />
						<template v-if="$v.startDate.$error">
							<small v-if="!$v.startDate.required" class="form-text text-danger">Başlangıç tarihi boş geçilemez.</small>
						</template>
					</b-form-group>
					<b-form-group label="Bitiş Tarihi" class="col-md-6">
						<datepicker v-model="endDate" @blur="$v.endDate.$touch()" :disabledDates="endDisabledDates" :language="tr" :bootstrapStyling="true" :monday-first="true" :full-month-name="true" placeholder="Bitiş Tarihi" :calendar-button="true" calendar-button-icon="ion ion-md-calendar" :clear-button="true" />
						<template v-if="$v.endDate.$error">
							<small v-if="!$v.endDate.required" class="form-text text-danger">Bitiş tarihi boş geçilemez.</small>
						</template>
					</b-form-group>
				</b-form-row>
				<b-form-row>
					<b-form-group label="Tutar" class="col-md-6">
						<b-input-group :append="suffix">
							<b-input v-model="price" @keypress="onlyNumber" @blur="$v.price.$touch()" placeholder="Tutar" type="text" class="form-control" />
						</b-input-group>
						<template v-if="$v.price.$error">
							<small v-if="!$v.price.required || !$v.price.validPrice" class="form-text text-danger">Tutar boş geçilemez.</small>
						</template>
					</b-form-group>
					<b-form-group label="Para Birimi" class="col-md-6">
						<b-select v-model="currency" @blur="$v.currency.$touch()">
							<option value="TL">TL</option>
							<option value="Euro">Euro</option>
							<option value="Dollar">Dolar</option>
						</b-select>
						<template v-if="$v.currency.$error">
							<small v-if="!$v.currency.required" class="form-text text-danger">Para birimi boş geçilemez.</small>
						</template>
					</b-form-group>
				</b-form-row>
				<b-form-row>
					<b-form-group label="Sarf Malzeme" class="col-md-12">
						<b-select v-model="supply" @blur="$v.supply.$touch()">
							<option value="Internal">Dahil</option>
							<option value="External">Hariç</option>
						</b-select>
						<template v-if="$v.supply.$error">
							<small v-if="!$v.supply.required" class="form-text text-danger">Sarf malzeme boş geçilemez.</small>
						</template>
					</b-form-group>
				</b-form-row>
				<b-form-group label="Dosyalar">
					<vue-dropzone ref="fileUpload" @vdropzone-complete="vcomplete" @vdropzone-file-added="vattachListener" @vdropzone-success="vsuccess" @vdropzone-error="verror" @vdropzone-removed-file="vremoved" id="my-dropzone" :duplicateCheck="true" :options="dropzoneOptions" />
				</b-form-group>
				<b-btn class="btn-flat float-right" type="submit" variant="primary">{{ buttonTitle }}</b-btn>
			</b-form>
		</b-card>
		<sweet-modal v-on:close="modalClosing" ref="successModal" icon="success" :hide-close-button="true">
			<h4 class="font-weight-bold">Sözleşme Başarıyla Eklendi.</h4>
			<div>
				<small style="cursor: pointer;" v-on:click="refreshPage">Yeni bir sözleşme eklemek için <span class="font-weight-bold">buraya</span> tıklayınız.</small>
			</div>
			<div>
				<small style="cursor: pointer;" v-on:click="navigateToAddFacility">{{ contractCode }} numaralı sözleşmeye tesis eklemek için <span class="font-weight-bold">buraya</span> tıklayınız.</small>
			</div>
		</sweet-modal>
	</div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-dropzone/vue-dropzone.scss" lang="scss"></style>

<script>
import Datepicker from "vuejs-datepicker";
import { tr } from "vuejs-datepicker/dist/locale";
import vue2Dropzone from "vue2-dropzone";
import { mapGetters } from "vuex";
import { required } from "vuelidate/lib/validators";
import { SweetModal } from "sweet-modal-vue";
import Loading from "vue-loading-overlay";
import { StorageService } from "@/services/storage.service";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
	name: "contracts-add",
	metaInfo: {
		title: "Sözleşme Ekle"
	},
	props: ["clientId", "contractId"],
	components: {
		vueDropzone: vue2Dropzone,
		Datepicker,
		SweetModal,
		Loading
	},
	data: () => ({
		authToken: "",
		files: [],
		filesToDelete: [],
		isUploadComplete: false,
		errorCount: 0,
		successCount: 0,
		isLoading: false,
		suffix: "₺",
		contractEditMode: false,
		isModalClosing: false,
		pageTitle: "Sözleşme Ekle",
		buttonTitle: "Sözleşme Ekle",
		clients: [],
		newContractId: "",
		contractClientId: "",
		contractCode: "",
		startDate: "",
		endDate: "",
		price: "",
		currency: "TL",
		supply: "Internal",
		startDisabledDates: {
			to: new Date(2010, 1, 1)
		},
		endDisabledDates: {},
		tr: tr,
		dropzoneOptions: {
			url: "http://localhost:5002/api/Contract/Upload/",
			headers: { Authorization: `Bearer ${StorageService.getToken()}` },
			parallelUploads: 10,
			paramName: "files",
			uploadMultiple: false,
			maxFilesize: 5000,
			filesizeBase: 1000,
			acceptedFiles: ".jpg,.jpeg,.png,.pdf,.txt",
			autoProcessQueue: false,
			addRemoveLinks: true,
			dictRemoveFile: "Dosyayı kaldır",
			dictDefaultMessage: "Dosya yüklemek için tıklayın",
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
		}
	}),
	validations: {
		contractClientId: { required },
		contractCode: { required },
		startDate: { required },
		endDate: { required },
		price: {
			required,
			validPrice: price => {
				return /^\d+$/.test(price);
			}
		},
		currency: { required },
		supply: { required }
	},
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
			fileErrorCode: "file/errorCode",
			fileResponse: "file/response",
			fileStatus: "file/status"
		})
	},
	async created() {
		await this.getClients();
		if (this.clientId) this.contractClientId = this.clientId;
		if (this.contractId) {
			this.contractEditMode = true;
			this.pageTitle = "Sözleşme Düzenle";
			this.buttonTitle = "Kaydet";
			await this.getContract(this.contractId);
			await this.getFiles(this.contractId);
		}
	},
	watch: {
		startDate(newValue) {
			this.endDisabledDates = {
				to: new Date(newValue)
			};
			if (!newValue) this.endDate = "";
			else if (typeof newValue != "string") {
				this.endDate = new Date(newValue.getTime());
				this.endDate.setFullYear(this.endDate.getFullYear() + 1);
			}
		},
		currency(newValue) {
			if (newValue == "TL") this.suffix = "₺";
			else if (newValue == "Euro") this.suffix = "€";
			else this.suffix = "$";
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
		vattachListener: function(addedFile) {
			if (this.contractEditMode) {
				var self = this;
				addedFile.previewElement.addEventListener("click", async function() {
					if (self.files != null) {
						self.files.forEach(async file => {
							if (file.name == addedFile.name) {
								await self.$store.dispatch("file/Get", {
									url: file.url,
									type: file.type
								});
								window.open(self.fileResponse, "_blank");
							}
						});
					}
				});
			}
		},
		vcomplete() {
			this.isComplete = true;
		},
		vremoved(fileToDelete) {
			if (this.contractEditMode) {
				this.files.forEach(file => {
					if (fileToDelete.name == file.name) {
						this.filesToDelete.push(file.id);
					}
				});
			}
		},
		async vsuccess() {
			if (this.isComplete) {
				this.successCount++;
				if (this.successCount == this.$refs.fileUpload.getAcceptedFiles().length) {
					this.successCount = 0;
					if (!this.contractEditMode) this.showModal();
					else {
						this.notify("success", "Başarılı", "Sözleşme başarıyla güncellendi.");
						await this.sleep(1000);
						this.$router.push({ name: "listContracts", params: { contractsClientId: this.contractClientId } });
					}
				}
			}
		},
		async verror() {
			if (this.isComplete) {
				this.errorCount++;
				if (this.errorCount == this.$refs.fileUpload.getAcceptedFiles().length) {
					this.errorCount = 0;
					if (!this.contractEditMode) {
						this.notify("success", "Başarılı", "Sözleşme başarıyla eklendi.");
						this.notify("error", "Hata", "Dosyalar yüklenirken bir hata oluştu.");
						await this.sleep(2000);
						this.$router.push({ name: "listContracts", params: { contractsClientId: this.contractClientId } });
					} else {
						this.notify("success", "Başarılı", "Sözleşme başarıyla güncellendi.");
						await this.sleep(1000);
						this.$router.push({ name: "listContracts", params: { contractsClientId: this.contractClientId } });
					}
				}
			}
		},
		async getClients() {
			await this.$store.dispatch("client/Get");
			if (this.clientResponse != null) {
				if (this.clientResponse.data.success) {
					this.clients = this.clientResponse.data.data;
				} else this.notify("error", "Hata", this.clientResponse.data.message);
			} else if (this.clientErrorCode != 404) this.notify("error", "Hata", this.clientErrorMessage);
		},
		async addContract() {
			this.$v.$touch();
			if (!this.$v.$invalid) {
				if (!this.contractEditMode) {
					await this.$store.dispatch("contract/Add", {
						clientId: this.contractClientId,
						code: this.contractCode,
						startDate: this.startDate,
						finishDate: this.endDate,
						amount: this.price,
						currency: this.currency,
						supply: this.supply
					});
				} else {
					await this.$store.dispatch("contract/Update", {
						id: this.contractId,
						contract: {
							clientId: this.contractClientId,
							code: this.contractCode,
							startDate: this.startDate,
							finishDate: this.endDate,
							amount: this.price,
							currency: this.currency,
							supply: this.supply
						}
					});
				}
				if (this.contractResponse != null) {
					if (this.contractResponse.data.success) {
						if (!this.contractEditMode) {
							this.newContractId = this.contractResponse.data.data.id;
							if (this.$refs.fileUpload.getAcceptedFiles().length > 0) {
								this.$refs.fileUpload.setOption("url", this.dropzoneOptions.url + this.newContractId);
								this.$refs.fileUpload.processQueue();
							} else this.showModal();
						} else {
							if (this.filesToDelete.length > 0) await this.deleteFiles();
							if (this.$refs.fileUpload.getAcceptedFiles().length > 0) this.uploadNewFiles();
							else {
								this.notify("success", "Başarılı", "Sözleşme başarıyla güncellendi.");
								await this.sleep(1000);
								this.$router.push({ name: "listContracts", params: { contractsClientId: this.contractClientId } });
							}
						}
					} else this.notify("error", "Hata", this.contractResponse.data.message);
				} else this.notify("error", "Hata", this.contractErrorMessage);
			}
		},
		async deleteFiles() {
			this.filesToDelete.forEach(async id => {
				await this.$store.dispatch("contract/DeleteFile", {
					contractId: this.contractId,
					fileId: id
				});
			});
		},
		async uploadNewFiles() {
			this.$refs.fileUpload.getAcceptedFiles().forEach(fileToUpload => {
				this.files.forEach(file => {
					if (fileToUpload.name == file.name) this.$refs.fileUpload.removeFile(fileToUpload);
				});
			});
			this.$refs.fileUpload.setOption("url", this.dropzoneOptions.url + this.contractId);
			this.$refs.fileUpload.processQueue();
		},
		async getContract(contractId) {
			await this.$store.dispatch("contract/GetOne", contractId);
			if (this.contractResponse != null) {
				if (this.contractResponse.data.success) {
					this.fillForms(this.contractResponse.data.data);
				} else this.notify("error", "Hata", this.contractResponse.data.message);
			} else this.notify("error", "Hata", this.contractErrorMessage);
		},
		async getFiles(contractId) {
			await this.$store.dispatch("contract/GetFiles", contractId);
			if (this.contractResponse != null) {
				if (this.contractResponse.data.success) {
					this.files = this.contractResponse.data.data.files;
					this.addFilesToDropzone();
				} else this.notify("error", "Hata", this.contractResponse.data.message);
			} else if (this.contractErrorCode != 404) this.notify("error", "Hata", this.contractErrorMessage);
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
		fillForms(contract) {
			this.contractClientId = contract.clientId;
			this.contractCode = contract.code;
			this.startDate = contract.startDate;
			this.endDate = contract.finishDate;
			this.price = contract.amount;
			if (contract.currency == 1) this.currency = "TL";
			else if (contract.currency == 2) this.currency = "Euro";
			else this.currency = "Dollar";
			if (contract.supply == 1) this.supply = "Internal";
			else this.supply = "External";
		},
		notify(type, title, text) {
			this.$notify({
				group: "app",
				type: type,
				title: title,
				text: text,
				ignoreDuplicates: false,
				duration: 5000
			});
		},
		showModal() {
			this.$refs.successModal.open();
		},
		modalClosing() {
			if (this.$refs.successModal.is_open && !this.isModalClosing) {
				this.$router.push({ name: "listContracts", params: { contractsClientId: this.contractClientId } });
			}
		},
		refreshPage() {
			this.isModalClosing = true;
			this.$refs.successModal.close();
			this.$router.go(0);
		},
		navigateToAddFacility() {
			this.isModalClosing = true;
			this.$refs.successModal.close();
			this.$router.push({ name: "addFacility", params: { clientId: this.contractClientId, contractId: this.newContractId } });
		},
		onlyNumber($event) {
			let keyCode = $event.keyCode ? $event.keyCode : $event.which;
			if ((keyCode < 48 || keyCode > 57) && keyCode !== 13) $event.preventDefault();
		},
		sleep(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		}
	}
};
</script>
