import express from 'express'
import routes from './routes'
import path from 'path'
import cors from 'cors'
import { errors } from 'celebrate'

import swaggerUi from 'swagger-ui-express'
import * as swaggerDocument from './swagger.json'

const app = express();
const port = process.env.PORT || 3333

app.use(cors())
app.use(express.json())
app.use(routes)
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

//função que serve arquivos estaticos
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

app.use(errors())

app.listen(port);

//TODO
//- Personalizar mensagem de erro das validações
//- Atualizar Swagger com a mensagem acima