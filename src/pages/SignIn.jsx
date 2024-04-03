import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInSuccess,
  beginingSignin,
  FailedSign,
  setClientSecret
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./ForgotPassword";

export default function SignUp() {
  const [formValues, setFormValues] = useState({});
  const [forgotFlag, setforgotFlag] = useState(false);
  const { currUser, loading, err } = useSelector((state) => state.user_mod);
  const navigator = useNavigate();
  const dispatchAction = useDispatch();
  
  // useEffect to trigger side effects after currUser update
  useEffect(() => {
    if (currUser && currUser.data && currUser.data.token) {
      const fetchStripePayment = async () => {
        try {
          const stripeRes = await fetch("api/v1/rent/stripePayment", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${currUser.data.token}` 
            },
            body: JSON.stringify({ items: [{ id: "payment" }] }),
          });
          if (!stripeRes.ok) {
            throw new Error(`Failed to fetch client secret: ${stripeRes.status}`);
          }
          const stripeData = await stripeRes.json();
          console.log("stripeData", stripeData.data.clientSecret);
          dispatchAction(setClientSecret(stripeData.data.clientSecret));
          navigator("/");
        } catch (error) {
          console.error("Error fetching client secret:", error);
          dispatchAction(FailedSign("Error fetching client secret"));
        }
      };
      fetchStripePayment();
    }
  }, [currUser, dispatchAction, navigator]);

  const formChangeInputHandler = (event) => {
    setFormValues({
      ...formValues,
      [event.target.id]: event.target.value,
    });
  };

  const submitFormHandler = async (event) => {
    event.preventDefault();
    if (!formValues.email || !formValues.password) {
      dispatchAction(FailedSign("Please provide both email and password."));
      return;
    }
    try {
      dispatchAction(beginingSignin());
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });
      const data = await res.json();
      console.log("try console", data);
      if (data.status_code === 401) {
        dispatchAction(FailedSign(data.message));
        return;
      } else if (data.status_code === 200) {
        dispatchAction(signInSuccess(data));
      }
    } catch (err) {
      dispatchAction(FailedSign(err.message));
    }
  };
  
  return (
    <div className=" p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Welcome</h1>
      <form onSubmit={submitFormHandler} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={formChangeInputHandler}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={formChangeInputHandler}
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign in"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <button
          className="text-blue-700 underline cursor-pointer"
          onClick={() => setforgotFlag(!forgotFlag)}
        >
          Forgot Password?
        </button>
        <p>New User?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
      {err && <p className="text-red-500 mt-5">{err}</p>}
      {forgotFlag && <ForgotPassword />}
    </div>
  );
}
