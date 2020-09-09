import React, { useState } from 'react';
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Layout from '../components/Layaout';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';

const NUEVO_CLIENTE = gql`
  mutation nuevoCliente($input: ClienteInput!){
    nuevoCliente(input: $input){
      id
      nombre
      apellido
      empresa
      email
      telefono
    }
  }
`

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

const NuevoCliente = () => {

  const { push } = useRouter();

   // state para el mensaje
   const [mensaje, setMensaje] = useState(null)

  /**
   * Actualizar cache de de Apollo
   * cuando redireccione a clinete no me sale el registro nuevo del cliente
   * eso es debido a que apollo almacena los datos en cache y no hace una 
   * 2da peticion, ahora si quiero el nuevo registro tengo que hacer una nueva
   * peticion pero este afectarar a mi performance lo que se puede hacer es 
   * actualizar el cache.rounded
   * 
   * Con Apollo devTools en la seccon de cache ROOT_QUERY puevo ver los objetos
   * almacenados y buscar donde quiero almacenar el nuevo registro
   */
  const [ nuevoCliente ] = useMutation(NUEVO_CLIENTE, {
    update(cache, { data: { nuevoCliente } }) {
      // obtener el objeto de cahce que deseamos actualizar
      const { obtenerClientesVendedor } = cache.readQuery({ query: OBTENER_CLIENTES_USUARIO })

      // reescribimos el cache ( el cache nunca se debe modificar), hay que mutarlo
      cache.writeQuery({
        query: OBTENER_CLIENTES_USUARIO,
        data: {
          obtenerClientesVendedor: [ ...obtenerClientesVendedor, nuevoCliente  ]
        }
      })
    } 
  })

  const formik = useFormik({
    initialValues: {
      nombre: '',
      apellido: '',
      empresa: '',
      email: '',
      telefono:''
    },
    validationSchema: Yup.object({
      email: Yup.string().email('El email no es valido').required('El email no puede ir vacio'),
      nombre: Yup.string().required('El nombre del cliente es obligatorio'),
      apellido: Yup.string().required('El apellido del cliente obligatorio'),
      empresa: Yup.string().required('El empresa del cliente obligatorio')
    }),
    onSubmit: async valores => {
      
      const { nombre, apellido, empresa, email, telefono } = valores

      try {
        
        const { data } = await nuevoCliente({
          variables: {
            input: {
              nombre, apellido, empresa, email, telefono
            }
          }
        })

        return push('/')

      } catch (error) {
        setMensaje(error.message)
        setTimeout( () => setMensaje(null), 2000 )
      }
    }
  })

  const { nombre, apellido, empresa, email, telefono } = formik.values;
  const { handleSubmit, handleChange, handleBlur, touched,  errors} = formik;

  const showMessage = () => {
    return (
      <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
        <p>{mensaje}</p>
      </div>
    )
  }

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Nuevo Cliente</h1>

      {mensaje && showMessage() }

      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <form
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
                placeholder="Nombre Cliente"
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
              ) }

            <div className="mb-4 ">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">
                Apellido
              </label>

              <input 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
                id="apellido"
                type="text"
                placeholder="Apellido Cliente"
                value={ apellido }
                onChange={ handleChange }
                onBlur={ handleBlur }
              />
            </div>

            { touched.apellido && errors.apellido && (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">Error</p>
                  <p> { errors.apellido } </p>
                </div>
              ) }

            <div className="mb-4 ">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="empresa">
                Empresa
              </label>

              <input 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
                id="empresa"
                type="text"
                placeholder="Empresa Cliente"
                value={ empresa }
                onChange={ handleChange }
                onBlur={ handleBlur }
              />
            </div>

            { touched.empresa && errors.empresa && (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">Error</p>
                  <p> { errors.empresa } </p>
                </div>
              ) }

            <div className="mb-4 ">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>

              <input 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Email Cliente"
                value={ email }
                onChange={ handleChange }
                onBlur={ handleBlur }
              />
            </div>

            { touched.email && errors.email && (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">Error</p>
                  <p> { errors.email } </p>
                </div>
              ) }

            <div className="mb-4 ">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">
                Telefono
              </label>

              <input 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
                id="telefono"
                type="tel"
                placeholder="Telefono Usuario"
                value={ telefono }
                onChange={ handleChange }
                onBlur={ handleBlur }
              />
            </div>

            <input
              type="submit"
              className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
              value="Registrar Cliente"
            />

          </form>
        </div>
      </div>
    </Layout>
  );
}
 
export default NuevoCliente;