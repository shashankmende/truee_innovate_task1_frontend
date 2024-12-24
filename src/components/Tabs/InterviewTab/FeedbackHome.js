import React, { useEffect } from "react";
import Header from "../../Navbar/Header/Header";
import Feedback from "./Feedback";
import { useCustomContext } from "../../../context/context";

const FeedbackHome = () => {
  const { page,setPage }=useCustomContext()


  useEffect(() => {
    document.title = "Job Portal - Interview Feedback";
    setPage("Home") 
  }, []);

  return (
    <div>
      <Header />
      <div className="lg:text-md">
     <Feedback page={page} />
     </div>
    </div>
  );
};

export default FeedbackHome;
