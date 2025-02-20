import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Cookies from 'js-cookie';
import axios from "axios";
import CryptoJS from "crypto-js";
import logo from '../../../../Dashboard-Part/Images/upinterviewLogo.png'

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    // const [user, setUser] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { id,interviewId } = useParams(); // Meeting ID from URL

    
    const [isChecked,setIsChecked] = useState(false)
    const [candidate,setCandidate] = useState("")//user or host
    const [otp, setOtp] = useState(""); // Store entered OTP
    const [otpError, setOtpError] = useState("") 
    const [resendMessage, setResendMessage] = useState("");
    const [isResending, setIsResending] = useState(false);

    // Function to decrypt the user parameter safely
    // const decrypt = (encryptedText, secretKey = "meet") => {
    //     try {
    //         if (!encryptedText) return null; // Avoid processing null/undefined values
    //         const decodedText = decodeURIComponent(encryptedText);
    //         const bytes = CryptoJS.AES.decrypt(decodedText, secretKey);
    //         const originalText = bytes.toString(CryptoJS.enc.Utf8);
    //         return originalText || null;
    //     } catch (error) {
    //         console.error("Decryption failed:", error);
    //         return null;
    //     }
    // };

    const decrypt = (encryptedText, secretKey = "meet") => {
        try {
            if (!encryptedText) return null; // Avoid processing null/undefined values
    
            const decodedText = decodeURIComponent(encryptedText);
            const bytes = CryptoJS.AES.decrypt(decodedText, secretKey);
            const originalText = bytes.toString(CryptoJS.enc.Utf8);
    
            if (!originalText) return null; // Ensure decryption was successful
    
            try {
                return JSON.parse(originalText); // Convert back to original type if JSON
            } catch {
                return originalText; // Return as-is if not JSON
            }
        } catch (error) {
            console.error("Decryption failed:", error);
            return null;
        }
    };
    

    // Extract user from query params on mount
    useEffect(() => {
        const checkUserSessionAndInitialize =async()=>{

        const params = new URLSearchParams(location.search);
        const encryptedUser = params.get("user");

        if (encryptedUser) {
            const decryptedUser = decrypt(encryptedUser);
            console.log("Decrypted User:", decryptedUser);
            if (decryptedUser) {
                setUser(decryptedUser)
                // const isUserIdExist = Cookies.get("UserId");
                const isUserIdExist = Cookies.get("userId");
                console.log("is user exist",isUserIdExist,decryptedUser)
                console.log("Is used id exist",isUserIdExist)
                if (decryptedUser.user==="host" && isUserIdExist){
                    // navigate('/interview-page',{state:{}})
                    
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/get-token`,{
                    roomName:id,                    
                    identity:isUserIdExist
                })
                // navigate("/interview-page",{state:{roomName:id,token:response.data.token,user:"host"}})
                navigate(`/interview-page/${id}/${interviewId}`,{state:{roomName:id,token:response.data.token,user:"host", interviewerId:decryptedUser.details.id, candidateId:decryptedUser.details.candidateId,round:decryptedUser.details.round}})
                }
            };
        }
    }
    checkUserSessionAndInitialize()

    }, [location.search]);



    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            // const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
            //     email,
            //     password,
            // });

            const loginResponse = await axios.post(`${process.env.REACT_APP_API_URL}/organization/login`,{
                Email:email,
                password,
            })

            if (loginResponse.status===200){
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/get-token`,{
                    roomName:id,                    
                    identity:loginResponse.data.userId
                })
                // navigate("/interview-page",{state:{roomName:id,token:response.data.token,user:"host"}})
                // navigate(`/interview-page/${id}/${interviewId}`,{state:{roomName:id,token:response.data.token,user:"host"}})
                navigate(`/interview-page/${id}/${interviewId}`,{state:{roomName:id,token:response.data.token,user:"host", interviewerId:user.details.id, candidateId:user.details.candidateId,round:user.details.round}})
            }
            

            // console.log("response login",response)
            // localStorage.setItem("token", response.data.token);
            // localStorage.setItem("user", JSON.stringify(response.data.user));
            // const userId = user.details.id 
            // const userDetails = await axios.get(`${process.env.REACT_APP_API_URL}/candidate`)
            // setUser(response.data.user.user);
            // navigate("/interview-page",{state:{roomName:id,}})
        } catch (err) {
            console.log("error ",err)
            setError(err.response?.data?.message || "Login failed");
        }
    };

    const verifyOtp = async () => {
        setOtpError("");

        if (!otp || !user.details.id) {
            setOtpError("Invalid OTP or candidate ID");
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/team-verify-otp`, {
                candidateId:user.details.id,
                teamId:id, 
                otp
            });

            if (response.status === 200) {
                alert("OTP verified successfully!");
                // navigate("/interview-page", { state: { roomName: id,token:user.details.id,user:"public" } });
                navigate(`/interview-page/${id}/${interviewId}`, { state: { roomName: id,token:user.details.id,user:"public" } });
                // navigate(`/interview-page/${id}/${interviewId}`,{state:{roomName:id,token:response.data.token,user:"host"}})
            }
        } catch (err) {
            setOtpError(err.response?.data?.message || "OTP verification failed");
        }
    };


    const resendOtp = async () => {
        setIsResending(true);
        setResendMessage("");

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/team-resend-otp`, {
                candidateId:user.details.id,
                teamId:id
            });

            if (response.status === 200) {
                setResendMessage("OTP has been resent to your email!");
            }
        } catch (err) {
            setResendMessage("Failed to resend OTP. Try again later.");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <>
            {user?.user === "host" && (
                <div className="login-container h-[100vh] w-full flex justify-center items-center">
                    <div className="flex flex-col gap-4">
                    <h2 className="text-center">Host Dashboard</h2>
                    {error && <p className="error">{error}</p>}
                    <form onSubmit={handleLogin} className=" p-10 w-[500px] border flex justify-center flex-col gap-4 shadow-md rounded-md">
                        <div className="flex justify-between">
                            <label htmlFor="email">Email:</label>
                            <input
                            id="email"
                            className="outline-none border-b border-[black] w-48"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div  className="flex justify-between"> 
                            <label htmlFor="password">Password:</label>
                            <input
                            id='password'
                            className="outline-none border-b w-48  border-[black]"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mt-8 flex justify-center">

                        <button type="submit">Login</button>
                        </div>
                    </form>
                    </div>
                </div>
            )}

            {user?.user === "public" && (
                <div className="h-[100vh] m-auto w-[80%]  flex  bg-white">
                   <div className="w-full">
                    <div className="flex justify-center mb-8  w-full mt-16"><img src={logo} alt="upInterview logo" className="w-24"/></div>
                    <div className="flex flex-col gap-4 mb-8">
                        <h2 className="font-bold ">Welcome to upInterview!</h2>
                        <p className="text-[gray]">Thank you for joining us today. Your skills and talent matter, and we're here to ensure 

                            your interview goes as smoothly as possible. Stay confident - you've got this!
                        </p>
                    </div>
                    <div>
                        <h2 className="font-bold mb-3">Terms & Conditions (Interview Guidelines):</h2>
                        <ul className="list-disc flex flex-col gap-3 pl-8">
                            <li className="list-disc text-[gray]">Ensure a stable internet connection throughout the interview to avoid disruptions.</li>
                            <li className="list-disc text-[gray]">Keep your camera turned on at all times unless instructed otherwise by the interview.</li>
                            <li className="list-disc text-[gray]">Avoid background noise and distractions by choosing q quiet, well-lit environment.</li>
                            <li className="list-disc text-[gray]">Do not engage in any form of impersonation or unethical practices during the interview.</li>

                        </ul>


                    </div>
                
                <div className="flex gap-4 mt-8">
                    <input onChange={(e)=>setIsChecked(e.target.checked)} type='checkbox' id="public-user-interview-label"/>
                    <label className="" htmlFor="public-user-interview-label">I agree the terms & conditions</label>
                </div>


                        <div className="my-8">
                        <div className="flex gap-8 items-start">
                            <h2 className="text-[#227a8a] font-medium">Please enter the 5-digit OTP</h2>                                                                            
                            <div className="flex flex-col gap-8">
                                <div className="flex gap-8">
                                <input type="text" placeholder="Enter OTP" className="p-2 rounded-md w-[300px] outline-none border" onChange = {(e)=>{setOtp(e.target.value) ; setOtpError("")}}/>   
                                {/* <button className="font-medium text-[gray]">Resend OTP</button>                          */}
                                <button disabled={isResending} onClick={resendOtp} className="font-medium text-[gray]">
                                {isResending ? "Resending..." : "Resend OTP"}
                            </button>  
                                </div>
                                <div className="flex justify-center">
                        <button disabled={!isChecked} onClick={()=>verifyOtp()} className={`bg-[#227a8a] px-4 py-2 rounded-md text-white ${!isChecked && 'cursor-not-allowed'}`}>verify</button>
                        </div>
                        {otpError && <p className="text-red-500">{otpError}</p>}

                           
                            </div>
                        </div>
                        
                        </div>
                   </div>

                </div>
            )}

            {!user && <div className="w-screen h-screen flex items-center justify-center">Loading...</div>}
        </>
    );
};

export default Login;
