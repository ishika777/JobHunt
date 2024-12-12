import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setLoading } from "@/redux/authSlice";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const UpdateProfileDialog = ({ open, setOpen }) => {
    const { loading } = useSelector((state) => state.auth);
    const {user} = useSelector((store) => store.auth)
    const dispatch = useDispatch()
    const [input, setInput] = useState({
        fullname : user?.fullname || "",
        email : user?.email || "",
        phoneNumber : user?.phoneNumber || "",
        bio : user?.profile?.bio || "",
        skills : user?.profile?.skills?.map(skill => skill),
        file : user?.profile?.resume || null
    })
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
        console.log(selectedFile)
        setInput((prev) => {
          return {
            ...prev,
            file : selectedFile,
          };
        });
      };
      const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData()
        formData.append("fullname", input.fullname)
        formData.append("email", input.email)
        formData.append("phoneNumber", input.phoneNumber)
        formData.append("bio", input.bio)
        formData.append("skills", input.skills)
        if(input.file){
            formData.append("file", input.file)
        }
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers : {
                    "Content-Type" : "multipart/form-data"
                },
                withCredentials : true
            })
            if(res.data.success){
                dispatch(setUser(res.data.user))
                setOpen(false)
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error)
            toast(error.message)
        }finally{
            dispatch(setLoading(false));
        }
      };
  return (
    <div>
      <Dialog open={open}>
        <DialogContent className="sm:max-w-[500px]" onInteractOutside={()=> setOpen(false)}>
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
            <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitHandler}> 
            <div className="grid gap-4 py-4">
             
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input onChange={changeInputHandler} value={input.fullname} id="name" name="name" className="col-span-3"></Input>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input onChange={changeInputHandler} value={input.email} id="email" type="email" name="email" className="col-span-3"></Input>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phoneNumber" className="text-right">Phone Number</Label>
                <Input onChange={changeInputHandler} value={input.phoneNumber} id="phoneNumber" name="phoneNumber" className="col-span-3"></Input>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bio" className="text-right">Bio</Label>
                <Input onChange={changeInputHandler} value={input.bio} id="bio" name="bio" className="col-span-3"></Input>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="skills" className="text-right">Skills</Label>
                <Input onChange={changeInputHandler} value={input.skills} id="skills" name="skills" className="col-span-3"></Input>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="file" className="text-right">Resume</Label>
                <Input onChange={changeFileHandler} id="file" name="file" type="file" accept="application/pdf" className="col-span-3"></Input>
              </div>

            </div>
          <DialogFooter>
          {loading ? (
            <Button className="w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              Update
            </Button>
          )}
          </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateProfileDialog;
