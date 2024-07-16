import express from 'express'
import cors from 'cors'
import { serverLog } from '../../middlewares/serverLog.middleware.js'
import { getJoyasId, getJoyas, prerararHATEOAS, getFiltros } from './utils/consultas.js'

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(cors())
app.use(express.json())
app.use(serverLog)

app.get('/', (req, res) => {
  res.status(200).send('Api Joyas')
})

/* Muestra listado Joyas */

app.get('/joyas', async (req, res) => {
  try {
    const joyas = await getJoyas(req.query)
    const HATEOAS = await prerararHATEOAS(joyas)
    res.status(200).send(HATEOAS)
  } catch (error) {
    res.status(400).send(error)
  }
})

/* Muestra listado Joyas/filtro */

app.get('/joyas/filtros', async (req, res) => {
  try {
    const joyas = await getFiltros(req.query)
    res.status(200).send(joyas)
  } catch (error) {
    res.status(400).send(error)
  }
})

/* Get Put recupera una cancion por ID */

app.get('/joyas/:id', async (req, res) => {
  try {
    const posts = await getJoyasId(req.params.id)
    res.status(200).send(posts)
  } catch (error) {
    res.status(400).send(error)
  }
})

app.all('*', (req, res) => res.status(404).json({ status: false, message: 'Page no found' }))

app.listen(PORT, () => console.log(`SERVER UP! ${PORT}`))

export default app
