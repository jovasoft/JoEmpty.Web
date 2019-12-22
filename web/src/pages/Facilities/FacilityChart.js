import { Doughnut, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;
export default {
	extends: Doughnut,
	mixins: [reactiveProp],
	props: ["options"],
	mounted() {
		this.renderChart(this.chartData, {
			scales: {
				xAxes: [
					{
						display: false
					}
				],
				yAxes: [
					{
						display: false
					}
				]
			},
			legend: {
				display: false
			},
			tooltips: {
				enabled: false
			},
			cutoutPercentage: 94,
			responsive: true,
			maintainAspectRatio: false
		});
	}
};
