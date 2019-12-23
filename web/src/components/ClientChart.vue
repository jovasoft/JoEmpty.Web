<template>
	<div class="row">
		<div class="col-md-12">
			<b-card no-body class="mb-4">
				<b-card-header header-tag="h6" class="bg-info text-white"> <i class="ion ion-md-business"></i>&nbsp; Tesisler </b-card-header>
				<div class="bg-info text-white">
					<div class="d-flex align-items-center position-relative mt-4" style="height:140px;">
						<facility-chart ref="facilityChart" :chart-data="facilityChartData" class="w-100 position-absolute" :height="140" style="top:0" />
						<div class="w-100 text-center text-xlarge">{{ this.facilityPercent }} %</div>
					</div>
					<div class="text-center mt-3 mb-4"></div>
				</div>
				<b-card-footer class="border-0 text-center py-3">
					<div class="row">
						<div class="col">
							<div class="text-muted small mb-1">Hedef</div>
							<strong class="text-big" v-if="this.facilityTarget">{{ this.facilityTarget }}</strong>
							<strong class="text-big" v-else>0</strong>
						</div>
						<div class="col">
							<div class="text-muted small mb-1">Mevcut</div>
							<strong class="text-big">{{ this.totalFacilityCount }}</strong>
						</div>
					</div>
				</b-card-footer>
				<b-card-footer class="border-0 text-center py-3">
					<b-input @keypress="onlyNumber" v-model="facilityTarget" placeholder="Hedeflenen Tesis Sayısı" />
				</b-card-footer>
			</b-card>
		</div>
		<div class="col-md-12">
			<b-card no-body class="mb-4">
				<b-card-header header-tag="h6" class="with-elements">
					<div class="card-header-title">Bitiş Tarihi Yaklaşan Sözleşmeler</div>
				</b-card-header>
				<div class="table-responsive">
					<table class="table card-table m-0">
						<tbody>
							<tr>
								<td class="border-top-1 text-nowrap align-middle">
									<a class="text-body">1 Hafta</a>
								</td>
								<td class="w-100 border-top-1 align-middle">
									<div class="progress" style="height: 4px;">
										<div class="progress-bar bg-error" :style="{ width: ((this.oneWeekToExpire / this.totalContractCount) * 100).toFixed(2) + '%' }"></div>
									</div>
								</td>
								<td class="border-top-1 text-nowrap align-middle">
									{{ this.oneWeekToExpire }}&nbsp;
									<span class="text-muted small">{{ ((this.oneWeekToExpire / this.totalContractCount) * 100).toFixed(2) }}%</span>
								</td>
							</tr>

							<tr>
								<td class="border-top-1 text-nowrap align-middle">
									<a class="text-body">1 Ay</a>
								</td>
								<td class="w-100 border-top-1 align-middle">
									<div class="progress" style="height: 4px;">
										<div class="progress-bar bg-warning" :style="{ width: ((this.oneMonthToExpire / this.totalContractCount) * 100).toFixed(2) + '%' }"></div>
									</div>
								</td>
								<td class="border-top-1 text-nowrap align-middle">
									{{ this.oneMonthToExpire }}&nbsp;
									<span class="text-muted small">{{ ((this.oneMonthToExpire / this.totalContractCount) * 100).toFixed(2) }}%</span>
								</td>
							</tr>

							<tr>
								<td class="border-top-1 text-nowrap align-middle">
									<a class="text-body">2 Ay</a>
								</td>
								<td class="w-100 border-top-1 align-middle">
									<div class="progress" style="height: 4px;">
										<div class="progress-bar bg-success" :style="{ width: ((this.twoMonthToExpire / this.totalContractCount) * 100).toFixed(2) + '%' }"></div>
									</div>
								</td>
								<td class="border-top-1 text-nowrap align-middle">
									{{ this.twoMonthToExpire }}&nbsp;
									<span class="text-muted small">{{ ((this.twoMonthToExpire / this.totalContractCount) * 100).toFixed(2) }}%</span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<b-card-footer header-tag="h6" class="with-elements">
					<div class="card-footer-title">Toplam Sözleşme: {{ this.totalContractCount }}</div>
				</b-card-footer>
			</b-card>
		</div>
	</div>
</template>

<script>
import FacilityChart from "./FacilityChart";
import { mapGetters } from "vuex";

export default {
	components: {
		FacilityChart
	},
	data: () => ({
		oneWeekToExpire: "",
		oneMonthToExpire: "",
		twoMonthToExpire: "",
		totalContractCount: "",
		totalFacilityCount: "",
		facilityPercent: "100",
		facilityTarget: "",
		facilityChartData: {
			datasets: [
				{
					data: [100, 0],
					backgroundColor: ["#fff", "rgba(255,255,255,0.3)"],
					hoverBackgroundColor: ["#fff", "rgba(255,255,255,0.3)"],
					borderWidth: 0
				}
			]
		}
	}),
	computed: {
		...mapGetters({
			facilityErrorMessage: "facility/errorMessage",
			facilityErrorCode: "facility/errorCode",
			facilityResponse: "facility/response",
			facilityStatus: "facility/status",
			contractErrorMessage: "contract/errorMessage",
			contractErrorCode: "contract/errorCode",
			contractResponse: "contract/response",
			contractStatus: "contract/status"
		})
	},
	async created() {
		await this.getTotalFacilityCount();
		await this.getExpiringContracts();
	},
	watch: {
		facilityTarget(newTarget) {
			if (newTarget < this.totalFacilityCount) {
				this.facilityPercent = 100;
			} else this.facilityPercent = ((this.totalFacilityCount / newTarget) * 100).toFixed(2);
			this.facilityChartData = {
				datasets: [
					{
						data: [this.facilityPercent, 100 - this.facilityPercent],
						backgroundColor: ["#fff", "rgba(255,255,255,0.3)"],
						hoverBackgroundColor: ["#fff", "rgba(255,255,255,0.3)"],
						borderWidth: 0
					}
				]
			};
		}
	},
	methods: {
		async getTotalFacilityCount() {
			await this.$store.dispatch("facility/GetTotalCount");
			if (this.facilityResponse != null) {
				if (this.facilityResponse.data.success) this.totalFacilityCount = this.facilityResponse.data.data.total;
				else this.totalFacilityCount = "";
			} else {
				if (this.facilityErrorCode != 404) this.totalFacilityCount = "";
			}
		},
		async getExpiringContracts() {
			await this.$store.dispatch("contract/GetExpiringContracts");
			if (this.contractResponse != null) {
				if (this.contractResponse.data.success) {
					this.oneWeekToExpire = this.contractResponse.data.data.oneWeek;
					this.oneMonthToExpire = this.contractResponse.data.data.oneMonth;
					this.twoMonthToExpire = this.contractResponse.data.data.twoMonth;
					this.totalContractCount = this.contractResponse.data.data.total;
				} else {
					this.oneWeekToExpire = "";
					this.oneMonthToExpire = "";
					this.twoMonthToExpire = "";
					this.totalContractCount = "";
				}
			} else {
				if (this.facilityErrorCode != 404) {
					this.oneWeekToExpire = "";
					this.oneMonthToExpire = "";
					this.twoMonthToExpire = "";
					this.totalContractCount = "";
				}
			}
		},
		onlyNumber($event) {
			let keyCode = $event.keyCode;
			if ((keyCode < 48 || keyCode > 57) && keyCode !== 13) $event.preventDefault();
		}
	}
};
</script>
