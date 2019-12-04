<template>
	<div>
		<loading :active.sync="isLoading" color="#e84c64" :can-cancel="false" :is-full-page="false"></loading>
		<h4 class="font-weight-bold py-3 mb-3"><span class="text-muted font-weight-light">Müşteriler /</span> {{ pageTitle }}</h4>
		<hr class="container-m-nx border-light mt-0 mb-3" />
		<form-wizard class="form-wizard-vertical-left mb-5">
			<template slot="step" slot-scope="props">
				<wizard-step :tab="props.tab" @click.native="props.navigateToTab(props.index)" @keyup.enter.native="props.navigateToTab(props.index)" :transition="props.transition" :index="props.index">
					<span slot="title" :class="{ 'text-danger': props.tab.validationError }" v-html="props.tab.title"></span>
				</wizard-step>
			</template>
			<tab-content icon="ion ion-ios-information-circle" title="Müşteri Bilgileri" :before-change="() => validateFirstStep()">
				<b-card header="Müşteri Bilgileri" header-tag="h6" class="mb-3">
					<b-form>
						<b-form-row>
							<b-form-group label="Cari Kod" class="col-md-6">
								<b-input v-model="currentCode" placeholder="Cari Kod" />
							</b-form-group>
						</b-form-row>
						<b-form-group label="Ünvan">
							<b-input v-model="title" @blur="$v.title.$touch()" placeholder="Ünvan" />
							<template v-if="$v.title.$error">
								<small v-if="!$v.title.required || !$v.title.validTitle" class="form-text text-danger">Ünvan boş geçilemez.</small>
							</template>
						</b-form-group>
						<b-form-group label="Adres">
							<b-input v-model="address" @blur="$v.address.$touch()" placeholder="Cadde/Mahalle" />
							<template v-if="$v.address.$error">
								<small v-if="!$v.address.required || !$v.address.validAddress" class="form-text text-danger">Adres boş geçilemez.</small>
							</template>
						</b-form-group>
						<b-form-row>
							<b-form-group label="İl" class="col-md-6">
								<b-select v-model="province" @blur="$v.province.$touch()">
									<option value="" disabled>İl seçiniz</option>
									<option v-for="(p, index) in provinces" :value="index" :key="index">{{ index }}</option>
								</b-select>
								<template v-if="$v.province.$error">
									<small v-if="!$v.province.required" class="form-text text-danger">İl boş geçilemez.</small>
								</template>
							</b-form-group>
							<b-form-group label="İlçe" class="col-md-6">
								<b-select v-model="district" @blur="$v.district.$touch()" :disabled="!province">
									<option value="" disabled>İlçe seçiniz</option>
									<option v-for="(d, index) in provinces[province]" :key="index">{{ d }}</option>
								</b-select>
								<template v-if="$v.district.$error">
									<small v-if="!$v.district.required" class="form-text text-danger">İlçe boş geçilemez.</small>
								</template>
							</b-form-group>
						</b-form-row>
						<b-form-group label="Notlar">
							<b-textarea v-model="notes" placeholder="Notlar" :rows="4" :max-rows="6" />
						</b-form-group>
					</b-form>
				</b-card>
			</tab-content>
			<tab-content icon="ion ion-md-person" title="Yetkililer">
				<b-card header="Yetkililer" header-tag="h6" class="mb-3">
					<b-form class="mb-3">
						<b-form-row>
							<b-form-group label="Ad" class="col-md-6">
								<b-input v-model="contactName" @blur="$v.contactName.$touch()" placeholder="Ad" />
								<template v-if="$v.contactName.$error">
									<small v-if="!$v.contactName.required || !$v.contactName.validContactName" class="form-text text-danger">Ad boş geçilemez.</small>
								</template>
							</b-form-group>
							<b-form-group label="Soyad" class="col-md-6">
								<b-input v-model="contactLastName" @blur="$v.contactLastName.$touch()" placeholder="Soyad" />
								<template v-if="$v.contactLastName.$error">
									<small v-if="!$v.contactLastName.required || !$v.contactLastName.validContactLastName" class="form-text text-danger">Soyad boş geçilemez.</small>
								</template>
							</b-form-group>
						</b-form-row>
						<b-form-group label="Ünvan">
							<b-input v-model="contactTitle" placeholder="Ünvan" />
						</b-form-group>
						<b-form-group label="Departman">
							<b-input v-model="contactDepartment" placeholder="Departman" />
						</b-form-group>
						<b-form-row>
							<b-form-group label="Sabit Telefon" class="col-md-4">
								<masked-input v-model="contactPhone" @blur="$v.contactPhone.$touch()" type="text" class="form-control" placeholder="Sabit Telefon" :mask="phoneMask" />
							</b-form-group>
							<b-form-group label="Cep Telefonu" class="col-md-4">
								<masked-input v-model="contactCellPhone" @blur="$v.contactCellPhone.$touch()" type="text" class="form-control" placeholder="Cep Telefonu" :mask="phoneMask" />
								<template v-if="$v.contactCellPhone.$error">
									<small v-if="!$v.contactCellPhone.required || !$v.contactCellPhone.validContactCellPhone" class="form-text text-danger">Cep telefonu boş geçilemez.</small>
								</template>
							</b-form-group>
							<b-form-group label="E-Posta" class="col-md-4">
								<masked-input v-model="contactEmail" @blur="$v.contactEmail.$touch()" type="text" class="form-control" placeholder="E-Posta" :mask="emailMask" />
								<template v-if="$v.contactEmail.$error">
									<small v-if="!$v.contactEmail.required" class="form-text text-danger">E-Posta boş geçilemez.</small>
									<small v-if="!$v.contactEmail.email" class="form-text text-danger">Lütfen geçerli bir mail adresi giriniz.</small>
								</template>
							</b-form-group>
						</b-form-row>
						<div v-if="editMode">
							<b-btn class="btn btn-block" @click="updateClientContactList" variant="primary">Yetkiliyi Güncelle</b-btn>
							<b-btn class="btn btn-block" @click.prevent="closeEditing()" variant="secondary">İptal</b-btn>
						</div>
						<b-btn class="btn-block" v-if="!editMode" @click="addClientContactList" variant="primary">Yetkili Ekle</b-btn>
					</b-form>
					<v-client-table :data="clientContacts" :columns="columns" :options="tableOptions">
						<template slot="edit" slot-scope="props">
							<div>
								<b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="editContact(props.index - 1, props.row)"><i class="ion ion-md-create"></i></b-btn>
								<b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="removeContact(props.index - 1)"><i class="ion ion-md-close"></i></b-btn>
							</div>
						</template>
					</v-client-table>
				</b-card>
			</tab-content>
			<b-btn variant="default" slot="prev">Geri</b-btn>
			<b-btn variant="default" slot="next">İleri</b-btn>
			<b-btn variant="primary" @click="addClient" slot="finish">Tamamla</b-btn>
		</form-wizard>
		<sweet-modal v-on:close="modalClosing" ref="successModal" icon="success" :hide-close-button="true">
			<h4 class="font-weight-bold">Müşteri Başarıyla Eklendi.</h4>
			<div>
				<small style="cursor: pointer;" v-on:click="refreshPage">Yeni bir müşteri eklemek için <span class="font-weight-bold">buraya</span> tıklayınız.</small>
			</div>
			<div>
				<small style="cursor: pointer;" v-on:click="navigateToAddContract">{{ title }} ünvanlı müşteriye sözleşme eklemek için <span class="font-weight-bold">buraya</span> tıklayınız.</small>
			</div>
		</sweet-modal>
	</div>
