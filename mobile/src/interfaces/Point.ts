export interface Point{
    id: number,
    image: string,
    name: string,
    email: string,
    whatsapp: number,
    latitude: number,
    longitude: number,
    city: string,
    uf: string,
    point_items: {
        title: string, 
        image: string
    }[]
  }