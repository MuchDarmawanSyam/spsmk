import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    Typography,
    Card,
    CardBody,
    CardFooter,
    Input,
    Checkbox,
    Button
  } from "@material-tailwind/react";

export const Login = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <div className="grid grid-cols-1 justify-items-center pt-5">
        <div>
          <Typography variant="h3" color="black">
              Sistem Pendataan Surat Masuk dan Keluar
          </Typography>
        </div>
        <div>
          <img className="w-20 h-20 rounded-md object-cover object-center shadow-xl shadow-blue-gray-900/50" src="https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80" alt="Logo"/>
        </div>
        <Card className="w-96 mt-10 bg-gray-100">
          <div>
            <Typography variant="h3" color="black" className="text-center">
              Login
            </Typography>
          </div>
          <hr className=" border-black mr-4 ml-4" />
          <CardBody className="flex flex-col gap-4">
            <Input label="Email" size="lg" />
            <Input label="Password" size="lg" type={showPassword ? "text" : "password"} value={password} onChange={(e) =>  setPassword(e.target.value)}/>
            <div className="flex justify-end">
              <Checkbox color="indigo" label="Show Password" onChange={() => setShowPassword((prev) => !prev)}/>
            </div>
          </CardBody>
          <CardFooter className="pt-0 grid grid-cols-2 place-items-center">
            <div>
              <Button variant="gradient">
                Reset
              </Button>
            </div>
            <div>
              <Button variant="gradient">
                Login
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      <footer className="w-full inset-x-0 bottom-2 absolute">
        <hr className=" border-black mb-2" />
        <Typography color="blue-gray" className="text-center font-normal">
          &copy; 2023 by Kelompok 2
        </Typography>
      </footer>
    </div>
  )
}

export default Login;