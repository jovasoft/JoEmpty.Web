<template>
	<div>
		<h4 class="font-weight-bold py-3 mb-3"><span class="text-muted font-weight-light">Müşteriler /</span> Müşteri Listesi</h4>
		<hr class="container-m-nx border-light mt-0 mb-3" />
		<v-client-table :data="tableData" :columns="columns" :options="options">
			<template slot="düzenle" slot-scope="props">
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

Vue.use(ClientTable);

export default {
	name: "clients-list",
	metaInfo: {
		title: "Müşteri Listesi"
	},
	data: () => ({
		tableData: [],
		columns: ["Cari Kodu", "Ünvanı", "İl", "İlçe", "Yetkili Adı", "Yetkili Ünvanı", "düzenle"],
		options: {
			perPage: 10,
			perPageValues: [],
			pagination: { chunk: 5 },
			showChildRowToggler: false,
			sortIcon: {
				is: "fa-sort",
				base: "fas",
				up: "fa-sort-up",
				down: "fa-sort-down"
			},
			texts: {
				count: "{count} kayıttan {from} ile {to} arasındakiler gösteriliyor|{count} records|One record",
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
	created() {
		const req = new XMLHttpRequest();
		req.open("GET", `${this.publicUrl}json/table-new-data.json`);
		req.onload = () => {
			const data = JSON.parse(req.response);

			this.tableData = data.map((item, index) => {
				item["id"] = index;
				return item;
			});
		};

		req.send();
	}
};
</script>
