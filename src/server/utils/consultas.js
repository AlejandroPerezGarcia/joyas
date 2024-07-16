import db from '../database/db_connect.js'
import format from 'pg-format'

/* SELECT para tener todos los datos de las tabla inventario con limite, order_by y page */
export const getJoyas = async ({ limits = 3, orderBy = 'stock_ASC', page = 0 }) => {
  try {
    const [campo, direccion] = orderBy.split('_')
    const offset = Math.abs(page > 0 ? page - 1 : 0) * limits
    const formattedQuery = format('SELECT * FROM inventario ORDER BY %s %s LImIT %s OFFSET %s;', campo, direccion, limits, offset)
    const result = await db(formattedQuery)
    return result
  } catch (error) {
    throw new Error(`Error al abtener el inventario: ${error.message}`)
  }
}

/* SELECT para tener todos los datos de las tabla inventario con precio_max, precio_min, categoria,metal */
export const getFiltros = async ({ limits = 6, orderBy = 'precio_ASC', page = 0, precioMin, precioMax, categoria, metal }) => {
  try {
    let query = 'SELECT * FROM inventario'
    const filtros = []
    const values = []

    if (precioMin) {
      values.push(precioMin)
      filtros.push(`precio <= $${values.length}`)
    }

    if (precioMax) {
      values.push(precioMax)
      filtros.push(`precio >= $${values.length}`)
    }

    if (categoria) {
      values.push(categoria)
      filtros.push(`categoria = $${values.length}`)
    }

    if (metal) {
      values.push(metal)
      filtros.push(`metal = $${values.length}`)
    }

    if (filtros.length > 0) {
      query += ` WHERE ${filtros.join(' AND ')}`
    }

    const [campo, direccion] = orderBy.split('_')
    const offset = Math.abs(page > 0 ? page - 1 : 0) * limits
    const formattedQuery = format(`${query} ORDER BY %s %s LImIT %s OFFSET %s;`, campo, direccion, limits, offset)
    const result = await db(formattedQuery, values)
    return result
  } catch (error) {
    throw new Error(`Error al abtener el inventario: ${error.message}`)
  }
}

/* Busca por Id un medicamento */

export const getJoyasId = async (id) => {
  try {
    const consulta = 'SELECT * FROm inventario WHERE id = $1;'
    const values = [id]
    const result = await db(consulta, values)
    return result
  } catch (error) {
    throw new Error(`Error al obtener el medicamento: ${error.message}`)
  }
}

/* Funcion mODELO HATEOAS */

export const prerararHATEOAS = (joyas) => {
  let stockTotal = 0
  const result = joyas.map((j) => {
    stockTotal += +j.stock
    return {
      name: j.nombre,
      href: `/joyas/${j.id}`
    }
  })
  const totalJoyas = joyas.length
  const HATEOAS = {
    totalJoyas, stockTotal, result
  }
  return HATEOAS
}
