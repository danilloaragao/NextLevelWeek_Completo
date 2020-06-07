import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import './styles.css'
import logo from '../../assets/logo.svg'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import eColetaApi from '../../services/eColetaApi'
import { Item } from '../../interfaces/Item'
import { Uf } from '../../interfaces/uf'
import { City } from '../../interfaces/city'
import ibgeApi from '../../services/ibgeApi'
import { LeafletMouseEvent } from 'leaflet'
import Dropzone from '../../componentes/Dropzone'

const CreatePoint = () => {
    const [items, setItems] = useState<Item[]>([])
    const [ufs, setUf] = useState<string[]>([])
    const [citys, setCitys] = useState<string[]>([])
    const [selectedUf, setSelectedUf] = useState('0')
    const [selectedCity, setSelectedCity] = useState('0')
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
    })
    const [selectedFile, setSelectedFile] = useState<File>()

    const history = useHistory()

    useEffect(() => {
        eColetaApi.get('items').then(response => {
            setItems(response.data)
        })
    }, [])

    useEffect(() => {
        ibgeApi.get<Uf[]>('estados?orderBy=nome').then(response => {
            setUf(response.data.map(uf => uf.sigla))
        })
    }, [])

    useEffect(() => {
        ibgeApi.get<City[]>(`estados/${selectedUf}/municipios`).then(response => {
            setCitys(response.data.map(city => city.nome))
        })
    }, [selectedUf])

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            setInitialPosition([position.coords.latitude, position.coords.longitude])
        })
    }, [])

    useEffect(() => {

    }, [Dropzone])

    function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedUf(event.target.value)
    }

    function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedCity(event.target.value)
    }

    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value })
    }

    function handleSelectedItem(id: number) {
        const idIndex = selectedItems.indexOf(id)

        if (idIndex < 0) {
            setSelectedItems([...selectedItems, id])
        } else {
            const filteredItems = selectedItems.filter(i => i !== id)
            setSelectedItems(filteredItems)
        }
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const { name, email, whatsapp } = formData
        const uf = selectedUf
        const city = selectedCity
        const [latitude, longitude] = selectedPosition
        const items = selectedItems

        const data = new FormData()

        data.append('name', name)
        data.append('email', email)
        data.append('whatsapp', whatsapp)
        data.append('uf', uf)
        data.append('city', city)
        data.append('latitude', String(latitude))
        data.append('longitude', String(longitude))
        data.append('items', items.join(','))

        if (selectedFile)
            data.append('image', selectedFile)

        await eColetaApi.post('points', data)

        alert('Ponto de coleta criado!')
        history.push('/')
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="eColeta" />
                <Link to="/"><span><FiArrowLeft></FiArrowLeft></span>Voltar para home</Link>
            </header>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br />ponto de coleta</h1>

                <Dropzone onFileUploaded={setSelectedFile} />

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da Entidade</label>
                        <input type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        ></input>
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            ></input>
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                            ></input>
                        </div>
                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={150} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf" value={selectedUf} onChange={handleSelectedUf}>
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option value={uf} key={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value={selectedCity} onChange={handleSelectedCity}>
                                <option value="0">Selecione uma Cidade</option>
                                {citys.map(city => (
                                    <option value={city} key={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2> Ítens de Coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item => (
                            <li key={item.id}
                                onClick={() => handleSelectedItem(item.id)}
                                className={selectedItems.includes(item.id) ? 'selected' : ''}>

                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>))}

                    </ul>
                </fieldset>
                <button type="submit">Cadastrar ponto de coleta</button>
            </form>
        </div>
    )
}

export default CreatePoint