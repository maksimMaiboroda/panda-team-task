<template>
    <div class="weather-card">
        <div class="weser-details">
            <h2>{{ city.name }}</h2>
            <p>{{ weatherDescription }}</p>
            <p>{{ temperature }} °C</p>
            <img :src="iconUrl" alt="Weather icon" />
        </div>

        <button @click="toggleDayNightMode">{{ viewModeButtonText }}</button>
        <button v-if="tab !== 'favorite'" @click="addToFavorites">Add to Favorites</button>
        <button @click="removeFromFavorites">Remove from Favorites</button>
    </div>

    <TemperatureChart
        v-if="block.hourlyData && block.viewMode === 'day'"
        :hourlyData="block.hourlyData"
    />
    <div v-if="block.dailyData && block.viewMode === '5days'" class="daily-weather-container">
        <div v-for="(day, i) in block.dailyData" :key="i" class="daily-weather">
            <div class="daily-details">
                <h3>{{ day.date }}</h3>
                <p>Day: {{ day.day.temp }} °C</p>
                <p>Night: {{ day.night.temp }} °C</p>
                <p>{{ day.description }}</p>
            </div>

            <img :src="getIconUrl(day.icon)" alt="Weather icon" />
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useWeatherStore } from '../stores/weather'
import TemperatureChart from './TemperatureChart.vue'

export default {
    name: 'WeatherCard',
    components: {
        TemperatureChart
    },
    props: {
        city: {
            type: Object,
            required: true
        },
        viewMode: {
            type: String,
            required: true
        },
        block: {
            type: Object,
            required: true
        },
        tab: {
            type: String,
            required: true
        }
    },
    emits: ['toggle-day-night'],
    setup(props, { emit }) {
        const weatherStore = useWeatherStore()
        const temperature = computed(() => (props.city.main.temp - 273.15).toFixed(2))
        const weatherDescription = computed(() => props.city.weather[0].description)
        const iconUrl = computed(
            () => `http://openweathermap.org/img/wn/${props.city.weather[0].icon}@2x.png`
        )
        const viewModeButtonText = computed(() =>
            props.viewMode === 'day' ? 'Show 5 Day Forecast' : 'Show Daily Forecast'
        )

        const toggleDayNightMode = () => {
            emit('toggle-day-night')
        }

        const addToFavorites = () => {
            weatherStore.addToFavorites(props.block)
        }

        const removeFromFavorites = () => {
            weatherStore.removeFavoriteCity(props.city.id)
        }

        const getIconUrl = (icon) => {
            return `http://openweathermap.org/img/wn/${icon}@2x.png`
        }

        return {
            temperature,
            weatherDescription,
            iconUrl,
            viewModeButtonText,
            toggleDayNightMode,
            addToFavorites,
            removeFromFavorites,
            getIconUrl
        }
    }
}
</script>

<style scoped>
.weather-card {
    width: 100%;
    padding: 0 20px 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.weather-card h2 {
    margin: 0 10px;
}

.weather-card img {
    width: 100px;
    height: 100px;
}

.weather-card p {
    margin: 0 10px;
}

.weser-details {
    display: flex;
    align-items: center;
    justify-content: center;
}

button {
    margin: 0 12px;
}

.weather-card button {
    margin-top: 10px;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.weather-card button:hover {
    background-color: #0056b3;
}

.daily-weather-container {
    width: 100%;
}

.daily-weather {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    padding: 10px 20px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 8px;
}

.daily-details {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
</style>
