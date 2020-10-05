import { gql, useQuery } from '@apollo/client'
import React, { useContext, useEffect, useState }  from 'react'
import Select from 'react-select'
import PedidoContext from '../../context/pedidos/PedidoContext'

const OBTENER_CLIENTES_USUARIO = gql`
  query obtenerClientes {
    obtenerClientesVendedor {
      id
      nombre 
      apellido
      email
      empresa
    }
  }
`

const AsignarCliente = () => {

  const { agregarCliente } = useContext(PedidoContext);

  const [cliente, setCliente] = useState([])

  const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIO)

  useEffect(() => {
    agregarCliente(cliente)
  }, [cliente])

  if( loading ) return null

  const { obtenerClientesVendedor } = data

  const seleccionarCliente = (clientes) => setCliente(clientes)


  return (

    <>
      <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold"> 
        1.- Asigna un cliente al pedido 
      </p>

      <Select 
        className="mt-3"
        options={obtenerClientesVendedor}
        onChange={ (option) => seleccionarCliente(option) }
        // Definir que propiedas del array devolveras a la vista 
        getOptionLabel={ option => option.nombre }
        getOptionValue={ option => option.id } 
        placeholder="Seleccionar Cliente"
        noOptionsMessage={ () => 'No hay resultado' }
      />
    </>
  )
}

export default AsignarCliente