</template>

<style src="@/vendor/libs/vue-form-wizard/vue-form-wizard.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-data-tables/vue-data-tables.scss" lang="scss"></style>

<script>
import * as textMaskAddons from "text-mask-addons/dist/textMaskAddons";
import MaskedInput from "vue-text-mask";
import { FormWizard, TabContent, WizardStep } from "vue-form-wizard";
import { ClientTable } from "vue-tables-2";
import { required, email } from "vuelidate/lib/validators";
import Vue from "vue";
import { mapGetters } from "vuex";
import { SweetModal } from "sweet-modal-vue";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

Vue.use(ClientTable);

export default {
	name: "clients-add",
	metaInfo: {
		title: "Müşteri Ekle"
	},
	props: ["clientId"],
	components: {
		FormWizard,
		TabContent,
		WizardStep,
		MaskedInput,
		SweetModal,
		Loading
	},
	data: () => ({
		isLoading: false,
		isModalClosing: false,
		clientEditMode: false,
		pageTitle: "Müşteri Ekle",
		provinces: [],
		clientContacts: [],
		clientContactsToDelete: [],
		updateIndex: "",
		currentCode: "",
		title: "",
		address: "",
		province: "",
		district: "",
		notes: "",
		contactName: "",
		contactLastName: "",
		contactTitle: "",
		contactDepartment: "",
		contactPhone: "",
		contactCellPhone: "",
		contactEmail: "",
		editMode: false,
		emailMask: textMaskAddons.emailMask,
		phoneMask: ["(", /[1-9]/, /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/],
		columns: ["firstName", "lastName", "title", "department", "internalNumber", "phoneNumber", "mailAddress", "edit"],
		tableOptions: {
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
				mailAddress: "E-Posta",
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
				page: "Sayfa:",
				noResults: "Eşleşen kayıt bulunamadı",
				loading: "Yükleniyor..."
			}
		}
	}),
	validations: {
		title: {
			required,
			validTitle: title => {
				return /^(?!\s*$).+/.test(title);
			}
		},
		address: {
			required,
			validAddress: address => {
				return /^(?!\s*$).+/.test(address);
			}
		},
		province: { required },
		district: { required },
		contactName: {
			required,
			validContactName: contactName => {
				return /^(?!\s*$).+/.test(contactName);
			}
		},
		contactLastName: {
			required,
			validContactLastName: contactLastName => {
				return /^(?!\s*$).+/.test(contactLastName);
			}
		},
		contactCellPhone: {
			required,
			validContactCellPhone: contactCellPhone => {
				return contactCellPhone.replace(/[^0-9]/g, "").length == 10;
			}
		},
		contactEmail: { required, email }
	},
	computed: {
		...mapGetters({
			clientErrorMessage: "client/errorMessage",
			clientErrorCode: "client/errorCode",
			clientResponse: "client/response",
			clientStatus: "client/status",
			clientContactErrorMessage: "clientContact/errorMessage",
			clientContactErrorCode: "clientContact/errorCode",
			clientContactResponse: "clientContact/response",
			clientContactStatus: "clientContact/status"
		})
	},
	watch: {
		clientStatus(status) {
			if (status == "loading") this.isLoading = true;
			else this.isLoading = false;
		},
		clientContactStatus(status) {
			if (status == "loading") this.isLoading = true;
			else this.isLoading = false;
		}
	},
	created() {
		if (this.clientId) {
			this.clientEditMode = true;
			this.pageTitle = "Müşteri Düzenle";
			this.getClient(this.clientId);
		}
		this.getLocations();
	},
	methods: {
		async getClient(clientId) {
			await this.$store.dispatch("client/GetOne", clientId);
			if (this.clientResponse != null) {
				if (this.clientResponse.data.success) {
					this.fillForms(this.clientResponse.data.data);
				} else this.notify("error", "Hata", this.clientResponse.data.message);
			} else this.notify("error", "Hata", this.clientErrorMessage);
		},
		async addClient() {
			if (this.validateFirstStep()) {
				if (!this.clientEditMode) {
					await this.$store.dispatch("client/Add", {
						currentCode: this.currentCode.trim(),
						title: this.title.trim(),
						address: this.address.trim(),
						province: this.province,
						district: this.district,
						note: this.notes.trim()
					});
				} else {
					await this.$store.dispatch("client/Update", {
						id: this.clientId,
						client: {
							currentCode: this.currentCode.trim(),
							title: this.title.trim(),
							address: this.address.trim(),
							province: this.province,
							district: this.district,
							note: this.notes.trim()
						}
					});
				}
				if (this.clientResponse != null) {
					if (this.clientResponse.data.success) {
						this.addClientContact(this.clientResponse.data.data.id);
					} else this.notify("error", "Hata", this.clientResponse.data.message);
				} else this.notify("error", "Hata", this.clientErrorMessage);
			}
		},
		async addClientContact(clientId) {
			if (this.clientContactsToDelete.length > 0) {
				this.clientContactsToDelete.forEach(async contactId => {
					await this.$store.dispatch("clientContact/Delete", contactId);
					if (this.clientContactResponse != null) {
						if (!this.clientContactResponse.status == 204) this.notify("error", "Hata", this.clientContactResponse.data.message);
					} else this.notify("error", "Hata", this.clientContactErrorMessage);
				});
			}
			this.clientContacts.forEach(async contact => {
				if (!contact.id) {
					await this.$store.dispatch("clientContact/Add", {
						clientId: clientId,
						firstName: contact.firstName,
						lastName: contact.lastName,
						title: contact.title,
						department: contact.department,
						internalNumber: contact.internalNumber,
						phoneNumber: contact.phoneNumber,
						mailAddress: contact.mailAddress
					});
				} else {
					await this.$store.dispatch("clientContact/Update", {
						clientId: clientId,
						id: contact.id,
						firstName: contact.firstName,
						lastName: contact.lastName,
						title: contact.title,
						department: contact.department,
						internalNumber: contact.internalNumber,
						phoneNumber: contact.phoneNumber,
						mailAddress: contact.mailAddress
					});
				}
				if (this.clientContactResponse != null) {
					if (this.clientContactResponse.data.success) contact.id = this.clientContactResponse.data.data.id;
					else this.notify("error", "Hata", this.clientContactResponse.data.message);
				} else this.notify("error", "Hata", this.clientContactErrorMessage);
			});
			if (this.clientEditMode) {
				this.notify("success", "Başarılı", "Müşteri başarıyla güncellendi.");
				await this.sleep(1000);
				this.$router.push({ name: "listClients" });
			} else this.showModal();
		},
		async fillForms(client) {
			await this.$store.dispatch("clientContact/Get", client.id);
			if (this.clientContactResponse != null) {
				if (this.clientContactResponse.data.success) this.clientContacts = this.clientContactResponse.data.data;
				else this.notify("error", "Hata", this.clientContactResponse.data.message);
			} else if (this.clientContactErrorCode != 404) this.notify("error", "Hata", this.clientContactErrorMessage);
			this.currentCode = client.currentCode;
			this.title = client.title;
			this.address = client.address;
			this.province = client.province;
			this.district = client.district;
			this.notes = client.note;
		},
		getLocations() {
			const req = new XMLHttpRequest();
			req.open("GET", `${this.publicUrl}json/locations.json`);
			req.onload = () => {
				this.provinces = JSON.parse(req.response);
			};
			req.send();
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
			if (!this.isModalClosing) this.$router.push({ name: "listClients" });
		},
		refreshPage() {
			this.isModalClosing = true;
			this.$refs.successModal.close();
			this.$router.go(0);
		},
		navigateToAddContract() {
			this.isModalClosing = true;
			this.$refs.successModal.close();
			this.$router.push({ name: "addContract", params: { clientId: this.clientResponse.data.data.id } });
		},
		touchClientContact() {
			this.$v.contactName.$touch();
			this.$v.contactLastName.$touch();
			this.$v.contactCellPhone.$touch();
			this.$v.contactEmail.$touch();
		},
		validateFirstStep() {
			this.$v.title.$touch();
			this.$v.address.$touch();
			this.$v.province.$touch();
			this.$v.district.$touch();
			if (!this.$v.title.$invalid && !this.$v.address.$invalid && !this.$v.province.$invalid && !this.$v.district.$invalid) return true;
			else return false;
		},
		removeContact(index) {
			if (this.clientEditMode) {
				let idToRemove = this.clientContacts[index].id;
				this.clientContactsToDelete.push(idToRemove);
			}
			this.clientContacts.splice(index, 1);
			this.clearClientContactList();
		},
		editContact(index, row) {
			this.contactName = row.firstName;
			this.contactLastName = row.lastName;
			this.contactTitle = row.title;
			this.contactDepartment = row.department;
			this.contactPhone = row.internalNumber;
			this.contactCellPhone = row.phoneNumber;
			this.contactEmail = row.mailAddress;
			this.editMode = true;
			this.updateIndex = index;
		},
		updateClientContactList() {
			this.touchClientContact();
			if (!this.$v.contactName.$invalid && !this.$v.contactLastName.$invalid && !this.$v.contactCellPhone.$invalid && !this.$v.contactEmail.$invalid) {
				this.clientContacts[this.updateIndex].firstName = this.contactName.trim();
				this.clientContacts[this.updateIndex].lastName = this.contactLastName.trim();
				this.clientContacts[this.updateIndex].title = this.contactTitle.trim();
				this.clientContacts[this.updateIndex].department = this.contactDepartment.trim();
				this.clientContacts[this.updateIndex].internalNumber = this.contactPhone;
				this.clientContacts[this.updateIndex].phoneNumber = this.contactCellPhone;
				this.clientContacts[this.updateIndex].mailAddress = this.contactEmail;
				this.clearClientContactList();
			}
		},
		addClientContactList() {
			this.touchClientContact();
			if (!this.$v.contactName.$invalid && !this.$v.contactLastName.$invalid && !this.$v.contactCellPhone.$invalid && !this.$v.contactEmail.$invalid) {
				var contact = { firstName: this.contactName.trim(), lastName: this.contactLastName.trim(), title: this.contactTitle.trim(), department: this.contactDepartment.trim(), internalNumber: this.contactPhone, phoneNumber: this.contactCellPhone, mailAddress: this.contactEmail };
				this.clientContacts.push(contact);
				this.clearClientContactList();
			}
		},
		clearClientContactList() {
			this.$v.$reset();
			this.contactName = "";
			this.contactLastName = "";
			this.contactTitle = "";
			this.contactDepartment = "";
			this.contactPhone = "";
			this.contactCellPhone = "";
			this.contactEmail = "";
			this.editMode = false;
			this.updateIndex = "";
		},
		closeEditing() {
			this.clearClientContactList();
		},
		sleep(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		}
	}
};
</script>
