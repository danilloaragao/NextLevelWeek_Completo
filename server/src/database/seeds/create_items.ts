import Knex from 'knex'

export async function seed(knex: Knex){
    await knex('items').insert([
        {TITLE: 'Lâmpadas', IMAGE: 'lampadas.svg'},
        {TITLE: 'Pilhas e Bateria', IMAGE: 'baterias.svg'},
        {TITLE: 'Papéis e Papelão', IMAGE: 'papeis-papelao.svg'},
        {TITLE: 'Resíduos Eletrônicos', IMAGE: 'eletronicos.svg'},
        {TITLE: 'Resíduos Organicos', IMAGE: 'organicos.svg'},
        {TITLE: 'Óleo de Cozinha', IMAGE: 'oleo.svg'},
    ])
}