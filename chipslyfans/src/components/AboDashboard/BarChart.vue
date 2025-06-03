<template>
    <Bar :data="data" :options="options" />
</template>

<script setup>
import { Bar } from 'vue-chartjs'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
        label: 'Subscribers',
        data: [48, 60, 72, 85, 70, 65, 50],
        backgroundColor: '#3b82f6',
        borderRadius: 4,
    }]
}

const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: { beginAtZero: true }
    },
    plugins: {
        legend: { display: false }
    }
}
</script>

<style scoped>
:deep(canvas) {
    height: 200px !important;
}
</style>
