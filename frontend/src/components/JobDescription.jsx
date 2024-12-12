import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import { setSingleJob } from '@/redux/jobSlice'
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";

const JobDescription = () => {
    
    const params = useParams()
    const jobId = params.id
    const {singleJob} = useSelector(store => store.job)
    const {user} = useSelector(store => store.auth)

    const isInitiallyApplied = singleJob?.applications?.some(application => application === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isInitiallyApplied)
    
    

    const applyJobHandler = async() =>{
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {withCredentials : true})
            if(res.data.success){
                setIsApplied(true)
                const updatedSingleJob = {...singleJob, applications : [...singleJob.applications, {applicant : user?._id}]}
                dispatch(setSingleJob(updatedSingleJob))
                toast(res.data.message)

            }
        } catch (error) {
            toast(error.response.data.message)
        }
    }

    const dispatch = useDispatch()
    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {withCredentials : true})
                if(res.data.success){
                    dispatch(setSingleJob(res.data.job))
                    setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id))
                }
            } catch (error) {
                toast(error.response.data.message)
            }
        }
        fetchSingleJob()
    }, [dispatch, jobId, user?._id])


  return (
    <div className="max-w-7xl mx-auto my-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl">{singleJob?.title}</h1>
          <div className="flex items-center gap-2 mt-4">
            <Badge className={"text-blue-700 font-bold"} variant="ghost">
            {singleJob?.position} Positions
            </Badge>
            <Badge className={"text-[#F83002] font-bold"} variant="ghost">
            {singleJob?.jobType}
            </Badge>
            <Badge className={"text-[#7209b7] font-bold"} variant="ghost">
            {singleJob?.salary}LPA
            </Badge>
          </div>
        </div>
        <Button
          disabled={isApplied}
          onClick={isApplied ? null : applyJobHandler}
          className={`rounded-lg ${
            isApplied
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-[#7209b7] hover:bg-[#5f32ad]"
          }`}
        >
          {isApplied ? "Already Applied" : "Apply Now"}
        </Button>
      </div>
      <h1 className="border-b-2 border-b-gray-300 font-medium py-4">{singleJob?.description}</h1>
      <div className="my-4">
          <h1 className="font-bold my-1">Role : <span className="pl-4 font-normal text-gray-800">{singleJob?.title}</span></h1>
          <h1 className="font-bold my-1">Location : <span className="pl-4 font-normal text-gray-800">{singleJob?.location}</span></h1>
          <h1 className="font-bold my-1">Description : <span className="pl-4 font-normal text-gray-800">{singleJob?.description}</span></h1>
          <h1 className="font-bold my-1">Experience : <span className="pl-4 font-normal text-gray-800">{singleJob?.experienceLevel} Year(s)</span></h1>
          <h1 className="font-bold my-1">Total Applications : <span className="pl-4 font-normal text-gray-800">{singleJob?.applications.length}</span></h1>
          <h1 className="font-bold my-1">Posted Date : <span className="pl-4 font-normal text-gray-800">{singleJob?.createdAt.split("T")[0]}</span></h1>
      </div>
    </div>
  );
};

export default JobDescription;
