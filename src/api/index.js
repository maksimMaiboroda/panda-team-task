import axios from 'axios'
import config from '@/config.js'

async function getCities(cityName = 'New York') {
    const url = `${config.geoNamesApiPrefix}/searchJSON`
    const params = {
        username: config.geoNamesUserName,
        q: cityName,
        maxRows: 10
    }

    try {
        const response = await axios.get(url, { params })

        return response.data
    } catch (error) {
        throw new console.log(`Something was wrong`, error)
    }
}

export async function getWeatherByCity() {
    try {
        const cities = await getCities()

        console.log({ cities })
        const { lng, lat, name } = cities.geonames[0]
        // const url = `${config.corsApiPrefix}${config.openWeatherApiPrefix}/data/3.0/onecall?lat=${lat}&lon=${lng}&appid=${config.openWeatherApiKey}`
        const url =
            'https://cors-anywhere.herokuapp.comhttp://api.openweathermap.org/data/3.0/onecall?lat=40.71&lon=-74.00&appid=8ebfed119f54fac2f5b51416de5260a8'

        console.log({ url, lng, lat, name })

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${config.openWeatherApiKey}`
            }
        })

        console.log({ response })

        // return response.data
    } catch (error) {
        throw new console.log(`Something was wrong`, error)
    }
}
