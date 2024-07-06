<template>
    <div class="container">
        <div class="wrapper">
            <input
                type="text"
                name="search"
                id="search"
                placeholder="Enter the name of the city"
                autocomplete="chrome-off"
                v-model="query"
                @input="handleInput"
                @focus="handleFocus"
            />
            <div class="results" v-if="showResults && results.length > 0">
                <ul>
                    <li v-for="city in results" :key="city.id" @click="selectCity(city)">
                        {{ city.name }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { fetchCities } from '../services/ForecastService'

export default {
    name: 'CityAutocomplete',
    props: {
        debounce: {
            type: Number,
            default: 200
        },
        characters: {
            type: Number,
            default: 3
        },
        onClickItem: {
            type: Function,
            default: (city, obj) => {
                obj.input.value = city
            }
        }
    },
    setup(props, { emit }) {
        const query = ref('')
        const results = ref([])
        const showResults = ref(false)
        let debounceTimeout = null

        const handleSearchCities = async (value) => {
            if (value.length >= props.characters) {
                const res = await fetchCities(value)
                results.value = res
                showResults.value = true
            } else {
                results.value = []
                showResults.value = false
            }
        }

        const handleInput = (event) => {
            clearTimeout(debounceTimeout)
            const value = event.target.value

            debounceTimeout = setTimeout(() => {
                handleSearchCities(value)
            }, props.debounce)
        }

        const handleFocus = (event) => {
            const value = event.target.value
            if (value.length >= props.characters) {
                handleSearchCities(value)
            }
        }

        const selectCity = (city) => {
            props.onClickItem(city, { input: query })
            showResults.value = false
            emit('city-selected', city)
            query.value = ''
        }

        return {
            query,
            results,
            showResults,
            handleInput,
            handleFocus,
            selectCity
        }
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');

* {
    box-sizing: border-box;
}

body {
    background: #6d7b98;
    font-size: 18px;
    font-family: 'Roboto', sans-serif;
}

.container {
    margin-bottom: 20px;
}

.wrapper {
    margin: 20px auto;
    background: #ffffff;
    border-radius: 5px;
    box-shadow: 0px 1px 5px 3px rgba(0, 0, 0, 0.15);
    position: relative;
}

input {
    width: 100%;
    border: none;
    height: 50px;
    border-radius: 5px;
    padding: 0px 40px 0px 10px;
    font-size: 18px;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
}

input:focus {
    outline: none;
}

button {
    position: absolute;
    border: none;
    background: none;
    top: 0;
    right: 0;
    height: 50px;
    line-height: 50px;
    padding: 0;
    width: 50px;
}

button:focus {
    outline: none;
}

button i {
    width: 100%;
    color: #6d7b98;
    line-height: 50px;
    font-size: 22px;
}

.results {
    position: absolute;
    width: 100%;
    background: white;
    border: 1px solid #ccc;
    border-top: none;
    z-index: 1000;
    box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.2);
    padding: 0;
    border-radius: 5px;
}

.results ul {
    margin: 0;
    padding: 0;
}

.results ul li {
    list-style: none;
    padding: 8px 12px;
    transition: all 0.5s linear;
    cursor: pointer;
}

.show .results ul li {
    opacity: 1;
    display: block;
}

.show .results {
    padding: 10px;
}

.results ul li:hover {
    background: #ececec;
}
</style>
