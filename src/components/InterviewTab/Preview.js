import React, { useRef, useState } from "react";
import CandidateMiniTab from "./MiniTabs/Candidate";
import SkillsTabComponent from "./MiniTabs/Skills";
import OverallImpressions from "./MiniTabs/OverallImpressions";
import Header from "../Navbar/Header/Header";
import { useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { IoIosStar } from "react-icons/io";

const ratingLst = [
  { id: 1, name: "Poor", stars: 2, color: "red" },
  { id: 2, name: "Ok", stars: 3, color: "yellow" },
  { id: 3, name: "Good", stars: 4, color: "orange" },
  { id: 4, name: "Excellent", stars: 5, color: "green" },
];

const Preview = () => {
  const location = useLocation();
  const { state } = location;

  const previewRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true); // Show loader
    if (previewRef.current) {
      try {
        const element = previewRef.current;
        const canvas = await html2canvas(element, {
          scale: 2,
        });
        const imageData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const contentHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.internal.pageSize.setHeight(contentHeight);
        pdf.addImage(imageData, "PNG", 0, 0, pdfWidth, contentHeight);
        pdf.save("Preview.pdf");
      } catch (error) {
        console.error("Error generating PDF:", error);
      } finally {
        setIsLoading(false); // Hide loader
      }
    } else {
      setIsLoading(false); // Hide loader if ref is not available
    }
  };

  return (
    <div>
      <Header className="sticky top-0 bg-white z-50 shadow-md" />
      <div ref={previewRef} className="flex flex-col justify-between">
        <h2 className="px-8 h-[40px] flex items-center border-b text-[#227a8a] text-xl font-semibold border-gray-300">
          Interview Feedback - Preview
        </h2>
        <div className="p-8 border border-gray-500 rounded-md m-8">
          <div className="border-b-2 border-[gray] pb-12">
            <CandidateMiniTab />
          </div>
          <div className="grid grid-cols-5 gap-4 my-4 border-b-gray-500 pb-12">
            {/* Left column (60%) */}
            <div className="col-span-3">
              <h2 className="font-semibold text-xl">Skills:</h2>
              <SkillsTabComponent tab={state?.tab} />
            </div>

            {/* Right column (40%) */}
            <div className="col-span-2 flex flex-col items-center">
              <ul className="stars-container flex gap-8">
                {ratingLst.map((rating) => (
                  <li
                    key={rating.id}
                    className={`text-${rating.color} flex flex-col items-center cursor-pointer gap-3`}
                  >
                    <div className="flex">
                      {Array.from({ length: rating.stars }, (_, index) => (
                        <IoIosStar
                          key={index}
                          style={{ color: rating.color }}
                          className="text-2xl"
                        />
                      ))}
                    </div>
                    <p>{rating.name}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="w-[60%]">
            <h2 className="font-semibold text-xl mb-4 w-[250px]">Overall Impressions:</h2>
            <OverallImpressions />
          </div>
        </div>
      </div>

      <div className="flex justify-end px-8 pb-4 gap-6">
        <button
          onClick={handleDownload}
          className="bg-[#227a8a] text-white rounded-md px-4 py-2"
        >
          {isLoading ? "Downloading..." : "Download"}
        </button>
        <button className="bg-[#227a8a] text-white rounded-md px-4 py-2">
          Submit
        </button>
      </div>

      {/* Loader */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="loader border-t-transparent border-white border-4 rounded-full w-12 h-12 animate-spin"></div>
            <p className="text-white mt-4">Generating PDF...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Preview;
