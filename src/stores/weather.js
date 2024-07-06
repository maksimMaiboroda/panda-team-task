import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

const INITIAL_WEATHER_BLOCK = {
    city: null,
    hourlyData: null,
    dailyData: null,
    viewMode: 'day'
}

export const useWeatherStore = defineStore({
    id: 'weather',
    state: () => ({
        weatherBlocks: [
            {
                id: uuidv4(),
                ...INITIAL_WEATHER_BLOCK
            }
        ],
        favoriteCities: []
    }),
    actions: {
        addBlock() {
            if (this.weatherBlocks.length < 5) {
                this.weatherBlocks.push({
                    ...INITIAL_WEATHER_BLOCK,
                    id: uuidv4()
                })
            }
        },
        removeBlock(index) {
            this.weatherBlocks.splice(index, 1)
        },
        addToFavorites(city) {
            const includesCity = this.favoriteCities.find((c) => c.id === city.id)

            if (!includesCity) {
                if (this.favoriteCities.length < 5) {
                    this.favoriteCities.push(city)
                    this.saveToLocalStorage()
                } else {
                    alert('Maximum of 5 favorite cities allowed!')
                }
            }
        },
        removeFavoriteCity(id) {
            this.favoriteCities = this.favoriteCities.filter((item) => item.city.id !== id)
            this.saveToLocalStorage()
        },
        async loadFromLocalStorage() {
            const favoriteCities = JSON.parse(localStorage.getItem('favoriteCities'))

            if (favoriteCities) {
                this.favoriteCities = favoriteCities
            }
        },
        saveToLocalStorage() {
            localStorage.setItem('favoriteCities', JSON.stringify(this.favoriteCities))
        }
    }
})
