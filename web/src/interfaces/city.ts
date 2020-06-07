import { Uf } from "./uf";

export interface City {
  id: Number;
  nome: string;
  microrregiao: {
    id: Number;
    nome: string;
    mesorregiao: {
      id: Number;
      nome: string;
      UF: Uf
    }
  }
}
