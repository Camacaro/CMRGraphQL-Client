import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import React, { useContext, useState } from 'react'
import Swal from 'sweetalert2'
import Layout from '../components/Layaout'
import AsignarCliente from '../components/pedidos/AsignarCliente'
import AsignarProductos from '../components/pedidos/AsignarProductos'
import { ResumenPedido } from '../components/pedidos/ResumenPedido'
import { Total } from '../components/pedidos/Total'
import PedidoContext from '../context/pedidos/PedidoContext'

const NUEVO_PEDIDO = gql`
mutation nuevoPedido($input: PedidoInput) {
    nuevoPedido(input: $input) {
      id
    }
  }
`
const OBTENER_PEDIDOS_VENDEDOR = gql`
  query obtenerPedidosVendedor {
    obtenerPedidosVendedor {
        id
        pedido {
            id
            cantidad
        }
        cliente {
          id
          nombre
          apellido
          email,
          telefono
        }
        vendedor
        total
        estado
    }
  }
`

const NuevoPedido = () => {

  const [mensaje, setMensaje] = useState(null)

  const { push } = useRouter()

  // Utilizar context y extrar funcciones y valores 
  const { cliente, productos, total } = useContext(PedidoContext)

  const [nuevoPedido] = useMutation(NUEVO_PEDIDO, {
    update(cache, { data: nuevoPedido }) {
      const { obtenerPedidosVendedor } = cache.readQuery({
        query: OBTENER_PEDIDOS_VENDEDOR
      })

      cache.writeQuery({
        query: OBTENER_PEDIDOS_VENDEDOR,
        data: {
          obtenerPedidosVendedor: [ .. ]
        }
      })
    }
  })

  const validarPedido = () => {
    return (
      !productos.every( product => product.cantidad > 0 ) 
      || total === 0 
      || cliente.length === 0
      ? 'opacity-50 cursor-not-allowed' : ''
    )
  }

  const crearNuevoPedido = async () => {

    // Remover lo no deseado de productos
    const pedido = productos.map( ({existencia, __typename, ...producto}) => producto )
    
    const { id } = cliente;

    try {
      
      const { data } = await nuevoPedido({
        variables: {
          input: {
            cliente: id,
            total,
            pedido
          }
        } 
      })

      push('/pedidos')

      Swal.fire(
        'Correcto',
        'El pedido se registró correctamente',
        'success'
      )

    } catch (error) {
      setMensaje(error.message)
      setTimeout( () => setMensaje(null), 3000 )
    }
  }

  const mostrarMensaje = () => {
    return (
      <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
        <p>{mensaje}</p>
      </div>
    )
  }

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Nuevo Pedido</h1>

      { mensaje && mostrarMensaje() }

      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <AsignarCliente />
          <AsignarProductos />
          <ResumenPedido />
          <Total />

          <button
            type="button"
            className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${validarPedido()}`}
            onClick={ crearNuevoPedido }
          >
            Registrar Pedido
          </button>
        </div>
      </div>

      

    </Layout>
  )
}

export default NuevoPedido