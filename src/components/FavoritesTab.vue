<template>
    <div>
        <div v-for="block in favoriteCityBlocks" :key="block.id" class="favorite-city">
            <WeatherCard
                :city="block.city"
                :block="block"
                :viewMode="block.viewMode"
                tab="favorite"
                @toggle-day-night="toggleDayNightMode(block.id)"
            />
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import WeatherCard from './WeatherCard.vue'
import { useWeatherStore } from '../stores/weather'

export default {
    name: 'FavoritesTab',
    components: {
        WeatherCard
    },
    setup() {
        const weatherStore = useWeatherStore()
        const favoriteCityBlocks = computed(() => weatherStore.favoriteCities)
        const selectedCity = ref(null)

        onMounted(() => {
            weatherStore.loadFromLocalStorage()
        })

        const toggleDayNightMode = (id) => {
            const block = favoriteCityBlocks.value.find((block) => block.id === id)
            if (block) {
                block.viewMode = block.viewMode === 'day' ? '5days' : 'day'
            }
        }

        return {
            favoriteCityBlocks,
            selectedCity,
            toggleDayNightMode
        }
    }
}
</script>

<style scoped>
.favorite-city {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
}
</style>
