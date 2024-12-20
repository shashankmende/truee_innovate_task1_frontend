import React from "react";
import Header from "../../Navbar/Header/Header";
import Feedback from "./Feedback";
import { useCustomContext } from "../../../context/context";

const FeedbackHome = () => {
  const { page }=useCustomContext()
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
