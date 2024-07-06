<template>
    <div class="temperature-chart">
        <h2 class="chart-title">Temperature Chart</h2>
        <canvas :id="chartId"></canvas>
    </div>
</template>

<script>
import { onMounted, watch, ref } from 'vue'
import Chart from 'chart.js/auto'
import { v4 as uuidv4 } from 'uuid'

export default {
    name: 'TemperatureChart',
    props: {
        hourlyData: {
            type: Array,
            required: true
        }
    },
    setup(props) {
        const chart = ref(null)
        const chartId = ref(uuidv4())

        const renderChart = () => {
            const ctx = document.getElementById(chartId.value).getContext('2d')
            chart.value = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: props.hourlyData.map((item) => item.time),
                    datasets: [
                        {
                            label: 'Temperature',
                            data: props.hourlyData.map((item) => item.temperature),
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        }
                    ]
                }
            })
        }

        onMounted(() => {
            if (props.hourlyData.length) {
                renderChart()
            }
        })

        watch(props.hourlyData, (newData) => {
            if (chart.value) {
                chart.value.destroy()
            }
            if (newData.length) {
                renderChart()
            }
        })

        return {
            chartId
        }
    }
}
</script>

<style scoped>
.temperature-chart {
    width: 100%;
    max-width: 600px;
    margin: auto;
}

.chart-title {
    padding: 20px 0;
}
</style>
