import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

function LoginPage () {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { signin, errors: loginErrors, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) navigate('/tasks')
  }, [isAuthenticated])

  return (
    <div className='flex h-[calc(100vh-100px)] items-center justify-center'>
      <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md'>
        {
          loginErrors.map((error, i) => (
            <div key={i} className='bg-red-500 p-2 text-white text-center my-2'>
              {error}
            </div>
          ))
        }
        <h1 className='text-2xl font-bold'>Login</h1>
        <form onSubmit={handleSubmit(async (values) => { signin(values) })}>
          <input type='email' placeholder='email' {...register('email', { required: true })} className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2' />
          {errors.email && <p className='text-red-500'>Email is required!</p>}

          <input type='password' placeholder='password' {...register('password', { required: true })} className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2' />
          {errors.password && <p className='text-red-500'>Password is required!</p>}

          <button className='bg-indigo-500 px-4 py-1 rounded-sm' type='submit'>Signin</button>
        </form>
        <p className='flex gap-x-2 justify-between my-4'>Do you not have an account yet?<Link className='text-sky-500' to='/register'>Signup</Link></p>
      </div>
    </div>
  )
}

export default LoginPage
