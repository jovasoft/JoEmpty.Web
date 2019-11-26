<template>
	<div>
		<h4 class="font-weight-bold py-3 mb-3"><span class="text-muted font-weight-light">Sözleşmeler /</span> Sözleşme Listesi</h4>
		<hr class="container-m-nx border-light mt-0 mb-3" />
		<v-client-table :data="tableData" :options="options" :columns="columns">
			<template slot="beforeFilter">
				<b-form inline class="mr-3">
					<label class="mr-2">Müşteri:</label>
					<b-select :options="['Yakup', 'Melih', 'Çakır']" />
				</b-form>
			</template>
			<template slot="Düzenle">
				<div>
					<b-btn variant="outline-success borderless icon-btn" class="btn-xs"><i class="ion ion-md-create"></i></b-btn>
					<b-btn variant="outline-danger borderless icon-btn" class="btn-xs"><i class="ion ion-md-close"></i></b-btn>
				</div>
			</template>
		</v-client-table>
	</div>
</template>

<style src="@/vendor/libs/vue-data-tables/vue-data-tables.scss" lang="scss"></style>

<script>
import { ClientTable } from "vue-tables-2";
import Vue from "vue";

Vue.use(ClientTable);

export default {
	name: "contracts-list",
	metaInfo: {
		title: "Sözleşme Listesi"
	},
	data: () => ({
		tableData: [],
		columns: ["Sözleşme Kodu", "Tutar", "Sarf Malzeme", "Tesis Sayısı", "Başlangıç Tarihi", "Bitiş Tarihi"],
		options: {
			filterable: true,
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
	})
};
</script>
