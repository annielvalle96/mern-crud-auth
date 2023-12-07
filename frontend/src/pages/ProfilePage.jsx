import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

function ProfilePage () {
  const { user } = useAuth()

  return (
    <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md'>
      <header className='flex justify-between mb-7'>
        <h1 className='text-2xl font-bold'>User profile</h1>
      </header>
      <label className='flex gap-2'>Username: <p className='text-slate-300'>{user.username}</p></label>
      <label className='flex gap-2'>Email: <p className='text-slate-300'>{user.email}</p></label>
      <p className='flex gap-x-2 justify-between mt-7'>Do you want to see the tasks?<Link className='text-sky-500' to='/tasks'>Task list</Link></p>
    </div>
  )
}

export default ProfilePage
