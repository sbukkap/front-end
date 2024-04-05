import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo-png.png";
import { useSelector, useDispatch } from "react-redux";
import {
  signOutUserStart,deleteUserSuccess,deleteUserFailure
} from "../redux/user/userSlice";
export const Navbar = () => {
  const [menuDraw, setMenuDraw] = useState(false);
  const { currUser } = useSelector((state) => state.user_mod);
  const dispatchAction = useDispatch();

  const handleSignOut = async () => {
    try {
      dispatchAction(signOutUserStart());
      const res = await fetch("/api/v1/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatchAction(deleteUserFailure(data.message));
        return;
      }
      dispatchAction(deleteUserSuccess(data));
    } catch (error) {
      dispatchAction(deleteUserFailure(data.message));
    }
  };

  // const [searchQuery, setSearchQuery] = useState("");
  // const handleSearch = async () => {
  //   console.log(searchQuery)

  //   if (searchQuery.trim() !== "") {
  //     try {
  //       const response = await fetch(`/api/v1/cars/searchCars?query=${searchQuery.trim()}`, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${currUser?.data?.token}`
  //         }
  //       });

  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }

  //       const data = await response.json();
  //       setCars(data.data);
  //     } catch (error) {
  //       console.error("Error fetching search results:", error);
  //       setError("Failed to fetch search results. Please try again later.");
  //     } finally {
  //       setIsLoading(false); // End loading
  //     }
  //   }
  // };

  return (
    <nav className="navbar flex items-center justify-between px-10 py-4 bg-floralwhite">
      <Link to="/" className="text-2xl font-semibold">
        <img src={logo} alt="Logo" className="h-10 mr-4" />
        HPASS RENTALS
      </Link>
      {/* <form className="flex items-center">
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-400 py-2 px-4 rounded-l-lg focus:outline-none"
        />
        <button
          type="button"
          className="text-white bg-black py-2 px-4 rounded-r-lg"
          onClick={handleSearch}
        >
          <FaSearch />
        </button>
      </form> */}
      <div className="md:hidden">
        <button
          className="block text-gray-800 hover:text-gray-900 focus:text-gray-900 focus:outline-none"
          onClick={() => setMenuDraw(!menuDraw)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuDraw ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>
      <div
        className={`md:flex flex-col md:flex-row md:items-center md:w-auto w-full ${
          menuDraw ? "block" : "hidden"
        }`}
      >
        <ul className="md:flex flex-col md:flex-row md:ml-auto md:mr-0 items-center">
          <li>
            <a href="/" className="md:ml-4 text-lg font-bold">
              Home
            </a>
          </li>
          {currUser?.data?.username === "admin" && (
            <li>
              <Link to="/modify-listing" className="md:ml-4 text-lg font-bold">
                Admin Page
              </Link>
            </li>
          )}
          <li>
            <Link to="/Listingpage" className="md:ml-4 text-lg font-bold">
              View Listings
            </Link>
          </li>
          {currUser?.data?.username?  (
             <li>
             <button
               onClick={handleSignOut}
               className="md:ml-4 text-lg font-bold"
             >
               Sign Out
             </button>
           </li>
          ) : (
            <li>
            <Link to="/sign-up" className="md:ml-4 text-lg font-bold">
              Register
            </Link>
          </li>
          )}
        </ul>
      </div>
    </nav>
  );
};
