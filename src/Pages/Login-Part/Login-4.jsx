import React, { useState, useEffect, useRef } from "react";
import { MdArrowDropDown, MdUpdate } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";
import { GiCancel } from "react-icons/gi";
import { IoIosCopy } from "react-icons/io";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { FaSearch } from 'react-icons/fa';
import { TbCameraPlus } from "react-icons/tb";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import moment from 'moment-timezone';
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import TimezoneSelect from 'react-timezone-select';
import Cookies from 'js-cookie';
import { fetchMasterData } from '../../utils/fetchMasterData';
import { useLocation } from 'react-router-dom';
import { validateSteps } from '../../utils/LoginValidation';

const MultiStepForm = () => {
  const { user } = useAuth0();
  const popupRef = useRef(null);
  const navigate = useNavigate();
  const skillsPopupRef = useRef(null);
  const fileInputRef = useRef(null);
  const location = useLocation();
  const { Freelancer } = location.state || {};
  const [selectedTimezone, setSelectedTimezone] = useState({});
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showDropdownLocation, setShowDropdownLocation] = useState(false);
  const [searchTermLocation, setSearchTermLocation] = useState('');
  const [nameError, setNameError] = useState('');
  const [UserIdError, setUserIdError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [linkedinurlError, setLinkedinurlError] = useState('');
  const [currentroleError, setCurrentroleError] = useState('');
  const [industryError, setIndustryError] = useState('');
  const [experienceError, setExperienceError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [introductionError, setIntroductionError] = useState('');
  const [technologyError, setTechnologyError] = useState('');
  const [skillError, setSkillError] = useState('');
  const [previousExperienceError, setPreviousExperienceError] = useState('');
  const [expertiseLevelError, setExpertiseLevelError] = useState('');
  const [timesError, setTimesError] = useState('');
  const [timeZoneError, setTimeZoneError] = useState('');
  const [preferredDurationError, setPreferredDurationError] = useState('');
  const [step, setStep] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [errors, setErrors] = useState({});

  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [showDropdownIndustry, setShowDropdownIndustry] = useState(false);
  const [industries, setIndustries] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedCurrentRole, setSelectedCurrentRole] = useState('');
  const [showDropdownCurrentRole, setShowDropdownCurrentRole] = useState(false);
  const [CurrentRole, setCurrentRole] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([])
  const [showSkillsPopup, setShowSkillsPopup] = useState(false);
  const [InterviewPreviousExperience, setInterviewPreviousExperience] = useState('');
  const [expertiseLevel, setExpertiseLevel] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [showPopup1, setShowPopup1] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [charCount, setCharCount] = useState(0);
  const [experienceYears, setExperienceYears] = useState('');
  const [searchTermCurrentRole, setSearchTermCurrentRole] = useState('');
  const [searchTermIndustry, setSearchTermIndustry] = useState('');
  const [searchTermTechnology, setSearchTermTechnology] = useState('');
  const [searchTermSkills, setSearchTermSkills] = useState('');
  // const [filePreview, setFilePreview] = useState(user.picture ? user.picture : null);
  const [filePreview, setFilePreview] = useState(null);
  const [times, setTimes] = useState({
    Sunday: [{ startTime: null, endTime: null }],
    Monday: [{ startTime: null, endTime: null }],
    Tuesday: [{ startTime: null, endTime: null }],
    Wednesday: [{ startTime: null, endTime: null }],
    Thursday: [{ startTime: null, endTime: null }],
    Friday: [{ startTime: null, endTime: null }],
    Saturday: [{ startTime: null, endTime: null }]
  });

  const [formData, setFormData] = useState({
    Name: "",
    UserId: "",
    Email: "",
    Phone: "",
    LinkedinUrl: "",
    CountryCode: "+91",
    Role: "Admin",
    RoleId: "66efd7dea968b6eb0f11adfa",
    Profile: "Admin",
    ProfileId: "66f3ceebf4d8a896eeaa2f6b",
    CurrentRole: "",
    industry: "",
    Experience: "",
    location: "",
    Introduction: "",
  });



  const [formData2, setFormData2] = useState({
    Technology: [],
    Skill: [],
    InterviewPreviousExperience: "",
    InterviewPreviousExperienceYears: "",
    InterviewExpertiseLevel: "",
    ExpectedRateMin: "",
    ExpectedRateMax: "",
    IsReadyForMockInterviews: "",
    ExpectedRatePerMockInterviewMin: "",
    ExpectedRatePerMockInterviewMax: "",
    NoShowPolicy: "",

  });

  const [formData3, setFormData3] = useState({
    TimeZone: "",
    PreferredDuration: "",
    Availability: ""
  });
  const [currentStep, setCurrentStep] = useState(0);
  // const params = {
  //   formData,
  //   selectedIndustry,
  //   selectedLocation,
  //   selectedCandidates,
  //   selectedSkills,
  //   setInterviewPreviousExperience,
  //   expertiseLevel,
  //   times,
  //   formData3,
  //   selectedOption,
  // };
  // const params = {
  //   ...(currentStep === 0 && { formData, selectedIndustry, selectedLocation }),
  //   ...(currentStep === 1 && { selectedCandidates, selectedSkills, setInterviewPreviousExperience, expertiseLevel }),
  //   ...(currentStep === 2 && { times, formData3, selectedOption }),
  // };

  const handleNextStep = async () => {
    let hasError = false;

  console.log("currentStep", currentStep);
  
    const params = {
      formData,
      selectedIndustry,
      selectedLocation,
      selectedCandidates,
      selectedSkills,
      setInterviewPreviousExperience,
      expertiseLevel,
      times,
      formData3,
      selectedOption,
    };
  
    if (!validateSteps(currentStep, params, setErrors)) {
      hasError = true;
      console.log("Validation failed");
      return; 
    }
  
    setCurrentStep((prevStep) => {
      const nextStep = prevStep + 1;
      console.log("Navigating to nextStep:", nextStep);
      return nextStep <= 2 ? nextStep : 2; // Ensure it doesn't exceed the max step
    });
  };
  

  const navigateToHome = async () => {
    let hasError = false;

    // Validate Step 3 inputs
    // if (step === 2) {
    //   const hasValidTimeSlot = Object.values(times).some(dayTimes =>
    //     dayTimes.some(timeSlot => timeSlot.startTime && timeSlot.endTime)
    //   );

    //   if (!hasValidTimeSlot) {
    //     setTimesError('At least one valid time slot is required');
    //     hasError = true;
    //   } else {
    //     setTimesError('');
    //   }

    //   if (!formData3.TimeZone) {
    //     setTimeZoneError('Time Zone is required');
    //     hasError = true;
    //   } else {
    //     setTimeZoneError('');
    //   }

    //   if (!selectedOption) {
    //     setPreferredDurationError('Preferred Interview Duration is required');
    //     hasError = true;
    //   } else {
    //     setPreferredDurationError('');
    //   }

    //   // Exit if there are errors
    //   if (hasError) return;
    // }
    // Clear organizationId from local storage
    // localStorage.removeItem('organizationId');

    // Submit and navigate if no errors
    try {
      const response = await handleSubmit();
      navigate('/home'
        //  { state: { data: response.data } 
      );
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const toggleCurrentRole = () => {
    setShowDropdownCurrentRole(!showDropdownCurrentRole);
  };

  const handleRoleSelect = (role) => {
    setSelectedCurrentRole(role);
    handleChange({ target: { name: 'CurrentRole', value: role } });
    setShowDropdownCurrentRole(false);

    setErrors((prevErrors) => ({
      ...prevErrors,
      CurrentRole: '',
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const skillsData = await fetchMasterData('skills');
        setSkills(skillsData);

        const technologyData = await fetchMasterData('technology');
        setServices(technologyData);
        const rolesData = await fetchMasterData('roles');
        setCurrentRole(rolesData);

        const locationsData = await fetchMasterData('locations');
        setLocations(locationsData);

        const industriesData = await fetchMasterData('industries');
        setIndustries(industriesData);
      } catch (error) {
        console.error('Error fetching master data:', error);
      }
    };

    fetchData();
  }, []);

  const handleRemoveCandidate = (index) => {
    setSelectedCandidates(selectedCandidates.filter((_, i) => i !== index));
  };

  const clearRemoveCandidate = () => {
    setSelectedCandidates([]);
  };

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setShowPopup(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const togglePopup = () => {
    setShowPopup((prev) => !prev);
  };


  const handleRemoveSkill = (index) => {
    setSelectedSkills(selectedSkills.filter((_, i) => i !== index));
  };

  const clearSkills = () => {
    setSelectedSkills([]);
  };

  const handleSkillsClickOutside = (event) => {
    if (skillsPopupRef.current && !skillsPopupRef.current.contains(event.target)) {
      setShowSkillsPopup(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleSkillsClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleSkillsClickOutside);
    };
  }, []);

  const toggleSkillsPopup = () => {
    setShowSkillsPopup((prev) => !prev);
  };

  const handleCopy = (event, day) => {
    setSelectedDay(day);
    setSelectedDays([day]);
    setShowPopup1(true);
  };

  const handlePaste = () => {
    const copiedTimes = times[selectedDay];
    setTimes(prevTimes => {
      const newTimes = { ...prevTimes };
      selectedDays.forEach(day => {
        newTimes[day] = copiedTimes.map(time => ({ ...time }));
      });
      return newTimes;
    });
    setShowPopup(false);
    setSelectedDay(null);
    setSelectedDays([]);
  };

  const handleAddTimeSlot = (day) => {
    setTimes(prevTimes => {
      const dayTimes = prevTimes[day];
      return {
        ...prevTimes,
        [day]: [...dayTimes, { startTime: null, endTime: null }]
      };
    });
  };

  const handleRemoveTimeSlot = (day, index) => {
    setTimes(prevTimes => {
      const newTimes = { ...prevTimes };
      if (newTimes[day].length === 1) {
        newTimes[day] = [{ startTime: "unavailable", endTime: "unavailable" }];
      } else {
        newTimes[day] = newTimes[day].filter((_, i) => i !== index);
      }
      return newTimes;
    });
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    const formDataMap = {
      CurrentRole: setFormData,
      Experience: setFormData,
      Introduction: setFormData,
      TimeZone: setFormData3
    };

    // Update form data
    if (formDataMap[name]) {
      formDataMap[name](prevState => ({ ...prevState, [name]: value }));
    } else {
      setFormData(prevState => ({ ...prevState, [name]: value }));
    }

    // Clear errors
    const errorMap = {
      Name: setNameError,
      UserId: setUserIdError,
      Email: setEmailError,
      Phone: setPhoneError,
      LinkedinUrl: setLinkedinurlError,
      CurrentRole: setCurrentroleError,
      Experience: setExperienceError,
      Introduction: setIntroductionError,
      TimeZone: setTimeZoneError
    };

    if (errorMap[name] && value) {
      errorMap[name]('');
    }

    // Set character count for Introduction
    if (name === 'Introduction') {
      setCharCount(value.length);
    }

    // Check if UserId or Email is unique
    // const asyncValidationMap = {
    // UserId: async () => {
    //   try {
    //     const response = await axios.get(`${process.env.REACT_APP_API_URL}/check-userid/${value}`);
    //     setUserIdError(response.data.exists ? 'That User ID is already taken. Please choose another.' : '');
    //   } catch (error) {
    //     console.error('Error checking User ID:', error);
    //   }
    // },
    // Email: async () => {
    //   try {
    //     const response = await axios.get(`${process.env.REACT_APP_API_URL}/check-email/${value}`);
    //     setEmailError(response.data.exists ? 'That email is already in use. Please choose another.' : '');
    //   } catch (error) {
    //     console.error('Error checking Email:', error);
    //   }
    // }
    // };

    // if (asyncValidationMap[name]) {
    //   asyncValidationMap[name]();
    // }
  };

  const handleIndustrySelect = (industry) => {
    setSelectedIndustry(industry.IndustryName);
    setFormData((prevState) => ({
      ...prevState,
      industry: industry.IndustryName,
    }));
    setShowDropdownIndustry(false);

    setErrors((prevErrors) => ({
      ...prevErrors,
      Industry: ''
    }));
  };

  const handleSelectCandidate = (service) => {
    if (!selectedCandidates.includes(service)) {
      setSelectedCandidates((prev) => [...prev, service]);
      setFormData2((prev) => ({
        ...prev,
        Technology: [...prev.Technology, service.TechnologyMasterName],
      }));
    }
    setShowPopup(false);
    setTechnologyError('');
  };

  const handleSelectSkill = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills((prev) => [...prev, skill]);
      setFormData2((prev) => ({
        ...prev,
        Skill: [...prev.Skill, skill.SkillName],
      }));
    }
    setShowSkillsPopup(false);
    setSkillError('');
  };

  const handleRadioChange = (e) => {
    const value = e.target.value;
    setInterviewPreviousExperience(value);
    setPreviousExperienceError('');
    setFormData2((prev) => ({
      ...prev,
      InterviewPreviousExperience: value,
    }));
  };

  const handleRadioChange2 = (e) => {
    const value = e.target.value;
    setExpertiseLevel(value);
    setExpertiseLevelError('');
    setFormData2((prev) => ({
      ...prev,
      InterviewExpertiseLevel: value,
    }));
  };

  const handleChangeExperienceYears = (e) => {
    const { name, value } = e.target;
    setExperienceYears(value);
    setFormData2((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleNoShow = (e) => {
    const { name, value } = e.target;
    setFormData2((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setPreferredDurationError('');
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    let hasError = false;

    // Validation function
    // const validateField = (field, errorSetter, errorMsg) => {
    //   if (!field) {
    //     errorSetter(errorMsg);
    //     hasError = true;
    //   } else {
    //     errorSetter('');
    //   }
    // };

    // Validate Step 0
    // validateField(formData.Name, setNameError, 'Name is required');
    // validateField(formData.UserId, setUserIdError, 'Username is required');
    // validateField(formData.Email, setEmailError, 'Email is required');
    // validateField(formData.Phone, setPhoneError, 'Phonenumber is required');
    // validateField(formData.LinkedinUrl, setLinkedinurlError, 'LinkedIn URL is required');


    // validateField(formData.CurrentRole, setCurrentroleError, 'Current Role is required');
    // validateField(selectedIndustry, setIndustryError, 'Industry is required');
    // validateField(formData.Experience, setExperienceError, 'Experience is required');
    // validateField(selectedLocation, setLocationError, 'Location is required');
    // validateField(formData.Introduction, setIntroductionError, 'Introduction is required');

    // // Validate Step 1
    // validateField(selectedCandidates.length, setTechnologyError, 'Technology is required');
    // validateField(selectedSkills.length, setSkillError, 'Skill is required');
    // validateField(previousExperience, setPreviousExperienceError, 'Previous Experience is required');
    // validateField(expertiseLevel, setExpertiseLevelError, 'Expertise Level is required');

    // Validate Step 2
    // const hasValidTimeSlot = Object.values(times).some(dayTimes =>
    //     dayTimes.some(slot => slot.startTime && slot.endTime)
    // );
    // validateField(hasValidTimeSlot, setTimesError, 'At least one valid time slot is required');
    // validateField(formData3.TimeZone, setTimeZoneError, 'Time Zone is required');
    // validateField(selectedOption, setPreferredDurationError, 'Preferred Interview Duration is required');

    if (hasError) return;

    // Prepare data for submission
    // const userData1 = {
    //   Name: formData.Name,
    //   Email: formData.Email,
    //   RoleId: formData.RoleId,
    //   ProfileId: formData.ProfileId,
    //   UserId: formData.UserId,
    //   // sub: user.sub,
    //   // ...formData,
    //   isFreelancer: Freelancer,
    //   CreatedBy: 'Admin'
    // };
    const userData1 = {
      Name: formData.Name,
      UserId: formData.UserId,
      sub: formData.UserId,
      isFreelancer: Freelancer,
      Email: formData.Email,
    };

    console.log("User Data:", userData1);

    const contactData = {
      ...formData, ...formData2,
      industry: selectedIndustry,
      location: selectedLocation,
      CurrentRole: selectedCurrentRole,
      Technology: selectedCandidates.map(c => c.TechnologyMasterName),
      Skill: selectedSkills.map(s => s.SkillName),
      TimeZone: selectedTimezone.value,
      PreferredDuration: selectedOption,
      isFreelancer: Freelancer,
      contactType: 'Individual'
    };

    console.log("Contact Data:", contactData);

    const availabilityData = Object.keys(times).map(day => ({
      day,
      timeSlots: times[day].filter(slot => slot.startTime && slot.endTime)
        .map(slot => ({ startTime: slot.startTime, endTime: slot.endTime }))
    })).filter(dayData => dayData.timeSlots.length > 0);

    console.log("Availability Data:", availabilityData);

    try {
      console.log("Sending user data to backend...");
      const userResponse = await axios.post(`${process.env.REACT_APP_API_URL}/users`, userData1);
      console.log("User Response:", userResponse.data);

      console.log("Sending contact data to backend...");
      const contactResponse = await axios.post(`${process.env.REACT_APP_API_URL}/contacts`, {
        ...contactData,
        // OwnerId: userResponse.data._id
      });
      console.log("Contact Response:", contactResponse.data);

      console.log("Saving IDs to storage...");
      // localStorage.setItem('contactId', contactResponse.data._id);
      // Cookies.set('userId', userResponse.data._id, { expires: 7 });
      // localStorage.setItem('sub', user.sub);

      console.log("Sending interview availability data to backend...");
      await axios.post(`${process.env.REACT_APP_API_URL}/interviewavailability`, {
        contact: contactResponse.data._id,
        days: availabilityData
      });

      console.log("Navigating to home...");
      navigate('/home', { state: { data: userResponse.data } });
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleCountryCodeChange = (e) => {
    setFormData({ ...formData, CountryCode: e.target.value });
  };

  const handlePhoneInput = (e) => {
    const { value, name } = e.target;
    
    // Remove any non-digit characters
    const numbersOnly = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    const truncatedValue = numbersOnly.slice(0, 10);

    // Clear the error when the user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }));

    // Update form data
    setFormData((prevData) => ({
      ...prevData,
      [name]: truncatedValue,
    }));
  };

  const filteredCurrentRoles = CurrentRole.filter(role =>
    role.RoleName.toLowerCase().includes(searchTermCurrentRole.toLowerCase())
  );

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFilePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleReplace = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDeleteImage = () => {
    setFilePreview(null);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location.LocationName);
    setFormData((prevState) => ({
      ...prevState,
      location: location.LocationName,
    }));
    setShowDropdownLocation(false);
    const timezone = location.TimeZone || moment.tz.guess();
    setSelectedTimezone({ value: timezone, label: timezone });
    setFormData3((prevState) => ({
      ...prevState,
      TimeZone: timezone,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      Location: ''
    }));
  };

  const handleTimezoneChange = (timezone) => {
    setSelectedTimezone(timezone);
    setFormData3((prevState) => ({
      ...prevState,
      TimeZone: timezone.value,
    }));
    setTimeZoneError('');
  };

  useEffect(() => {
    if (selectedLocation) {
      const selectedLocData = locations.find(loc => loc.LocationName === selectedLocation);
      if (selectedLocData) {
        const timezone = selectedLocData.TimeZone || moment.tz.guess();
        setSelectedTimezone({ value: timezone, label: timezone });
        setFormData3((prevState) => ({
          ...prevState,
          TimeZone: timezone,
        }));
      }
    }
  }, [selectedLocation, locations]);

  // const handlePrevStep = () => {
  //   if (step === 0) {
  //     navigate('/profile3');
  //   } else {
  //     setStep(step - 1);
  //   }
  // };

  const handlePrevStep = () => {
    if (currentStep === 0) {
      navigate('/profile3'); // Navigate to '/profile3' if on step 0
    } else {
      setCurrentStep((prevStep) => {
        const previousStep = prevStep - 1;
        console.log("Navigating to previousStep:", previousStep);
        return previousStep >= 0 ? previousStep : 0; // Ensure it doesn't go below step 0
      });
    }
  };
  

  const [resumeName, setResumeName] = useState('');
  const [coverLetterName, setCoverLetterName] = useState('');

  // Handle file upload
  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];

    if (file) {
      // Only allow PDF files
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file.');
        return;
      }

      // Limit file size to 4MB
      if (file.size > 4 * 1024 * 1024) {
        alert('File size should be less than 4MB.');
        return;
      }

      // Set the file name based on the type (Resume or CoverLetter)
      if (type === 'Resume') {
        setResumeName(file.name);
      } else if (type === 'CoverLetter') {
        setCoverLetterName(file.name);
      }
    }
  };

  // Handle file removal
  const handleRemoveFile = (type) => {
    if (type === 'Resume') {
      setResumeName('');
    } else if (type === 'CoverLetter') {
      setCoverLetterName('');
    }
  };

  const resumeInputRef = useRef(null);
  const coverLetterInputRef = useRef(null);

  const [isReady, setIsReady] = useState(null);

  const handleRadioChange3 = (event) => {
    // Update the formData2 object with the selected value
    setFormData2((prevData) => ({
      ...prevData,
      IsReadyForMockInterviews: event.target.value,
    }));

    // Update isReady based on the selected value
    setIsReady(event.target.value === "yes");
  };

  const handleInputChange = (e, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: e.target.value,
    });

    // Clear the error for the specific field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: '',
    }));
  };

  return (
    <div className="flex flex-col h-screen"> {/* Full height container */}
    

      {/* Scrollable Content */}
      <div className="flex-1 ">
          {/* Fixed Header */}
      {Freelancer && (
        <div className="flex justify-center gap-3 py-5 bg-white">
          <div className={`rounded h-2 w-24 border ${currentStep === 0 ? 'bg-orange-300' : currentStep > 0 ? 'bg-custom-blue' : 'bg-gray-200'}`}></div>
          <div className={`rounded h-2 w-24 border ${currentStep === 1 ? 'bg-orange-300' : currentStep > 1 ? 'bg-custom-blue' : 'bg-gray-200'}`}></div>
          <div className={`rounded h-2 w-24 border ${currentStep === 2 ? 'bg-orange-300' : currentStep > 2 ? 'bg-custom-blue' : 'bg-gray-200'}`}></div>
        </div>
      )}
        <form onSubmit={handleSubmit} className="container mx-auto pb-20"> {/* Added bottom padding for footer space */}
          {currentStep === 0 && (
            <div className="mx-10 mt-5 p-5 border border-gray-300 rounded-lg">
              <div className="grid grid-cols-2 gap-8">
                <div className="col-span-1">
                  <div className="text-xl font-bold mb-5">Basic Details:</div>
                  {/* name */}
                  <div className="flex gap-5 mb-2">
                    <label htmlFor="Name" className="block text-sm font-medium leading-6 text-gray-900 w-36">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <div>
                      <input
                        type="text"
                        value={formData.Name}
                        onChange={(e) => handleInputChange(e, 'Name')} // Update value and clear error
                        placeholder="John Doe"
                        className={`border-b ${errors.Name ? 'border-red-500' : 'border-gray-300'} focus:outline-none mb-5 w-96`}
                        autoComplete="off"
                      />
                      {errors.Name && <p className="text-red-500 text-sm -mt-5">{errors.Name}</p>}
                    </div>
                  </div>

                  {/* User name */}
                  <div className="flex gap-5 mb-2">
                    <label htmlFor="UserId" className="block text-sm font-medium leading-6 text-gray-900 w-36">User Name <span className="text-red-500">*</span></label>
                    <div>
                      <input
                        name="UserId"
                        type="text"
                        id="UserId"
                        value={formData.UserId}
                        onChange={(e) => handleInputChange(e, 'UserId')} // Update value and clear error
                        placeholder="John.doe123"
                        className={`border-b ${errors.UserId ? 'border-red-500' : 'border-gray-300'} focus:border-black focus:outline-none mb-5 w-96`}
                        autoComplete="off"
                      />
                      {errors.UserId && <p className="text-red-500 text-sm -mt-5">{errors.UserId}</p>}
                    </div>
                  </div>

                  {/* email */}
                  <div className="flex gap-5 mb-2">
                    <label htmlFor="Email" className="block text-sm font-medium leading-6 text-gray-900 w-36">Email Address <span className="text-red-500">*</span></label>
                    <div>
                      <input
                        name="Email"
                        type="text"
                        id="Email"
                        value={formData.Email}
                        onChange={(e) => handleInputChange(e, 'Email')} // Update value and clear error
                        placeholder="John.doe@gmail.com"
                        className={`border-b ${errors.Email ? 'border-red-500' : 'border-gray-300'} focus:border-black focus:outline-none mb-5 w-96`}
                        autoComplete="off"
                      />
                      {errors.Email && <p className="text-red-500 text-sm -mt-5">{errors.Email}</p>}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex gap-5 mb-2">
                    <label htmlFor="Phone" className="block text-sm font-medium leading-6 text-gray-900 w-36">
                      Phone Number<span className="text-red-500">*</span>
                    </label>
                    <div>
                      <div className="flex gap-2">
                        <select
                          name="CountryCode"
                          id="CountryCode"
                          value={formData.CountryCode || "+91"}
                          onChange={handleInputChange} // Keep the general input handler
                          className="border-b focus:outline-none mb-5 w-20"
                        >
                          <option value=""></option>
                          <option value="+91">+91</option>
                          <option value="+1">+1</option>
                          <option value="+44">+44</option>
                          <option value="+61">+61</option>
                          <option value="+971">+971</option>
                          <option value="+60">+60</option>
                        </select>
                        <input
                          type="text"
                          name="Phone"
                          id="Phone"
                          value={formData.Phone}
                          onChange={handlePhoneInput} // Call the specific handler to update Phone
                          autoComplete="off"
                          maxLength="10"
                          placeholder="Enter 10 digit number"
                          className={`border-b ${errors.Phone ? 'border-red-500' : 'border-gray-300'} focus:border-black focus:outline-none mb-5 w-72`}
                        />
                      </div>
                      {errors.Phone && <p className="text-red-500 text-sm -mt-5">{errors.Phone}</p>}
                    </div>
                  </div>


                  {/* linkedin url */}
                  <div className="flex gap-5 mb-2">
                    <label htmlFor="LinkedinUrl" className="block text-sm font-medium leading-6 text-gray-900 w-36">LinkedIn URL <span className="text-red-500">*</span></label>
                    <div>
                      <input
                        name="LinkedinUrl"
                        type="text"
                        id="LinkedinUrl"
                        value={formData.LinkedinUrl}
                        onChange={(e) => handleInputChange(e, 'LinkedinUrl')} // Update value and clear error
                        placeholder="linkedin.com/in/johndoe"
                        autoComplete="off"
                        className={`border-b ${errors.LinkedinUrl ? 'border-red-500' : 'border-gray-300'} focus:border-black focus:outline-none mb-5 w-96`}
                      />
                      {errors.LinkedinUrl && <p className="text-red-500 text-sm -mt-5">{errors.LinkedinUrl}</p>}
                    </div>
                  </div>

                </div>
                {/* Image Upload Section */}
                <div className="col-span-1">
                  <div className="mt-16 flex justify-center">
                    <div className="w-32 h-32 border border-gray-300 rounded-md flex items-center justify-center relative">
                      <input
                        type="file"
                        id="imageInput"
                        className="hidden"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                      />
                      {filePreview ? (
                        <>
                          <img src={filePreview} alt="Selected" className="w-full h-full object-cover" />
                          <div className="absolute bottom-0 left-0">
                            <button
                              type="button"
                              onClick={handleReplace}
                              className="text-white"
                            >
                              <MdUpdate className="text-xl ml-2 mb-1" />
                            </button>
                          </div>
                          <div className="absolute bottom-0 right-0">
                            <button
                              type="button"
                              onClick={handleDeleteImage}
                              className="text-white"
                            >
                              <ImCancelCircle className="text-xl mr-2 mb-1" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <button
                          className="flex flex-col items-center justify-center"
                          onClick={() => fileInputRef.current.click()}
                          type="button"
                        >
                          <span style={{ fontSize: "40px" }}>
                            <TbCameraPlus />
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-t border-gray-300 my-5" />

              <div className="grid grid-cols-1 gap-3">
                <div className="text-xl font-bold mb-5">Additional Details:</div>
                <div className="flex gap-12">
                  {/* Current Role */}
                  <div className="flex gap-5 mb-2">
                    <label htmlFor="CurrentRole" className="block text-sm font-medium leading-6 text-gray-900 w-36">
                      Current Role <span className="text-red-500">*</span>
                    </label>
                    <div className="relative w-96">
                      <input
                        name="CurrentRole"
                        type="text"
                        id="CurrentRole"
                        value={selectedCurrentRole}
                        onClick={toggleCurrentRole}
                        placeholder="Senior Software Engineer"
                        autoComplete="off"
                        className={`border-b ${errors.CurrentRole ? 'border-red-500' : 'border-gray-300'} focus:border-black focus:outline-none mb-3 w-full`}
                        readOnly
                      />
                      <div className="absolute right-2 -mt-6 transform -translate-y-1/2 cursor-pointer">
                        <MdArrowDropDown className="text-lg text-gray-500" onClick={toggleCurrentRole} />
                      </div>
                      {errors.CurrentRole && <p className="text-red-500 text-sm -mt-3">{errors.CurrentRole}</p>}
                      {showDropdownCurrentRole && (
                        <div className="absolute bg-white border border-gray-300 rounded-lg w-full -mt-3 max-h-60 overflow-y-auto z-10">
                          <div className="border-b">
                            <div className="flex items-center border rounded px-2 py-1 m-2">
                              <FaSearch className="absolute ml-1 text-gray-500" />
                              <input
                                type="text"
                                placeholder="Search Current Role"
                                value={searchTermCurrentRole}
                                onChange={(e) => setSearchTermCurrentRole(e.target.value)}
                                className="pl-8  focus:border-black focus:outline-none w-full"
                              />
                            </div>
                          </div>
                          {filteredCurrentRoles.length > 0 ? (
                            filteredCurrentRoles.map((role) => (
                              <div
                                key={role._id}
                                onClick={() => handleRoleSelect(role.RoleName)}
                                className="cursor-pointer hover:bg-gray-200 p-2"
                              >
                                {role.RoleName}
                              </div>
                            ))
                          ) : (
                            <div className="p-2 text-gray-500">No roles found</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Industry */}
                  <div className="flex gap-5 relative mb-2">
                    <label htmlFor="Industry" className="block text-sm font-medium leading-6 text-gray-900 w-36">
                      Industry <span className="text-red-500">*</span>
                    </label>
                    <div className="relative w-96">
                      <input
                        name="Industry"
                        type="text"
                        id="Industry"
                        value={selectedIndustry}
                        placeholder="Information Technology"
                        autoComplete="off"
                        onClick={() => setShowDropdownIndustry(!showDropdownIndustry)}
                        className={`border-b ${errors.Industry ? 'border-red-500' : 'border-gray-300'} focus:border-black focus:outline-none mb-3 w-full`}
                        readOnly
                      />
                      <div className="absolute right-2 -mt-6 transform -translate-y-1/2 cursor-pointer">
                        <MdArrowDropDown className="text-lg text-gray-500" onClick={() => setShowDropdownIndustry(!showDropdownIndustry)} />
                      </div>
                      {errors.Industry && <p className="text-red-500 text-sm -mt-3">{errors.Industry}</p>}
                      {showDropdownIndustry && (
                        <div className="absolute bg-white border border-gray-300 w-full -mt-3 max-h-60 overflow-y-auto z-10">
                          <div className="border-b">
                            <div className="flex items-center border rounded px-2 py-1 m-2">
                              <FaSearch className="absolute ml-1 text-gray-500" />
                              <input
                                type="text"
                                placeholder="Search Industry"
                                value={searchTermIndustry}
                                onChange={(e) => setSearchTermIndustry(e.target.value)}
                                className="pl-8  focus:border-black focus:outline-none w-full"
                              />
                            </div>
                          </div>
                          {industries.filter(industry =>
                            industry.IndustryName.toLowerCase().includes(searchTermIndustry.toLowerCase())
                          ).length > 0 ? (
                            industries.filter(industry =>
                              industry.IndustryName.toLowerCase().includes(searchTermIndustry.toLowerCase())
                            ).map((industry) => (
                              <div
                                key={industry._id}
                                onClick={() => handleIndustrySelect(industry)}
                                className="cursor-pointer hover:bg-gray-200 p-2"
                              >
                                {industry.IndustryName}
                              </div>
                            ))
                          ) : (
                            <div className="p-2 text-gray-500">No industries found</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-12">
                  {/* Experience */}
                  <div className="flex gap-5 mb-2">
                    <div>
                      <label htmlFor="Experience" className="block text-sm font-medium leading-6 text-gray-900  w-36">
                        Years of Experience <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className="flex-grow">
                      <input
                        type="number"
                        name="Experience"
                        autoComplete="off"
                        value={formData.Experience}
                        placeholder="5 years"
                        onChange={handleChange}
                        id="Experience" min="1" max="15"
                        className={`border-b focus:outline-none mb-3 w-96 ${errors.Experience ? 'border-red-500' : 'border-gray-300 focus:border-black'}`} />
                      {errors.Experience && <p className="text-red-500 text-sm -mt-3">{errors.Experience}</p>}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex gap-5 relative mb-2">
                    <label htmlFor="Location" className="block text-sm font-medium leading-6 text-gray-900 w-36">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <div className="relative w-96">
                      <input
                        name="Location"
                        type="text"
                        id="Location"
                        value={selectedLocation}
                        placeholder="Delhi,India"
                        autoComplete="off"
                        onClick={() => setShowDropdownLocation(!showDropdownLocation)}
                        className={`border-b ${errors.Location ? 'border-red-500' : 'border-gray-300'} focus:border-black focus:outline-none mb-3 w-full`}
                        readOnly
                      />
                      <div className="absolute right-2 -mt-6 transform -translate-y-1/2 cursor-pointer">
                        <MdArrowDropDown className="text-lg text-gray-500" onClick={() => setShowDropdownLocation(!showDropdownLocation)} />
                      </div>
                      {errors.Location && <p className="text-red-500 text-sm -mt-3">{errors.Location}</p>}
                      {showDropdownLocation && (
                        <div className="absolute bg-white border border-gray-300 w-full -mt-3 max-h-60 overflow-y-auto z-10">
                          <div className="border-b">
                            <div className="flex items-center border rounded px-2 py-1 m-2">
                              <FaSearch className="absolute ml-1 text-gray-500" />
                              <input
                                type="text"
                                placeholder="Search Location"
                                value={searchTermLocation}
                                autoComplete="off"
                                onChange={(e) => setSearchTermLocation(e.target.value)}
                                className="pl-8 focus:border-black focus:outline-none w-full"
                              />
                            </div>
                          </div>
                          {(() => {
                            const filteredLocations = locations.filter(location =>
                              location.LocationName && location.LocationName.toLowerCase().includes(searchTermLocation.toLowerCase())
                            );

                            return filteredLocations.length > 0 ? (
                              filteredLocations.map((location) => (
                                <div
                                  key={location._id}
                                  onClick={() => handleLocationSelect(location)}
                                  className="cursor-pointer hover:bg-gray-200 p-2"
                                >
                                  {location.LocationName}
                                </div>
                              ))
                            ) : (
                              <div className="p-2 text-gray-500">No locations found</div>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-12">
                  {/* Resume Section */}
                  <div>
                    <div className="flex gap-5 mb-2">
                      <label htmlFor="Resume" className="block text-sm font-medium leading-6 text-gray-900 w-36">
                        Resume
                      </label>
                      <div className="relative flex w-96">
                        <input
                          ref={resumeInputRef}
                          type="file"
                          name="Resume"
                          id="Resume"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => handleFileUpload(e, 'Resume')}
                        />
                        <div
                          className="bg-blue-500 text-white text-center py-2 px-4 rounded cursor-pointer"
                          onClick={() => resumeInputRef.current.click()}  // Trigger file input click
                        >
                          {resumeName ? 'Uploaded' : 'Upload File'}
                        </div>
                        <p className="text-md text-gray-400 py-2 px-4">Upload PDF only. 4 MB max</p>
                      </div>
                    </div>
                    {resumeName && (
                      <div className="border mt-2 ml-[164px] inline-flex items-center gap-2">
                        <span className="text-gray-600">{resumeName}</span>
                        <button
                          className="text-red-500"
                          onClick={() => handleRemoveFile('Resume')}
                        >
                          <span className="text-xl">×</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Cover Letter Section */}
                  <div>
                    <div className="flex gap-5 mb-2">
                      <label htmlFor="CoverLetter" className="block text-sm font-medium leading-6 text-gray-900 w-36">
                        Cover Letter
                      </label>
                      <div className="relative flex w-96">
                        <input
                          ref={coverLetterInputRef}
                          type="file"
                          name="CoverLetter"
                          id="CoverLetter"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => handleFileUpload(e, 'CoverLetter')}
                        />
                        <div
                          className="bg-blue-500 text-white text-center py-2 px-4 rounded cursor-pointer"
                          onClick={() => coverLetterInputRef.current.click()}  // Trigger file input click
                        >
                          {coverLetterName ? 'Uploaded' : 'Upload File'}
                        </div>
                        <p className="text-md text-gray-400 py-2 px-4">Upload PDF only. 4 MB max</p>
                      </div>
                    </div>
                    {coverLetterName && (
                      <div className="border mt-2 ml-[164px] inline-flex items-center gap-2">
                        <span className="text-gray-600">{coverLetterName}</span>
                        <button
                          className="text-red-500"
                          onClick={() => handleRemoveFile('CoverLetter')}
                        >
                          <span className="text-xl">×</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>



                {/* Introduction */}
                <div className="w-full flex gap-5 mb-2">
                  <label htmlFor="Introduction" className="block text-sm font-medium leading-6 text-gray-900 w-36">
                    Introduction <span className="text-red-500">*</span>
                  </label>
                  <div className="flex-grow mt-3">
                    <textarea
                      name="Introduction"
                      type="text"
                      rows={5}
                      id="Introduction"
                      value={formData.Introduction}
                      onChange={(e) => handleInputChange(e, 'Introduction')}
                      placeholder="I am a technical interviewer with 5+ years of experience in assessing candidates for software engineering roles."
                      autoComplete="off"
                      // onChange={handleChange}
                      className={`border p-2 focus:outline-none mb-3 w-full rounded-md ${errors.Introduction ? 'border-red-500' : 'border-gray-300 focus:border-black'}`}
                    />
                    {errors.Introduction && <p className="text-red-500 text-sm -mt-4">{errors.Introduction}</p>}
                    <div className="text-xs -mt-3 text-gray-600 text-right">{charCount}/500</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {Freelancer && (
            <>
              {currentStep === 1 && (
                <div className="mx-10 mt-7 p-5 border border-gray-300 rounded-lg">
                  <div className=" grid grid-cols-1 gap-2">
                    <div className="text-xl font-bold mb-5">
                      Skills and Experience Details:
                    </div>
                    <div className="flex gap-4 mb-2">
                      <label htmlFor="technology" className="block text-sm font-medium leading-6 text-gray-900 w-72">
                        Select Your Comfortable Technologies <span className="text-red-500">*</span>
                      </label>
                      <div className="flex-grow relative">
                        <div
                          className={`border-b border-gray-300 focus:border-black focus:outline-none -mt-2 w-96 cursor-pointer flex flex-wrap items-center min-h-10 ${technologyError ? 'border-red-500' : 'border-gray-300'}`}
                          onClick={togglePopup}
                        >
                          {selectedCandidates.length === 0 && (
                            <span className="text-gray-400 text-sm pl-2 mt-3">
                              Select Multiple Technologies
                            </span>
                          )}
                          {selectedCandidates.map((candidate, index) => (
                            <div key={index} className="bg-slate-200 rounded px-2 m-1 py-1 inline-block mr-2 text-sm">
                              {candidate.TechnologyMasterName}
                              <button type="button" onClick={() => handleRemoveCandidate(index)} className="ml-2 bg-gray-300 rounded px-2">x</button>
                            </div>
                          ))}
                          {selectedCandidates.length > 0 && (
                            <button type="button" onClick={clearRemoveCandidate} className="bg-slate-300 rounded px-2 absolute top-0 text-sm" style={{ marginLeft: "360px" }}>X</button>
                          )}
                        </div>

                        {showPopup && (
                          <div ref={popupRef} className="absolute bg-white border border-gray-300 w-96 mt-1 max-h-60 overflow-y-auto z-10">
                            <div className="border-b">
                              <div className="flex items-center border rounded px-2 py-1 m-2">
                                <FaSearch className="absolute ml-1 text-gray-500" />
                                <input
                                  type="text"
                                  placeholder="Search Technology"
                                  value={searchTermTechnology}
                                  onChange={(e) => setSearchTermTechnology(e.target.value)}
                                  className="pl-8 focus:border-black focus:outline-none w-full"
                                />
                              </div>
                            </div>
                            {services.filter(service =>
                              service.TechnologyMasterName.toLowerCase().includes(searchTermTechnology.toLowerCase())
                            ).length > 0 ? (
                              services.filter(service =>
                                service.TechnologyMasterName.toLowerCase().includes(searchTermTechnology.toLowerCase())
                              ).map((service) => (
                                <div
                                  key={service._id}
                                  onClick={() => handleSelectCandidate(service)}
                                  className="cursor-pointer hover:bg-gray-200 p-2"
                                >
                                  {service.TechnologyMasterName}
                                </div>
                              ))
                            ) : (
                              <div className="p-2 text-gray-500">No technologies found</div>
                            )}
                          </div>
                        )}
                        {technologyError && <p className="text-red-500 text-sm mt-2">{technologyError}</p>}
                      </div>
                    </div>


                    {/* skills */}
                    <div className="flex gap-4 mb-2">
                      <label htmlFor="skills" className="block text-sm font-medium leading-6 text-gray-900 w-72">
                        Select Skills <span className="text-red-500">*</span>
                      </label>
                      <div className="flex-grow relative">
                        <div
                          className={`border-b border-gray-300 focus:border-black focus:outline-none -mt-2 w-96 cursor-pointer flex flex-wrap items-center min-h-10 ${skillError ? 'border-red-500' : 'border-gray-300'}`}
                          onClick={toggleSkillsPopup}
                          placeholder="Select Multiple Skills"

                        >
                          {selectedSkills.length === 0 && (
                            <span className="text-gray-400 text-sm mt-3 pl-2">
                              Select Multiple Skills
                            </span>
                          )}

                          {selectedSkills.map((skill, index) => (
                            <div key={index} className="bg-slate-200 rounded px-2 py-1 m-1 inline-block mr-2 text-sm">
                              {skill.SkillName}
                              <button type="button"
                                onClick={() => handleRemoveSkill(index)} className="ml-2 bg-gray-300 rounded px-2">x</button>
                            </div>
                          ))}
                          {selectedSkills.length > 0 && (
                            <button type="button" onClick={clearSkills} className="bg-slate-300 rounded px-2 absolute top-0 text-sm" style={{ marginLeft: "360px" }}>X</button>
                          )}
                        </div>


                        {showSkillsPopup && (
                          <div ref={skillsPopupRef} className="absolute bg-white border border-gray-300 w-96 mt-1 max-h-60 overflow-y-auto z-10">
                            <div className="border-b">
                              <div className="flex items-center border rounded px-2 py-1 m-2">
                                <FaSearch className="absolute ml-1 text-gray-500" />
                                <input
                                  type="text"
                                  placeholder="Search Skills"
                                  value={searchTermSkills}
                                  onChange={(e) => setSearchTermSkills(e.target.value)}
                                  className="pl-8  focus:border-black focus:outline-none w-full"
                                />
                              </div>
                            </div>
                            {skills.filter(skill =>
                              skill.SkillName.toLowerCase().includes(searchTermSkills.toLowerCase())
                            ).length > 0 ? (
                              skills.filter(skill =>
                                skill.SkillName.toLowerCase().includes(searchTermSkills.toLowerCase())
                              ).map((skill) => (
                                <div
                                  key={skill._id}
                                  onClick={() => handleSelectSkill(skill)}
                                  className="cursor-pointer hover:bg-gray-200 p-2"
                                >
                                  {skill.SkillName}
                                </div>
                              ))
                            ) : (
                              <div className="p-2 text-gray-500">No skills found</div>
                            )}
                          </div>
                        )}
                        {skillError && <p className="text-red-500 text-sm mt-2">{skillError}</p>}
                      </div>
                    </div>

                    {/* previous experience */}
                    <div className="text-gray-900 text-sm  font-medium leading-6 rounded-lg">
                      <p>Do you have any previous experience conducting interviews? <span className="text-red-500">*</span></p>
                      <div className="mt-3 mb-6">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            className="form-radio text-gray-600"
                            name="interviewpreviousExperience"
                            value="yes"
                            checked={InterviewPreviousExperience === 'yes'}
                            onChange={handleRadioChange}
                          />
                          <span className="ml-2">Yes</span>
                        </label>
                        <label className="inline-flex items-center ml-4">
                          <input
                            type="radio"
                            className="form-radio text-gray-600"
                            name="InterviewPreviousExperience"
                            value="no"
                            checked={InterviewPreviousExperience === 'no'}
                            onChange={handleRadioChange}
                          />
                          <span className="ml-2">No</span>
                        </label>
                      </div>
                    </div>
                    {previousExperienceError && <p className="text-red-500 text-sm  ml-5">{previousExperienceError}</p>}
                    {/* Conditional rendering for years of experience */}
                    {InterviewPreviousExperience === 'yes' && (
                      <div className=" flex items-center mb-6">
                        <label htmlFor="InterviewPreviousExperienceYears" className="block text-sm font-medium leading-6 text-gray-900 mr-6 -mt-5">
                          How many years of experience do you have in conducting interviews? <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          id="InterviewPreviousExperienceYears"
                          name="InterviewPreviousExperienceYears"
                          min="1" max="15"
                          // value={experienceYears}
                          value={formData2.InterviewPreviousExperienceYears}
                          onChange={handleChangeExperienceYears}
                          className="border-b focus:border-black focus:outline-none w-60"
                        />
                      </div>
                    )}

                    {/* Level of Expertise */}
                    <div className="text-gray-900 text-sm font-medium leading-6 rounded-lg -mt-5">
                      <p>Choose your level of expertise (comfort) in conducting interviews <span className="text-red-500">*</span></p>
                      <div className="mt-3 flex">
                        <label className="inline-flex items-center mr-10">
                          <input
                            type="radio"
                            className="form-radio text-gray-600"
                            name="expertiseLevel"
                            value="junior"
                            checked={formData2.InterviewExpertiseLevel === 'junior'}
                            onChange={handleRadioChange2}
                          />
                          <span className="ml-2">Junior (0-3 years)</span>
                        </label>
                        <label className="inline-flex items-center mr-10">
                          <input
                            type="radio"
                            className="form-radio text-gray-600"
                            name="expertiseLevel"
                            value="mid-level"
                            checked={formData2.InterviewExpertiseLevel === 'mid-level'}
                            onChange={handleRadioChange2}
                          />
                          <span className="ml-2">Mid-level (2-5 years)</span>
                        </label>
                        <label className="inline-flex items-center mr-10">
                          <input
                            type="radio"
                            className="form-radio text-gray-600"
                            name="expertiseLevel"
                            value="senior"
                            checked={formData2.InterviewExpertiseLevel === 'senior'}
                            onChange={handleRadioChange2}
                          />
                          <span className="ml-2">Senior (5-8 years)</span>
                        </label>
                        <label className="inline-flex items-center mr-10">
                          <input
                            type="radio"
                            className="form-radio text-gray-600"
                            name="expertiseLevel"
                            value="lead"
                            checked={formData2.InterviewExpertiseLevel === 'lead'}
                            onChange={handleRadioChange2}
                          />
                          <span className="ml-2">Lead (8+ years)</span>
                        </label>
                      </div>
                    </div>
                    {expertiseLevelError && <p className="text-red-500 text-sm ml-5">{expertiseLevelError}</p>}

                    <hr className="border-t border-gray-300 my-5" />
                    {/* Compensation block */}
                    <div>
                      <div className="text-xl font-bold mb-5">
                        Compensation Details:
                      </div>
                      {/* Expected rate per hour */}
                      <div className="flex gap-4 mb-5">
                        <label htmlFor="ExpectedRateMin" className="block text-sm font-medium leading-6 text-gray-900 w-72">
                          Expected rate per hour <span className="text-red-500">*</span>
                        </label>
                        <div className="flex relative gap-5">
                          <div>
                            <label htmlFor="ExpectedRateMin" className="mr-2">Min</label>
                            <input
                              type="number"
                              id="ExpectedRateMin"
                              name="ExpectedRateMin"
                              min="1" max="15"
                              value={formData2.ExpectedRateMin}
                              onChange={handleChangeExperienceYears}
                              className="border-b focus:border-black focus:outline-none w-32"
                            />
                          </div>

                          <div>
                            <label htmlFor="ExpectedRateMax" className="mr-2">
                              Max
                            </label>
                            <input
                              type="number"
                              id="ExpectedRateMax"
                              name="ExpectedRateMax"
                              min="1" max="15"
                              value={formData2.ExpectedRateMax}
                              onChange={handleChangeExperienceYears}
                              className="border-b focus:border-black focus:outline-none w-32"
                            />
                          </div>
                        </div>
                      </div>
                      {/* mock data */}
                      <div>
                        <div className="text-gray-900 text-sm font-medium leading-6 rounded-lg">
                          <p>Are you ready to take mock interviews?<span className="text-red-500">*</span></p>
                          <div className="mt-3 mb-6">
                            <div className="inline-flex items-center">
                              <input
                                type="radio"
                                name="radioGroup"
                                className="form-radio"
                                value="yes"
                                checked={formData2.IsReadyForMockInterviews === "yes"}
                                onChange={handleRadioChange3}
                              />
                              <span className="ml-2">Yes</span>
                            </div>
                            <div className="inline-flex items-center ml-4">
                              <input
                                type="radio"
                                name="radioGroup"
                                className="form-radio"
                                value="no"
                                checked={formData2.IsReadyForMockInterviews === "no"}
                                onChange={handleRadioChange3}
                              />
                              <span className="ml-2">No</span>
                            </div>

                          </div>

                        </div>

                        {/* Conditionally render the second block if "Yes" is selected */}
                        {isReady === true && (
                          <>
                            <div className="flex gap-4 mb-5">
                              <label htmlFor="technology" className="block text-sm font-medium leading-6 text-gray-900 w-72">
                                Expected rate per mock interviews<span className="text-red-500">*</span>
                              </label>
                              <div className="flex relative gap-5">
                                <div>
                                  <label htmlFor="ExpectedRatePerMockInterviewMin" className="mr-2">Min</label>
                                  <input
                                    type="number"
                                    id="ExpectedRatePerMockInterviewMin"
                                    name="ExpectedRatePerMockInterviewMin"
                                    min="1" max="15"
                                    // value={expecetdratemin}
                                    value={formData2.ExpectedRatePerMockInterviewMin}
                                    onChange={handleChangeExperienceYears}
                                    className="border-b focus:border-black focus:outline-none w-32"
                                  />
                                </div>

                                <div>
                                  <label htmlFor="ExpectedRatePerMockInterviewMax" className="mr-2">
                                    Max
                                  </label>
                                  <input
                                    type="number"
                                    id="ExpectedRatePerMockInterviewMax"
                                    name="ExpectedRatePerMockInterviewMax"
                                    min="1" max="15"
                                    // value={expecetdratemax}
                                    value={formData2.ExpectedRatePerMockInterviewMax}
                                    onChange={handleChangeExperienceYears}
                                    className="border-b focus:border-black focus:outline-none w-32"
                                  />
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-900 text-sm">
                              Note: <span className="text-gray-400 text-sm">The final rate will be decided at the time of decision.</span>
                            </p>
                          </>
                        )}
                      </div>



                    </div>

                    {isReady === true && (
                      <>
                        <hr className="border-t border-gray-300 my-5" />
                        {/* policy block */}
                        <div>
                          <div className="text-xl font-bold mb-5">
                            No-Show Policy Details:
                          </div>
                          {/* policy details */}
                          <div className="text-gray-900 text-sm font-medium leading-6 rounded-lg">
                            <p>Policy for No-Show Cases <span className="text-red-500">*</span></p>

                            <div className="mt-3 grid grid-cols-2 gap-4">
                              <label className="inline-flex items-center mb-1">
                                <input
                                  type="radio"
                                  name="NoShowPolicy"
                                  value="25%"
                                  onChange={handleNoShow}
                                  checked={formData2.NoShowPolicy === "25%"}
                                  className="form-radio text-gray-600"
                                />
                                <span className="ml-2">Charge 25% without rescheduling</span>
                              </label>
                              <label className="inline-flex items-center mb-1">
                                <input
                                  type="radio"
                                  name="NoShowPolicy"
                                  value="50%"
                                  onChange={handleNoShow}
                                  checked={formData2.NoShowPolicy === "50%"}
                                  className="form-radio text-gray-600"
                                />
                                <span className="ml-2">Charge 50% without rescheduling</span>
                              </label>
                              <label className="inline-flex items-center mb-1">
                                <input
                                  type="radio"
                                  name="NoShowPolicy"
                                  className="form-radio text-gray-600"
                                  onChange={handleNoShow}
                                  checked={formData2.NoShowPolicy === "75%"}
                                  value="75%" />
                                <span className="ml-2">Charge 75% without rescheduling</span>
                              </label>
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name="NoShowPolicy"
                                  onChange={handleNoShow}
                                  checked={formData2.NoShowPolicy === "100%"}
                                  value="100%" className="form-radio text-gray-600"
                                />
                                <span className="ml-2">Charge 100% with rescheduling option</span>
                              </label>
                            </div>

                          </div>






                        </div>
                      </>
                    )}
                    <div className="flex justify-between ml-5 mb-5 mt-7">
                      <button type="button"   onClick={handlePrevStep} className="w-40 h-10 p-2 rounded-lg text-md bg-gray-300 hover:bg-gray-400">Prev</button>
                      <button
                        onClick={handleNextStep}
                        className="w-40 h-10 p-2 rounded-lg text-md bg-gray-300 hover:bg-gray-400"
                        type="button"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {Freelancer && (
            <>
              {currentStep === 2 && (
                <>
                  <div className="mx-10 mt-7 grid grid-cols-2 gap-8">
                    <div className="text-sm flex">
                      <div>
                        <div className="text-xl">
                          <h2>
                            Availability &nbsp;{" "}
                            <span className="text-red-500 -ml-3">*</span>
                          </h2>
                          {timesError && <p className="text-red-500 text-sm mt-2">{timesError}</p>}
                        </div>
                        {Object.keys(times).map((day) => (
                          <div key={day}>
                            <div className="flex justify-center space-y-8">
                              <span className="w-24 mr-10 mt-7">{day}</span>
                              <div>
                                {times[day].map((timeSlot, index) => (
                                  <div key={index} className={`flex items-center -mt-2 justify-center ${index > 0 ? 'mt-5' : ''}`}>
                                    {timeSlot.startTime === "unavailable" ? (
                                      <span className="p-2 bg-slate-200 text-center w-32 mr-0" style={{ width: "287px" }}>Unavailable</span>
                                    ) : (
                                      <>
                                        {/* start time */}
                                        <div className="w-28 mr-5">
                                          <div className="border-2 border-black">
                                            <div className="flex justify-center">
                                              <div className="text-center">
                                                <DatePicker
                                                  selected={timeSlot.startTime}
                                                  onChange={(date) => {
                                                    const newTimes = [...times[day]];
                                                    newTimes[index].startTime = date;
                                                    setTimes(prevTimes => ({
                                                      ...prevTimes,
                                                      [day]: newTimes
                                                    }));
                                                    if (date && newTimes[index].endTime) {
                                                      setTimesError('');
                                                    }
                                                  }}
                                                  showTimeSelect
                                                  showTimeSelectOnly
                                                  timeIntervals={15}
                                                  dateFormat="h:mm aa"
                                                  placeholderText="Start Time"
                                                  className="p-2 w-full"
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        {/* minus */}
                                        <div className='mr-5'>
                                          <span>
                                            <FaMinus className='text-2xl' />
                                          </span>
                                        </div>
                                        {/* end time */}
                                        <div className="max-w-sm w-28">
                                          <div className="border-2 border-black">
                                            <div className="flex justify-center">
                                              <div className="text-center">
                                                <DatePicker
                                                  selected={timeSlot.endTime}
                                                  onChange={(date) => {
                                                    const newTimes = [...times[day]];
                                                    newTimes[index].endTime = date;
                                                    setTimes(prevTimes => ({
                                                      ...prevTimes,
                                                      [day]: newTimes
                                                    }));
                                                    if (newTimes[index].startTime && date) {
                                                      setTimesError('');
                                                    }
                                                  }}
                                                  showTimeSelect
                                                  showTimeSelectOnly
                                                  timeIntervals={15}
                                                  dateFormat="h:mm aa"
                                                  placeholderText="End Time"
                                                  className="w-full p-2"
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                    {/* cancel */}
                                    <div className='ml-12' style={{ width: '24px', height: '24px' }}>
                                      {(timeSlot.startTime && timeSlot.endTime && timeSlot.startTime !== "unavailable") ? (
                                        <GiCancel
                                          className='text-2xl cursor-pointer'
                                          onClick={() => handleRemoveTimeSlot(day, index)}
                                        />
                                      ) : (
                                        <div style={{ width: '24px', height: '24px' }}></div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {/* plus */}
                              <div>
                                <FaPlus className='text-2xl cursor-pointer mx-5' onClick={() => handleAddTimeSlot(day)} />
                              </div>
                              {/* copy */}
                              <div className='relative'>
                                <IoIosCopy className='text-2xl cursor-pointer' onClick={(e) => handleCopy(e, day)} />
                                {showPopup1 && selectedDay === day && (
                                  <div
                                    className="absolute bg-white p-4 rounded-lg w-72 shadow-md border"
                                    style={{ top: '100%', transform: 'translate(-90%, 10px)', zIndex: 1000 }}
                                  >
                                    <div className='flex justify-between'>
                                      <h2 className="text-lg font-semibold mb-2 mr-2">Duplicate Time Entries</h2>
                                      <GiCancel
                                        className="text-2xl cursor-pointer"
                                        onClick={() => setShowPopup1(false)}
                                      />
                                    </div>
                                    <div>
                                      {Object.keys(times).map(dayOption => (
                                        <label key={dayOption} className="block">
                                          <input
                                            type="checkbox"
                                            value={dayOption}
                                            checked={selectedDays.includes(dayOption)}
                                            disabled={dayOption === selectedDay}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setSelectedDays(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
                                            }}
                                            className="mr-2"
                                          />
                                          {dayOption}
                                        </label>
                                      ))}
                                    </div>
                                    <button type="button" onClick={handlePaste} className="mt-4 bg-blue-500 text-white py-1 px-4 rounded">
                                      Duplicate
                                    </button>
                                    <button type="button" onClick={() => setShowPopup1(false)} className="mt-4 ml-2 bg-gray-500 text-white py-1 px-4 rounded">
                                      Cancel
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        {timesError && <p className="text-red-500 text-sm ml-5">{timesError}</p>}
                      </div>
                    </div>
                    <div className="mt-10">
                      {/* Time Zone */}
                      <div className="flex mb-7 mt-4 overflow-visible">
                        <div>
                          <label
                            htmlFor="TimeZone"
                            className="block text-sm font-medium leading-6 text-gray-900 w-20"
                          >
                            Time Zone <span className="text-red-500">*</span>
                          </label>
                        </div>
                        <div className="flex-grow w-full overflow-visible -mt-1">
                          <div className="w-full overflow-visible">
                            <TimezoneSelect
                              value={selectedTimezone}
                              onChange={handleTimezoneChange}
                              className="TimezonePicker ml-5"
                            />
                            {timeZoneError && <p className="text-red-500 text-sm ml-5 mt-2">{timeZoneError}</p>}
                          </div>
                        </div>
                      </div>

                      {/* preferred interview */}
                      <div>
                        <div className="bg-gray-50 border border-gray-500 text-gray-900 text-sm p-4 rounded-lg">
                          <p className="font-medium">Preferred Interview Duration <span className="text-red-500">*</span></p>
                          <ul className="flex mt-3 text-xs font-medium">
                            <li
                              className={`option hover:bg-gray-500 cursor-pointer inline-block py-1 px-4 border rounded-lg mr-10 ${selectedOption === "30"
                                ? "bg-gray-700 text-white"
                                : "bg-gray-300"
                                }`}
                              onClick={() => handleOptionClick("30")}
                            >
                              30 mints
                            </li>
                            <li
                              className={`option hover:bg-gray-500 cursor-pointer inline-block py-1 px-4 border rounded-lg mr-10 ${selectedOption === "60"
                                ? "bg-gray-700 text-white"
                                : "bg-gray-300"
                                }`}
                              onClick={() => handleOptionClick("60")}
                            >
                              1 Hour
                            </li>
                            <li
                              className={`option hover:bg-gray-500 cursor-pointer inline-block py-1 px-4 border rounded-lg mr-10 ${selectedOption === "90"
                                ? "bg-gray-700 text-white"
                                : "bg-gray-300"
                                }`}
                              onClick={() => handleOptionClick("90")}
                            >
                              1:30 mints
                            </li>
                            <li
                              className={`option hover:bg-gray-500 cursor-pointer inline-block py-1 px-4 border rounded-lg mr-10 ${selectedOption === "120"
                                ? "bg-gray-700 text-white"
                                : "bg-gray-300"
                                }`}
                              onClick={() => handleOptionClick("120")}
                            >
                              2 Hour
                            </li>
                          </ul>
                        </div>
                        {preferredDurationError && <p className="text-red-500 text-sm mt-2">{preferredDurationError}</p>}
                      </div>
                    </div>

                  </div>
                  <div className="flex justify-between ml-5 my-7">
                    <button type="button"   onClick={handlePrevStep} className="w-40 h-10 p-2 rounded-lg text-md bg-gray-300 hover:bg-gray-400">Prev</button>
                    <button
                      type="submit"
                      onClick={navigateToHome}
                      className="w-40 h-10 p-2 rounded-lg text-md bg-gray-300 hover:bg-gray-400"
                    >
                      Save
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </form>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-300">
        <div className="container mx-auto px-10 py-4 flex justify-between">
        <button 
           type="button" 
           onClick={handlePrevStep} 
           className="w-32 h-10 p-2 rounded-lg text-md border border-custom-blue text-custom-blue hover:bg-custom-blue hover:text-white transition-colors"
         >
           Prev
         </button>
          <button
            onClick={Freelancer ? handleNextStep : handleSubmit}
            className="w-32 h-10 p-2 rounded-lg text-md bg-custom-blue text-white"
            type="button"
          >
            {Freelancer ? "Next" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;
