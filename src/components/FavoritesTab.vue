<template>
    <div>
        <div v-if="!favoriteCityBlocks.length" class="empty-favorites">
            {{ $t('favoritesTab.emptyTitle') }}
        </div>
        <div v-for="block in favoriteCityBlocks" :key="block.id" class="favorite-city">
            <WeatherCard
                :city="block.city"
                :block="block"
                :viewMode="block.viewMode"
                tab="favorite"
                @toggle-day-night="toggleDayNightMode(block.id)"
            />
        </div>
        <WeatherPreloader :isLoading="isLoading" />
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import WeatherCard from './WeatherCard.vue'
import { useWeatherStore } from '../stores/weather'
import WeatherPreloader from './WeatherPreloader.vue'

export default {
    name: 'FavoritesTab',
    components: {
        WeatherCard,
        WeatherPreloader
    },
    setup() {
        const { t } = useI18n()
        const weatherStore = useWeatherStore()
        const favoriteCityBlocks = computed(() => weatherStore.favoriteCities)
        const isLoading = ref(false)

        onMounted(async () => {
            isLoading.value = true
            await weatherStore.loadFromLocalStorage()
            isLoading.value = false
        })

        const toggleDayNightMode = (id) => {
            const block = favoriteCityBlocks.value.find((block) => block.id === id)
            if (block) {
                block.viewMode = block.viewMode === 'day' ? '5days' : 'day'
            }
        }

        return {
            t,
            favoriteCityBlocks,
            toggleDayNightMode,
            isLoading
        }
    }
}
</script>

<style scoped>
.empty-favorites {
    min-height: 160px;
    width: 100%;
    position: relative;
    background-color: white;
    border-radius: 8px;
    border: 1px solid #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
}

.favorite-city {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: white;
}

.preloader {
    text-align: center;
    margin-top: 20px;
    font-size: 18px;
    color: #666;
}

@media (max-width: 768px) {
    .empty-favorites {
        font-size: 16px;
    }
}
</style>
