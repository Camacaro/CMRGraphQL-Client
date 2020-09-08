import React, { useState } from 'react'
import Layout from '../components/Layaout'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';

const NUEVA_CUENTA = gql`
  mutation nuevoUsuario($input: UsuarioInput) {
    nuevoUsuario(input: $input){
      id
      nombre
      apellido
      email
    }
  }
`
const NuevaCuenta = () => {

  // state para el mensaje
  const [mensaje, setMensaje] = useState(null)

  // Mutation para crear nuevos usuario
  const [ nuevoUsuario ] = useMutation(NUEVA_CUENTA)

  // routing
  const { push } = useRouter();

  // validacion del formulario
  const formik = useFormik({
    initialValues: {
      nombre: '',
      apellido: '',
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required('El nombre es obligatorio'),
      apellido: Yup.string().required('El apellido es obligatorio'),
      email: Yup.string().email('El email no es valido').required('El email es obligatorio'),
      password: Yup.string().required('El password no puede ir vacio').min(6, 'El password debe ser de al menos 6 caracteres')
    }),
    onSubmit: async valores => {
      console.log('enviando', valores)
      const { nombre, apellido, email, password } = valores
      try {
        const { data } =  await nuevoUsuario ({
          variables: {
            input: {
              nombre,
              apellido,
              email,
              password,
            }
          }
        })

        console.log(data)

        // usuario creado correctamente
        setMensaje(`Se creo correctamente el Usuario ${data.nuevoUsuario.nombre}`)
        setTimeout( () => {
          setMensaje(null)
          push('/login')
        }, 2000 )

        // Redirigir otro compoennte

      } catch (error) {
        console.log('Error en submit crear usuario')
        console.log(error.message)
        setMensaje( error.message )

        setTimeout( () => {
          setMensaje(null)
        }, 2000 )
      }
    }
  });

  const { nombre, apellido, email, password } = formik.values;
  const { handleSubmit, handleChange, handleBlur, touched,  errors} = formik;

  const showMessage = () => {
    return (
      <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
        <p>{mensaje}</p>
      </div>
    )
  }

  return (
    <div>
      <Layout>
        {mensaje && showMessage() }

        <h1 className="text-center text-2xl text-white font-light">Crear Nueva Cuenta</h1>

        <div className="flex justify-center mt-5">
          <div className="w-full max-w-sm">
            <form
              onSubmit={ handleSubmit }
              className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
            >
              <div className="mb-4 ">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                  Nombre
                </label>

                <input 
                  autoComplete="off"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
                  id="nombre"
                  type="nombre"
                  placeholder="Nombre Usuario"
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
                  type="apellido"
                  placeholder="Apellido Usuario"
                  value={ apellido }
                  onChange={ handleChange }
                  onBlur={ handleBlur }
                  autoComplete="off"
                />
              </div>

              { touched.apellido && errors.apellido && (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">Error</p>
                  <p> { errors.apellido } </p>
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
                  placeholder="Email Usuario"
                  value={ email }
                  onChange={ handleChange }
                  onBlur={ handleBlur }
                  autoComplete="off"
                />
              </div>

              { touched.email && errors.email && (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">Error</p>
                  <p> { errors.email } </p>
                </div>
              ) }

              <div className="mb-4 ">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>

                <input 
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="Password Usuario"
                  value={ password }
                  onChange={ handleChange }
                  onBlur={ handleBlur }
                  autoComplete="off"
                />
              </div>

              { touched.password && errors.password && (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">Error</p>
                  <p> { errors.password } </p>
                </div>
              ) }

              <input
                type="submit"
                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                value="Crear Cuenta"
              />

            </form>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default NuevaCuenta