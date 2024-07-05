<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <!-- <TheWelcome /> -->
    <div class="weather-card">
      <div v-if="loading" class="loading">Loading...</div>

      <div v-if="error" class="error">{{ error }}</div>

      <div v-if="forecast" class="content">
        {{ forecast }}
        <!-- <h2>{{ forecast.title }}</h2>
            <p>{{ forecast.body }}</p> -->
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, watch } from 'vue'
// import { useRoute } from 'vue-router'
import { getWeatherByCity } from './api'

// const route = useRoute()

const loading = ref(false)
const forecast = ref(null)
const error = ref(null)

// watch(() => route.params.id, fetchData, { immediate: true })
watch(() => {}, fetchData, { immediate: true })

async function fetchData() {
  error.value = forecast.value = null
  loading.value = true

  try {
    forecast.value = await getWeatherByCity()
  } catch (err) {
    error.value = err.toString()
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
