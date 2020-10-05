import { gql, useQuery } from '@apollo/client';
import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import PedidoContext from '../../context/pedidos/PedidoContext';

const OBTENER_PRODUCTOS = gql`
  query obtenerProductos {
    obtenerProductos {
        id
        nombre
        precio
        existencia
    }
  }
`

const AsignarProductos = () => {
  
  const [productos, setProductos] = useState([])

  const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);

  const { agregarProductos } = useContext(PedidoContext)

  useEffect( () => {
    if( productos ) {
      agregarProductos(productos)
    } else {
      agregarProductos([])
    }
  }, [productos] )

  const seleccionarProducto = producto => {
    setProductos(producto)
  }

  if( loading ) {
    return(
      <div>
        <h1>Cargando...</h1>
      </div>
    )
  }

  const { obtenerProductos } = data

  return (
    <>
      <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold"> 
        2.- Selecciona o busca los productos
      </p>

      <Select 
        className="mt-3"
        isMulti={true}
        options={obtenerProductos}
        onChange={ (option) => seleccionarProducto(option) }
        // Definir que propiedas del array devolveras a la vista 
        getOptionLabel={ option => `${option.nombre} - ${option.existencia} Disponibles`}
        getOptionValue={ option => option.id } 
        placeholder="Seleccionar Productos"
        noOptionsMessage={ () => 'No hay resultado' }
      />
    </>
  );
}
 
export default AsignarProductos;