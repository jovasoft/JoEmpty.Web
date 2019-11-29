<template>
	<div>
		<h4 class="font-weight-bold py-3 mb-3"><span class="text-muted font-weight-light">Müşteriler /</span> Müşteri Listesi</h4>
		<hr class="container-m-nx border-light mt-0 mb-3" />
		<v-client-table ref="clientTable" :data="clients" :columns="columns" :options="options">
			<template slot="edit" slot-scope="props">
				<div>
					<b-btn variant="outline-success borderless icon-btn" class="btn-xs" @click.prevent="edit(props.row)"><i class="ion ion-md-create"></i></b-btn>
					<b-btn variant="outline-danger borderless icon-btn" class="btn-xs" @click.prevent="remove(props.row)"><i class="ion ion-md-close"></i></b-btn>
				</div>
			</template>
		</v-client-table>
	</div>
</template>

<style src="@/vendor/libs/vue-data-tables/vue-data-tables.scss" lang="scss"></style>

<script>
import Vue from "vue";
import { ClientTable } from "vue-tables-2";
import { mapGetters } from "vuex";

Vue.use(ClientTable);

export default {
	name: "clients-list",
	metaInfo: {
		title: "Müşteri Listesi"
	},
	computed: {
		...mapGetters({
			errorMessage: "client/errorMessage",
			errorCode: "client/errorCode",
			response: "client/response"
		})
	},
	methods: {
		async remove(row) {
			await this.$store.dispatch("client/Delete", row.id);
			if (this.response != null) {
				if (this.response.status == 204) {
					this.notify("success", "Başarılı", "Müşteri başarıyla silindi.");
					var indexToDelete = this.clients
						.map(x => {
							return x.id;
						})
						.indexOf(row.id);
					this.clients.splice(indexToDelete, 1);
				} else this.notify("error", "Hata", this.response.data.message);
			} else this.notify("error", "Hata", this.errorMessage);
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
		edit(row) {
			this.$router.push({ name: "addClients", params: { clientId: row.id } });
		}
	},
	data: () => ({
		clients: [],
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
	async created() {
		await this.$store.dispatch("client/Get");
		if (this.response != null) {
			if (this.response.data.success) {
				this.clients = this.response.data.data;
			} else this.notify("error", "Hata", this.response.data.message);
		} else this.notify("error", "Hata", this.errorMessage);
	}
};
</script>
