<template>
    <div class="app-wrapper">
        <header>
            <nav>
                <h1>Weather App</h1>
            </nav>
        </header>
        <main>
            <div class="tabs">
                <button
                    @click="setActiveTab('weather')"
                    :class="{ active: activeTab === 'weather', 'weather-tab': true }"
                >
                    Weather
                </button>
                <button
                    @click="setActiveTab('favorites')"
                    :class="{ active: activeTab === 'favorites', 'favorite-tab': true }"
                >
                    Favorites
                </button>
            </div>
            <div class="container">
                <WeatherBlocks v-if="activeTab === 'weather'" :defaultCity="defaultCity" />
                <FavoritesTab v-if="activeTab === 'favorites'" />
            </div>
        </main>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useWeatherStore } from './stores/weather'
import WeatherBlocks from './components/WeatherBlocks.vue'
import FavoritesTab from './components/FavoritesTab.vue'

export default {
    name: 'App',
    components: {
        WeatherBlocks,
        FavoritesTab
    },
    setup() {
        const weatherStore = useWeatherStore()
        const activeTab = ref('weather')
        const defaultCity = ref(null)

        onMounted(() => {
            weatherStore.loadFromLocalStorage()
        })

        const setActiveTab = (tab) => {
            activeTab.value = tab
        }

        return {
            activeTab,
            setActiveTab,
            defaultCity
        }
    }
}
</script>

<style>
.app-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #f0f0f0;
}

nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    background-color: #729096;
    display: flex;
    justify-content: center;
    padding: 20px 10px;
}

.tabs {
    position: absolute;
    top: -15px;
    left: 30px;
}

.tabs button {
    padding: 10px 20px;
    border: none;
    background-color: #ddd;
    cursor: pointer;
}

.tabs button.active {
    background-color: #aaa;
    color: white;
}

.weather-tab {
    border-top-left-radius: 5px;
}

.favorite-tab {
    border-top-right-radius: 5px;
}

.container {
    width: 100%;
    max-width: 1200px;
}
</style>
