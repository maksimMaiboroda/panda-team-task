import config from '@/config'

export async function getCityByIP() {
    try {
        const response = await fetch(`https://ipinfo.io/json?token=${config.geolocationToken}`)
        if (!response.ok) {
            throw new Error('Failed to fetch location')
        }
        const data = await response.json()
        return data.city
    } catch (error) {
        console.error('Error fetching location by IP:', error)
        return null
    }
}
