<template>
    <div class="flex flex-col items-center">
        <Doughnut :data="data" :options="options" class="w-32 h-32" />
        <p class="text-2xl font-bold text-gray-900 dark:text-white mt-2">{{ value }}%</p>
    </div>
</template>

<script setup>
import { Doughnut } from 'vue-chartjs'
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
    value: Number
})

const data = {
    labels: ['Renewed', 'Other'],
    datasets: [{
        data: [props.value, 100 - props.value],
        backgroundColor: ['#3b82f6', '#d1d5db'],
        borderWidth: 0
    }]
}

const options = {
    cutout: '70%',
    plugins: {
        legend: { display: false }
    }
}
</script>
