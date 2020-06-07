import axios from 'axios'

const Api = axios.create({
    baseURL: 'http://192.168.15.14:3333'
})

export default Api
