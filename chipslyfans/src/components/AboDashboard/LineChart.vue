<template>
    <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md w-full">
        <Line :data="data" :options="options" />
    </div>
</template>

<script setup>
import { Line } from 'vue-chartjs'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
        label: 'Earnings',
        data: [120, 220, 310, 260, 430, 380, 470],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: '#3b82f6',
    }]
}

const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: { beginAtZero: true }
    },
    plugins: {
        legend: { display: false },
    }
}
</script>

<style scoped>
:deep(canvas) {
    height: 100% !important;
}
</style>
