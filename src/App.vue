<template>
    <div class="app-wrapper">
        <header>
            <nav>
                <h1>{{ $t('app.title') }}</h1>
                <div>
                    <button
                        @click="switchLanguage('en')"
                        :class="{ active: currentLanguage === 'en', 'language-btn': true }"
                    >
                        English
                    </button>
                    <button
                        @click="switchLanguage('uk')"
                        :class="{ active: currentLanguage === 'uk', 'language-btn': true }"
                    >
                        Українська
                    </button>
                </div>
            </nav>
        </header>
        <main>
            <div class="container">
                <div class="tabs">
                    <button
                        @click="setActiveTab('weather')"
                        :class="{ active: activeTab === 'weather', 'weather-tab': true }"
                    >
                        {{ $t('tabs.weather') }}
                    </button>
                    <button
                        @click="setActiveTab('favorites')"
                        :class="{ active: activeTab === 'favorites', 'favorite-tab': true }"
                    >
                        {{ $t('tabs.favorites') }}
                    </button>
                </div>
                <WeatherPreloader v-if="isLoadingWeather" />
                <WeatherBlocks v-if="activeTab === 'weather'" :defaultCity="defaultCity" />
                <FavoritesTab v-if="activeTab === 'favorites'" />
            </div>
        </main>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWeatherStore } from './stores/weather'
import WeatherBlocks from './components/WeatherBlocks.vue'
import FavoritesTab from './components/FavoritesTab.vue'
import WeatherPreloader from './components/WeatherPreloader.vue'

export default {
    name: 'App',
    components: {
        WeatherBlocks,
        FavoritesTab,
        WeatherPreloader
    },
    setup() {
        const { t, locale } = useI18n()
        const weatherStore = useWeatherStore()
        const activeTab = ref('weather')
        const defaultCity = ref(null)
        const isLoadingWeather = ref(false)
        const currentLanguage = ref('en')

        onMounted(() => {
            loadLocaleFromStorage()
        })

        function loadLocaleFromStorage() {
            const storedLocale = localStorage.getItem('locale')
            if (storedLocale) {
                locale.value = storedLocale
                weatherStore.setLanguage(locale.value)
            }
        }

        const setActiveTab = (tab) => {
            activeTab.value = tab
        }

        const switchLanguage = (lang) => {
            currentLanguage.value = lang
            locale.value = lang

            weatherStore.setLanguage(locale.value)
            localStorage.setItem('locale', locale.value)
        }

        return {
            t,
            activeTab,
            setActiveTab,
            defaultCity,
            isLoadingWeather,
            switchLanguage,
            currentLanguage
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
    justify-content: space-between;
    padding: 20px 10px;
}

.tabs {
    position: absolute;
    top: -34px;
    left: 7px;
    height: 60px;
    z-index: 0;
}

.tabs button {
    padding: 10px 20px 9px;
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
    position: relative;
}

.language-btn {
    background-color: #6e7472;
    color: white;
    border: none;
    border-radius: 2px;
    margin: 0 5px;
    padding: 2px 4px;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
}
</style>
