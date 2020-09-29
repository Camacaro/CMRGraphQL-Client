import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../../components/Layaout';
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2';

const OBTENER_PRODUCTO = gql`
  query obtenerProducto( $id: ID!) {
    obtenerProducto(id: $id) {
        nombre
        precio
        existencia
    }
  }
`

const ACTUALIZAR_PRODUCTO = gql`
  mutation actualizarProducto($id: ID!, $input: ProductoInput){
    actualizarProducto(id: $id, input: $input) {
        id
        nombre
        existencia
        precio
    }
  }
`

const EditarProducto = () => {

  const { query: { id }, push } = useRouter()
  console.log(id)

  const { data, loading, error } = useQuery( OBTENER_PRODUCTO, {
    variables: {
      id
    }
  } )

  const [ actualizarProducto ] = useMutation( ACTUALIZAR_PRODUCTO )

  if( loading ) return <h1>Cargando</h1>
  console.log(data)
  if( !data.obtenerProducto ) {
    return <h1>Accion no permitida</h1>
  }

  const { obtenerProducto } = data

  const schemaValidation = Yup.object({
    nombre: Yup.string()
      .required('El nombre del producto es obligatorio'),
    existencia: Yup.number()
      .required('Agrega la cantidad disponible')
      .positive('No se aceptan numeros positivos')
      .integer('La existencia debe ser de numeros enteros'),
    precio: Yup.number()
      .required('El precio es obligatorio')
      .positive('No se aceptan numeros positivos')
  });

  const handleUpdateProduct = async (values) => {
    
    const { nombre, existencia, precio } = values

    try {
      const { data } = await actualizarProducto({
        variables: {
          id, 
          input: {
            nombre,
            existencia,
            precio
          }
        }
      })

      push('/productos')

      Swal.fire(
        'Correcto',
        'El producto se actualizo correctamente',
        'success'
      )
    } catch (error) {
      console.log(error)
    }
  }

  return ( 
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Editar Producto</h1>


      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">

          <Formik
            enableReinitialize
            initialValues={ obtenerProducto }
            validationSchema={ schemaValidation }
            onSubmit={ handleUpdateProduct }
          >

            { props => {

              const { handleSubmit, handleChange, handleBlur, values, touched, errors } = props;
              const { nombre, existencia, precio  } = values; 
              
              return (<form
                onSubmit={ handleSubmit }
                className="bg-white shadow-md px-8 pt-6 pb-8 mb-8"
              >

                <div className="mb-4 ">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                    Nombre
                  </label>

                  <input 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
                    id="nombre"
                    type="text"
                    placeholder="Nombre Producto"
                    value={ nombre }
                    onChange={ handleChange }
                    onBlur={ handleBlur }
                  />
                </div>

                { touched.nombre && errors.nombre && (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p> { errors.nombre } </p>
                    </div>
                  )
                }

                <div className="mb-4 ">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="existencia">
                    Existencia
                  </label>

                  <input 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
                    id="existencia"
                    type="number"
                    placeholder="Cantidad disponible"
                    value={ existencia }
                    onChange={ handleChange }
                    onBlur={ handleBlur }
                  />
                </div>

                { touched.existencia && errors.existencia && (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p> { errors.existencia } </p>
                    </div>
                  )
                }

                <div className="mb-4 ">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">
                    Precio
                  </label>

                  <input 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
                    id="precio"
                    type="number"
                    placeholder="Precio Producto"
                    value={ precio }
                    onChange={ handleChange }
                    onBlur={ handleBlur }
                  />
                </div>

                { touched.precio && errors.precio && (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p> { errors.precio } </p>
                    </div>
                  )
                }
                
                <input
                  type="submit"
                  className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                  value="Guardar Cambios"
                />

              </form>)
            }}
          </Formik>
        </div>
      </div>

    </Layout>
    
  );
}
 
export default EditarProducto;