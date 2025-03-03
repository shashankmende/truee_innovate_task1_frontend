import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useCustomContext } from "../../../Context/Contextfetch";

const SubscriptionPlan = () => {
  const {
    userProfile,
  } = useCustomContext();
  const userId = Cookies.get("userId");
  const orgId = Cookies.get("organizationId");
  const organization = Cookies.get("organization");
  console.log("organization",organization)


  const [isAnnual, setIsAnnual] = useState(false);
  const [plans, setPlans] = useState([]);

  const [hoveredPlan, setHoveredPlan] = useState(null);

  const [user] = useState({
    userType: organization === "true" ? "organization" : "individual",
    tenantId: orgId,
    ownerId: userId
  });
  console.log(user);

  // individual
  // organization

  const navigate = useNavigate();

  const toggleBilling = () => setIsAnnual(!isAnnual);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/all-subscription-plans`);
        const data = response.data;


        const filteredPlans = data.filter(
          (plan) => plan.subscriptionType === user.userType
        );


        const formattedPlans = filteredPlans.map((plan) => {
          const monthlyPricing = plan.pricing.find(
            (p) => p.billingCycle === "monthly"
          );
          const annualPricing = plan.pricing.find(
            (p) => p.billingCycle === "annual"
          );

          const calculateDiscountPercentage = (price, discount) =>
            price && discount ? Math.round((discount / price) * 100) : 0;


          return {
            name: plan.name,
            planId: plan._id,
            monthlyPrice: monthlyPricing?.price || 0,
            annualPrice: annualPricing?.price || 0,
            isDefault: plan.name === "Pro" ? true : false,

            features: plan.features.map(
              (feature) => `${feature.name} (${feature.description})`
            ),
            monthlyBadge:
              monthlyPricing?.discountType === "percentage" &&
                monthlyPricing?.discount > 0
                ? `Save ${calculateDiscountPercentage(
                  monthlyPricing.price,
                  monthlyPricing.discount
                )}%`
                : null,
            annualBadge:
              annualPricing?.discountType === "percentage" &&
                annualPricing?.discount > 0
                ? `Save ${calculateDiscountPercentage(
                  annualPricing.price,
                  annualPricing.discount
                )}%`
                : null,

            monthlyDiscount: monthlyPricing?.discountType === "percentage" &&
              monthlyPricing?.discount > 0 ? parseInt(monthlyPricing.discount) : null,

            annualDiscount: annualPricing?.discountType === "percentage" &&
              annualPricing?.discount > 0 ? parseInt(annualPricing?.discount) : null

          };
        });
        setPlans(formattedPlans);
      } catch (error) {
        console.error("Error fetching subscription plans:", error);
      }
    };

    fetchPlans();
  }, [user.userType]);


  const submitPlans = async (plan) => {

    if (!plan) {
      alert("No plan is selected");
      console.warn("No plan selected!");
      return;
    }
    const totalAmount = isAnnual ? plan.annualPrice : plan.monthlyPrice;

    const payload = {
      planDetails: {
        subscriptionPlanId: plan.planId,
        monthlyPrice: plan.monthlyPrice,
        annualPrice: plan.annualPrice,
        monthDiscount: plan.monthlyDiscount,
        annualDiscount: plan.annualDiscount,
      },
      userDetails: {
        tenantId: user.tenantId,
        ownerId: user.ownerId,
        userType: user.userType,
        membershipType: isAnnual ? "annual" : "monthly",
      },
      totalAmount,
      status: "pending",
    };

    try {
      const subscriptionResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/create-customer-subscription`,
        payload
      );

      console.log(
        "Payment and Subscription submitted successfully",
        subscriptionResponse.data
      );
      console.log(organization, plan.name, "organization");
      if ((organization === "false" || !organization) && plan.name === "Base") {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/emailCommon/afterSubscribeFreePlan`, {
          ownerId: Cookies.get("userId"),
          tenantId: Cookies.get("organizationId"),
          ccEmail: "shaikmansoor1200@gmail.com",
        });  
        navigate("/home");
      } else {
        navigate("/payment-details", {
          state: {
            plan: {
              ...plan,
              billingCycle: isAnnual ? "annual" : "monthly",
              user,
              invoiceId: subscriptionResponse?.data?.invoiceId,
            },
          },
        });
      }
      
    } catch (error) {
      console.error("Error submitting subscription:", error);
    }

  };

  const isHighlighted = (plan) =>
    hoveredPlan ? hoveredPlan === plan.name : plan.isDefault;


  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="flex flex-col w-[70%] rounded-lg">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h4 className="text-2xl font-bold text-[#217989]">
            The Right Plan for  {user.userType === "organization" ? "Your Organization" : "You"}
          </h4>
          <p className="text-[#217989] mt-2">
            We have several powerful plans to showcase your business and get
            discovered as creative entrepreneurs. Everything you need.
          </p>
        </div>

        {/* Toggle Section */}
        <div className="flex justify-center items-center gap-4 mb-10">
          <p
            className={`text-[#217989] ${!isAnnual ? "font-semibold text-lg" : "font-medium"
              }`}
          >
            Bill Monthly
          </p>
          <div
            onClick={toggleBilling}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${isAnnual ? "bg-[#217989]" : "bg-[#217989]"
              }`}
          >
            <div
              className={`w-4 h-4 rounded-full shadow-md transform transition-all ${isAnnual
                ? "translate-x-6 bg-yellow-500"
                : "translate-x-0 bg-yellow-500"
                }`}
            ></div>
          </div>
          <p
            className={`text-[#217989] ${isAnnual ? "font-semibold text-lg" : "font-medium"
              }`}
          >
            Bill Annually
          </p>
        </div>

        {/* Plans Section */}
        <div className="flex justify-between items-center">
          {plans.map((plan, index) => (
            <div

              key={plan.name}
              className={`w-[40%] shadow-lg rounded-3xl m-2 relative transition-transform duration-300 p-5
              ${isHighlighted(plan)
                  ? "-translate-y-6 z-10 bg-[#217989] text-white"
                  : 'bg-white text-[#217989] '
                }`}
              onMouseEnter={() => setHoveredPlan(plan.name)}
              onMouseLeave={() => setHoveredPlan(null)}

            >
              <div className="flex justify-between items-center">
                <h5
                  className={`text-xl font-semibold ${isHighlighted(plan) ? "text-white" : "text-[#217989]"}`}
                >
                  {plan.name}
                </h5>
                {isAnnual
                  ? plan.annualBadge && (
                    <span className="bg-white text-purple-600 font-semibold text-sm py-1 px-2 rounded-md">
                      {plan.annualBadge}
                    </span>
                  )
                  : plan.monthlyBadge && (
                    <span className="bg-white text-purple-600 font-semibold text-sm py-1 px-2 rounded-md">
                      {plan.monthlyBadge}
                    </span>
                  )}
              </div>
              <ul className="mt-4 flex text-xs flex-col gap-1 ">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
              <p className="text-3xl font-bold mt-4">
                <span className="text-xl">$</span>
                {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                <span className="text-lg font-medium"> /{isAnnual ? "annual" : "month"}</span>
              </p>
              <button
                onClick={() => submitPlans(plan)}
                className={`w-full font-semibold py-2 mt-4 rounded-lg
                   ${isHighlighted(plan)
                    ? "bg-purple-500 text-white" : "text-purple-600 bg-purple-200"}`}
              >
                Choose
                {/* {highlightedPlan === plan.name ? "Try 1 month" : "Choose"} */}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlan;
