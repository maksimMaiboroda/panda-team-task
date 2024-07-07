<template>
    <div class="weather-blocks">
        <WeatherPreloader :isLoading="isLoading" />
        <div
            v-for="block in weatherBlocks"
            :key="block.id"
            :class="{ 'weather-block': true, 'favorite-block': isFavoriteBlock(block) }"
        >
            <h2>{{ $t('weatherBlocks.title') }} {{ block.name }}</h2>
            <CityAutocomplete
                @city-selected="setBlockCity(block.id, $event)"
                v-model="block.city"
                :key="'autocomplete-' + block.id"
            />
            <div v-if="block.city">
                <WeatherCard
                    :city="block.city"
                    :block="block"
                    :viewMode="block.viewMode"
                    tab="weather"
                    @toggle-day-night="toggleDayNightMode(block.id)"
                />
            </div>
            <button
                v-if="weatherBlocks.length > 1"
                @click="confirmRemoveBlock(block.id)"
                class="remove-button"
            >
                {{ $t('weatherBlocks.removeBlockButton') }}
            </button>
        </div>
        <button v-if="weatherBlocks.length < 5" @click="addBlock" class="add-button">+</button>
        <ConfirmModal
            v-if="isModalVisible"
            :title="$t('confirmModal.title')"
            :message="$t('confirmModal.message')"
            @close="isModalVisible = false"
            :onConfirm="removeBlock"
        />
    </div>
</template>

<script>
import { defineComponent, ref, onMounted, computed, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWeatherStore } from '../stores/weather'
import {
    fetchHourlyForecast,
    fetch5DayForecast,
    fetchCityWeatherByName
} from '../services/ForecastService'
import { getCityByIP } from '../services/geolocation'
import CityAutocomplete from './CityAutocomplete.vue'
import WeatherCard from './WeatherCard.vue'
import ConfirmModal from './ConfirmModal.vue'
import WeatherPreloader from './WeatherPreloader.vue'

export default defineComponent({
    name: 'WeatherBlocks',
    components: {
        CityAutocomplete,
        WeatherCard,
        ConfirmModal,
        WeatherPreloader
    },
    setup() {
        const { t, locale } = useI18n()
        const weatherStore = useWeatherStore()
        const isModalVisible = ref(false)
        const selectedBlockId = ref(null)
        const weatherBlocks = ref(weatherStore.weatherBlocks)
        const isLoading = ref(false)
        const currentLocal = computed(() => weatherStore.getCurrentLocale())

        const isFavoriteBlock = computed(() => {
            const favoriteCityIds = new Set(
                weatherStore.favoriteCities.map((favBlock) => favBlock.city.id)
            )
            return (block) => favoriteCityIds.has(block.city?.id)
        })

        onMounted(() => {
            weatherStore.loadFromLocalStorage()
        })

        watchEffect(async () => {
            if (currentLocal.value) {
                locale.value = currentLocal.value
                await fetchDefaultCity()
            }
        })

        async function fetchDefaultCity() {
            const cityName = await getCityByIP()
            const isBlockExist = weatherBlocks.value.find((block) => block.city?.name === cityName)

            if (!isBlockExist) {
                const defaultBlockId = weatherBlocks.value[0].id

                if (cityName) {
                    isLoading.value = true
                    try {
                        const fetchedCity = await fetchCityWeatherByName(cityName, locale.value)
                        setBlockCity(defaultBlockId, fetchedCity)
                    } finally {
                        isLoading.value = false
                    }
                }
            }
        }

        const setBlockCity = async (id, city) => {
            isLoading.value = true
            try {
                const block = weatherBlocks.value.find((block) => block.id === id)
                if (block) {
                    block.city = city
                    await fetchWeather(weatherBlocks.value.indexOf(block))
                }
            } finally {
                isLoading.value = false
            }
        }

        const fetchWeather = async (index) => {
            try {
                await fetchBlockHourlyData(index)
                await fetchBlock5DayForecast(index)
            } catch (error) {
                console.error('Error fetching weather data for block:', error)
            }
        }

        const fetchBlockHourlyData = async (index) => {
            try {
                weatherBlocks.value[index].hourlyData = await fetchHourlyForecast(
                    weatherBlocks.value[index].city.name,
                    locale.value
                )
            } catch (error) {
                console.error('Error fetching hourly forecast for block:', error)
            }
        }

        const fetchBlock5DayForecast = async (index) => {
            try {
                weatherBlocks.value[index].dailyData = await fetch5DayForecast(
                    weatherBlocks.value[index].city.name,
                    locale.value
                )
            } catch (error) {
                console.error('Error fetching 5-day forecast for block:', error)
            }
        }

        const toggleDayNightMode = (id) => {
            const block = weatherBlocks.value.find((block) => block.id === id)
            if (block) {
                block.viewMode = block.viewMode === 'day' ? '5days' : 'day'
            }
        }

        const addBlock = () => {
            weatherStore.addBlock()
        }

        const confirmRemoveBlock = (id) => {
            selectedBlockId.value = id
            isModalVisible.value = true
        }

        const removeBlock = () => {
            const index = weatherBlocks.value.findIndex(
                (block) => block.id === selectedBlockId.value
            )
            if (index !== -1) {
                weatherStore.removeBlock(index)
            }
            isModalVisible.value = false
        }

        return {
            t,
            weatherBlocks,
            setBlockCity,
            fetchWeather,
            toggleDayNightMode,
            addBlock,
            confirmRemoveBlock,
            removeBlock,
            isModalVisible,
            selectedBlockId,
            isFavoriteBlock,
            isLoading,
            currentLocal
        }
    }
})
</script>

<style scoped>
.weather-block {
    margin-bottom: 20px;
    padding: 20px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 8px;
    position: relative; /* Added for Preloader positioning */
}

.favorite-block {
    border: 2px solid #ff9800; /* Example color for highlighting */
}

.remove-button {
    margin-top: 10px;
    padding: 5px 10px;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.add-button {
    margin-top: 10px;
    padding: 10px 15px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
</style>
