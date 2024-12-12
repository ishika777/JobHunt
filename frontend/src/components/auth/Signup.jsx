import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"
import { setLoading } from "@/redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";



const Signup = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { loading, user } = useSelector((state) => state.auth);
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: null,
  });

  const changeInputHandler = (e) => {
    setInput((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const changeFileHandler = (e) => {
    const selectedFile = e.target.files?.[0]
    setInput((prev) => {
      return {
        ...prev,
        file : selectedFile,
      };
    });
  };

  const submitHnadler = async (e) => {
    e.preventDefault();
    const formData = new FormData()
    formData.append("fullname", input.fullname)
    formData.append("email", input.email)
    formData.append("phoneNumber", input.phoneNumber)
    formData.append("password", input.password)
    formData.append("role", input.role)
    if(input.file){
        formData.append("file", input.file)
    }
    try {
        dispatch(setLoading(true));
        const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
            headers : {
                "Content-Type" : "multipart/form-data"
            },
            withCredentials : true
        })
        if(res.data.success){
            navigate("/login")
            toast.success(res.data.message);
        }
    } catch (error) {
        console.log(error)
        toast(error.message)
    }finally{
        dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if(user){
        navigate("/")
    }
  }, [])

  return (
    <div>
      <Navbar />

      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          onSubmit={submitHnadler}
          className="w-1/2 border border-gray-200 rounded-md p-4 my-10"
        >
          <h1 className="font-bold text-xl mb-5">SignUp</h1>
          <div className="my-2">
            <Label>Full Name</Label>
            <Input
              name="fullname"
              value={input.fullname}
              onChange={changeInputHandler}
              type="text"
              placeholder="Name"
              required
            />
          </div>
          <div className="my-2">
            <Label>Email</Label>
            <Input
              name="email"
              value={input.email}
              onChange={changeInputHandler}
              type="email"
              placeholder="Email"
              required
            />
          </div>
          <div className="my-2">
            <Label>Phone Number</Label>
            <Input
              name="phoneNumber"
              value={input.phoneNumber}
              onChange={changeInputHandler}
              type="text"
              placeholder="Phone Number"
              required
            />
          </div>
          <div className="my-2">
            <Label>Password</Label>
            <Input
              name="password"
              value={input.password}
              onChange={changeInputHandler}
              type="password"
              placeholder="Password"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <RadioGroup
              defaultValue="student"
              className="flex items-center gap-4 my-5"
            >
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="student"
                  checked={input.role === "student"}
                  onChange={changeInputHandler}
                  className="cursor-pointer"
                  id="r1"
                  required
                />
                <Label htmlFor="r1">Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={input.role === "recruiter"}
                  onChange={changeInputHandler}
                  className="cursor-pointer"
                  id="r2"
                  required
                />
                <Label htmlFor="r2">Recruiter</Label>
              </div>
            </RadioGroup>
            <div className="flex items-center gap-2">
              <Label>Profile</Label>
              <Input
                name="file"
                type="file"
                onChange={changeFileHandler}
                accept="image/*"
                className="cursor-pointer"
                required
              />
            </div>
          </div>
          {loading ? (
            <Button className="w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">
            Sign Up
          </Button>
          )}
          <span className="text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">
              Login
            </Link>{" "}
          </span>
        </form>
      </div>
    </div>
  );
};

export default Signup;
