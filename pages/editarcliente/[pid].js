import React from 'react';
import { useRouter } from 'next/router';
import { Formik } from 'formik'
import * as Yup from 'yup'
import { gql, useQuery, useMutation } from '@apollo/client';
import Layout from '../../components/Layaout';
import Swal from 'sweetalert2';

const OBTENER_CLIENTE = gql`
  query obtenerCliente($id: ID!) {
    obtenerCliente(id:$id) {
      nombre 
      apellido
      email
      telefono
      empresa
    }
  } 
`
const ACTUALIZAR_CLIENTE = gql`
  mutation actualizarCliente($id: ID!, $input: ClienteInput) {
    actualizarCliente(id: $id, input: $input) {
      id
      nombre
      apellido
      empresa
      email
      telefono
    }
  }
`;

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

const EditarCliente = () => {

  // leer el query del pathname
  const { query: { id }, push } = useRouter();

  const { data, loading, error } = useQuery(OBTENER_CLIENTE, {
    variables: {
      id
    },
    fetchPolicy: 'cache-and-network'
  });

  const [ actualizarCliente ] = useMutation(ACTUALIZAR_CLIENTE, {
    update(cache, { data: { actualizarCliente } }) {
      // obtener el objeto de cahce que deseamos actualizar
      const { obtenerClientesVendedor } = cache.readQuery({ query: OBTENER_CLIENTES_USUARIO })
      // const q = cache.readQuery({ query: OBTENER_CLIENTE })

      // reescribimos el cache ( el cache nunca se debe modificar), hay que mutarlo
      cache.writeQuery({
        query: OBTENER_CLIENTES_USUARIO,
        data: {
          obtenerClientesVendedor: obtenerClientesVendedor.map(
            cliente => cliente.id === actualizarCliente.id 
            ? actualizarCliente
            : cliente
          )
        }
      })
    } 
  })

  const schemaValidation = Yup.object({
    email: Yup.string().email('El email no es valido').required('El email no puede ir vacio'),
    nombre: Yup.string().required('El nombre del cliente es obligatorio'),
    apellido: Yup.string().required('El apellido del cliente obligatorio'),
    empresa: Yup.string().required('El empresa del cliente obligatorio')
  });

  
  if(loading) return 'Cargando'
  
  const { obtenerCliente } = data;

  const handleUpdateClient = async (valores, funciones) => {

    const {email, nombre, apellido, empresa, telefono } = valores;

    try {
      const {data} = await actualizarCliente({
        variables:{
          id,
          input: {
            email, nombre, apellido, empresa, telefono
          }
        }
      })

      Swal.fire(
        'Actualizado!',
        'Cliente Actualizado correctamente',
        'success'
      )

      push('/')

    } catch (error) {
      console.log(error)
    }
  }

  return ( 
    
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Editar Cliente</h1>

      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">

          <Formik
            validationSchema={ schemaValidation }
            enableReinitialize
            initialValues={ obtenerCliente }
            onSubmit={ handleUpdateClient }
          >
            { props => {
              
              const { handleSubmit, handleChange, handleBlur, values, touched, errors } = props;
              const {email, nombre, apellido, empresa, telefono = '' } = values;

              return (
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
                    value="Editar Cliente"
                  />
                </form>
              )
            } }
            
          </Formik>
        </div>
      </div>

    </Layout>
  );
}
 
export default EditarCliente;