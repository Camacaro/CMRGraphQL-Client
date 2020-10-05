import React, { useEffect, useState } from 'react'
import Layout from '../components/Layaout'
import Select from 'react-select'

// por defecto estas son las propiedas a recibir value y label
// const options = [
//   { value: 'chocolate', label: 'Chocolate' },
//   { value: 'strawberry', label: 'Strawberry' },
//   { value: 'vanilla', label: 'Vanilla' }
// ]

const options = [
  { id: 'chocolate', nombre: 'Chocolate' },
  { id: 'strawberry', nombre: 'Strawberry' },
  { id: 'vanilla', nombre: 'Vanilla' }
]

const NuevoPedido = () => {

  const [sabores, setSabores] = useState([])

  useEffect(() => {
    console.log(sabores)
  }, [sabores])

  const seleccionarSabor = (sabores) => setSabores(sabores)

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Nuevo Pedido</h1>

      <Select 
        options={options}
        isMulti={true}
        onChange={ (option) => seleccionarSabor(option) }
        // Definir que propiedas del array devolveras a la vista 
        getOptionLabel={ option => option.nombre }
        getOptionValue={ option => option.id } 
        placeholder="Seleccionar Sabor"
        noOptionsMessage={ () => 'No hay resultado' }
      />

    </Layout>
  )
}

export default NuevoPedido