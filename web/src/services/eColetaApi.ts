import axios from 'axios'

const eColetaApi = axios.create({
    baseURL: 'http://localhost:3333'
})

export default eColetaApi 