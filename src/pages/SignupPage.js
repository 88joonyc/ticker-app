import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import * as sessionActions from "../store/session";

function SignupPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  if (sessionUser) return <Navigate to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === password) {
      setErrors([]);
      return dispatch(sessionActions.signup({ fullName: `${fname} ${lname}`, email, password }))
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
    }
    return setErrors(['Confirm Password field must be the same as the Password field']);
  };

  return (
    <>
        <div className="grid md:grid-cols-[1fr,1fr] relative">
            <div className="border-r-2 border-black h-[100vh] hidden md:block">
                <img className="object-cover w-[100vw] h-[100vh]" src="https://w0.peakpx.com/wallpaper/905/425/HD-wallpaper-im-batman-929-amoled-bat-black-dark-hero-logo-man-marvel-minimal-minimalist-night-simple-super-vector-white.jpg"/>
                <div className="absolute top-[200px] text-white text-6xl">
                    <div className="ml-20 mr-30 w-[35%] font-light">
                        Create your login
                    </div>
                    <div className="text-sm ml-20 mr-36 mt-16 grid grid-cols-[1fr,1fr] ">
                        We'll need your name, email address, and a unique password. You'll use this login to access Batman's hood next time.
                    </div>
                </div>

            </div>
            <div className=" relative">
                <form className="ml-4 md:ml-20 h-[80vh] md:h-auto" onSubmit={handleSubmit}>
                    <ul>
                        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                    </ul>
                    <div className="w-full pr-4 md:pr-20 mt-40">
                        <div className="text-sm md:text-lg">
                            Enter your first and last name as they appear on your government ID.
                        </div>
                        <div className="flex gap-x-4 mt-8">
                
                            <input
                            placeholder="First name"
                            className="border p-4 w-full text-sm md:text-lg mt-8 font-light" 
                            type="text"
                            value={fname}
                            onChange={(e) => setFname(e.target.value)}
                            required
                            />
                    
                            <input
                            placeholder="Last name"
                            className="border p-4 w-full text-sm md:text-lg mt-8 font-light" 
                            type="text"
                            value={lname}
                            onChange={(e) => setLname(e.target.value)}
                            required
                            />
                        </div>

                        <input
                        placeholder="Email address"
                        className="border p-4 w-full text-sm md:text-lg mt-8 font-light" 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        />
                
                        <input
                        placeholder="Password (min. 10 characters)"
                        className="border p-4 w-full text-sm md:text-lg mt-8 font-light" 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />
                    </div>
                    <div className="mt-16 text-sm">
                        <div>Already started?</div>
                        <Link className="underline underline-offset-4 hover:text-gray-600" to='/login'>Log in to complete your application</Link>
                    </div>
                <div className="absolute bottom-8 right-0 w-full border-t-2 border-black">
                    <button className="py-4 bg-black text-white font-bold text-xs rounded-full px-16 float-right mr-10 mt-8 hover:bg-gray-600" type="submit">Continue</button>

                </div>
                </form>

            </div>
        </div>
    </>
  );
}

export default SignupPage;