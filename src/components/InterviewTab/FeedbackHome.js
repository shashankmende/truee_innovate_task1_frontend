import React, { useState } from "react";
import Header from "../Navbar/Header/Header";
import Feedback from "./Feedback";

const FeedbackHome = ({width}) => {
  return (
    <div>
      <Header />
      <div className="lg:text-md">
     <Feedback page={"Home"}/>
     </div>
    </div>
  );
};

export default FeedbackHome;
