import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Layout from '../components/Layaout'
import { useMutation, gql } from '@apollo/client'
import { useRouter } from 'next/router'

const AUTENTICA_USUARIO = gql`
  mutation autenticarUsuario($input: AutenticarInput) {
    autenticarUsuario(input: $input) {
      token
    }
  }
`

const Login = () => {

  const { push } = useRouter();

  // state para el mensaje
  const [mensaje, setMensaje] = useState(null)

  const [ autenticarUsuario ] = useMutation(AUTENTICA_USUARIO);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().email('El email no es valido').required('El email no puede ir vacio'),
      password: Yup.string().required('El password es obligatorio')
    }),
    onSubmit: async valores => {
      try {
        const { email, password } = valores;
        
        const { data } = await autenticarUsuario({
          variables: {
            input: {
              email,
              password
            }
          }
        })

        setMensaje('Autenticando...')

        const { token } = data.autenticarUsuario

        localStorage.setItem('token', token)

        setTimeout( () => {
          setMensaje(null)
          return push('/')
        }, 1000 )

      } catch (error) {
        setMensaje(error.message)
        setTimeout( () => setMensaje(null), 2000 )
      }
    }
  })

  const { email, password } = formik.values;
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

        <h1 className="text-center text-2xl text-white font-light">Login</h1>

        <div className="flex justify-center mt-5">
          <div className="w-full max-w-sm">
            <form
            onSubmit={ handleSubmit }
              className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
            >
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
                value="Iniciar Sesion"
              />

            </form>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default Login