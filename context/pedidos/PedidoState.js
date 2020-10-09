import React, { useReducer } from 'react';
import PedidoContext from './PedidoContext';
import { SELECCIONAR_CLIENTE, SELECCIONAR_PRODUCTO, CANTIDAD_PRODUCTOS, ACTUALIZAR_TOTAL } from '../../types';
import PedidoReducer from './PedidoReducer';

const PedidoState = ({children}) => {

  // State de pedidos
  const initialState = {
    cliente: {},
    productos: [],
    total: 0
  }

  const [state, dispatch] = useReducer(PedidoReducer, initialState)

  // Modifica el Cliente
  const agregarCliente = (cliente) => {
    dispatch({
      type: SELECCIONAR_CLIENTE,
      payload: cliente
    })
  }

  // Modifica los productos
  const agregarProductos = productosSelecionados => {

    let nuevoState;

    if(state.productos.length > 0) {
      // Tomar del segundo arreglo, una copia para asignarlo al primero

      nuevoState = productosSelecionados.map( producto => {

        const nuevoObjeto = state.productos.find( productoState => productoState.id === producto.id )

        return { ...producto, ...nuevoObjeto }
      })

    } else {
      nuevoState = productosSelecionados
    }

    dispatch({
      type: SELECCIONAR_PRODUCTO,
      payload: nuevoState
    })
  }

  // Modifica las cantidades de los productos
  const cantidadProductos = (nuevoProdcto) => {
    dispatch({
      type: CANTIDAD_PRODUCTOS,
      payload: nuevoProdcto
    })
  }

  const actualizarTotal = () => {
    dispatch({
      type: ACTUALIZAR_TOTAL
    })
  }

  return(
    <PedidoContext.Provider value={{
      productos: state.productos,
      total: state.total,
      cliente: state.cliente,
      agregarCliente,
      agregarProductos,
      cantidadProductos,
      actualizarTotal
    }} >

      {children}
      
    </PedidoContext.Provider>
  )
}

export default PedidoState;