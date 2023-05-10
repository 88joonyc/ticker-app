import React, { useState } from 'react';
import * as sessionActions from '../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Link } from 'react-router-dom';

function LoginPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  if (sessionUser) return (
    <Navigate to="/" />
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  };

  const handleDemo = function (e) {
    e.preventDefault();
    return dispatch(sessionActions.login({ credential:'demo@demo.io', password: 'password' }))
      .catch(async (res) => {
        const data = await res.json();
      });
  };

  return (
    <>
        <div className='grid grid-cols-[1fr,1fr]'>
            <img className='object-cover w-[100vw] h-[100vh]' src='https://r4.wallpaperflare.com/wallpaper/878/875/601/batman-background-wallpaper-c900c81db10acdfb16c7883f406186dd.jpg'/>
            <div className=''>
                <form onSubmit={handleSubmit}>
                <ul>
                    {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                </ul>
                <h1 className='ml-20 mt-[200px] text-2xl mb-10'>Log in to Batman's Hood</h1>
                <div className='w-[400px]'>
                    <label className='flex flex-col mb-4 ml-20'>
                        Email
                        <input
                            className='border p-2 rounded mt-4'
                            type="text"
                            value={credential}
                            onChange={(e) => setCredential(e.target.value)}
                            required
                        />
                    </label>
                    <label className='flex flex-col mb-4 ml-20'>
                        Password
                        <input
                            className='border p-2 rounded mt-4'
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>

                </div>
                <button className='ml-20 mt-10 rounded-full py-4 px-14 bg-midnightPurple font-bold text-white' type="submit">Log in</button>
                <div class="relative py-4 w-[400px] ml-20 mt-10">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-b border-gray-300"></div>
                </div>
                <div class="relative flex justify-center">
                    <span class="bg-white px-4 text-sm text-gray-500">or</span>
                </div>
                </div>
                <button onClick={handleDemo} className='ml-20 mt-10 rounded-full py-4 px-14 bg-midnightPurple font-bold text-white' type="submit">Log in with demo</button>
                <div className='ml-20 mt-10  '>
                    Not in Batman's Hood? <Link to='/signup' className='text-midnightPurple underline font-bold underline-offset-4 hover:text-purple-800 '>Create an account</Link>
                </div>
                </form>
            </div>
        </div>
    </>
  );
}

export default LoginPage;

