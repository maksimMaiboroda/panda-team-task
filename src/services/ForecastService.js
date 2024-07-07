import config from '@/config'

export async function fetchCities(value, lang = 'ua') {
    try {
        const response = await fetch(
            `${config.baseUrl}/data/2.5/find?q=${value}&appid=${config.apiKey}&lang=${lang}`
        )

        const data = await response.json()
        const list = data.list

        return list
    } catch (error) {
        console.error('Error fetching cities', error)
        throw error
    }
}

export async function fetchCityWeatherByName(city, lang = 'en') {
    try {
        const response = await fetch(
            `${config.baseUrl}/data/2.5/weather?q=${city}&appid=${config.apiKey}&lang=${lang}`
        )
        if (!response.ok) {
            throw new Error(`Error fetching weather data for city: ${response.statusText}`)
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching city weather:', error)
        throw error
    }
}

export async function fetchHourlyForecast(city, lang = 'en') {
    try {
        const response = await fetch(
            `${config.baseUrl}/data/2.5/forecast?q=${city}&appid=${config.apiKey}&units=metric&lang=${lang}`
        )
        const data = await response.json()
        return data.list.map((item) => ({
            time: item.dt_txt.split(' ')[1],
            temperature: item.main.temp
        }))
    } catch (error) {
        console.error('Error fetching hourly forecast:', error)
        throw error
    }
}

export async function fetch5DayForecast(city, lang = 'en') {
    try {
        const response = await fetch(
            `${config.baseUrl}/data/2.5/forecast?q=${city}&appid=${config.apiKey}&units=metric&lang=${lang}`
        )
        const data = await response.json()
        const groupedData = groupByDay(data.list)
        const dailyData = []

        for (const key in groupedData) {
            if (Object.hasOwnProperty.call(groupedData, key)) {
                const group = groupedData[key]
                const avgTempDay =
                    group.reduce((acc, cur) => acc + cur.main.temp_max, 0) / group.length
                const avgTempNight =
                    group.reduce((acc, cur) => acc + cur.main.temp_min, 0) / group.length
                const userLocale = navigator.language || 'en-US'
                const dayData = {
                    date: new Date(group[0].dt_txt).toLocaleDateString(userLocale, {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric'
                    }),
                    day: { temp: avgTempDay.toFixed(1) },
                    night: { temp: avgTempNight.toFixed(1) },
                    description: group[0].weather[0].description,
                    icon: group[0].weather[0].icon
                }
                dailyData.push(dayData)
            }
        }

        return dailyData
    } catch (error) {
        console.error('Error fetching 5-day forecast:', error)
        throw error
    }
}

function groupByDay(list) {
    return list.reduce((acc, item) => {
        const date = item.dt_txt.split(' ')[0]
        if (!acc[date]) {
            acc[date] = []
        }
        acc[date].push(item)
        return acc
    }, {})
}
