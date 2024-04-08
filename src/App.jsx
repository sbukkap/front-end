import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Createlisting from "./pages/Createlisting";
import Listingpage from "./pages/Listingpage";
import { Navbar } from "./components/Navbar";
import styles from "./App.module.css";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import PrivateRoute from "./components/RoutingFolder/PrivateRoute";
import AdminRentalApprove from "./pages/Admin/AdminRentalApprove";
import ItemLocation from "./components/MapComponents/ItemLocation";
import CarDetailsPage from "./pages/CarDetailsPage";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./pages/Payment/CheckoutForm";
import { useDispatch, useSelector } from "react-redux";
import { update } from "firebase/database";
import { arrayUnion } from "firebase/firestore";
import Cart from "./pages/Cart";


const stripePromise = loadStripe(
  "pk_test_51Oy4XrKDZmp8eDSbYQN6Fam0JxugYee73NJNswgl4U5QrS20yiYAYDseStP3Orj0YnIMFjWWMwWX3r5i0qBE1wVX00FJbX1o30"
);

function App() {
  const { currUser } = useSelector((state) => state.user_mod);
  const { clientSecret } = useSelector((state) => state.user_mod);
  const [cartExists, setCartExists] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const userId = currUser?.data?.token;
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const checkCartExistence = async () => {
    try {
      const response = await fetch(`/api/v1/shoppingCart/isShoppingCartPresent/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currUser?.data?.token}`,
        },
      });
      const data = await response.json();
      // console.log(data.data.shoppingCart);
      setCartExists(data.data.shoppingCart);
      // console.log(cartExists)
    } catch (error) {
      console.error('Error checking shopping cart existence:', error);
    }
  };

  const fetchCartItems = async () => {
    try {
      const response = await fetch(`/api/v1/shoppingCart/get_Shoppingcart/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currUser?.data?.token}`,
        },
      });
      const data = await response.json();
      setCartItems(data.data);
      // console.log('hi')
      // console.log(data.data)
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  // const handleUpdateCartItem = async (updatedItem) => {
  //   // console.log(updatedItem)
  //   try {
  //     const response = await fetch(`/api/v1/shoppingCart/updateShoppingcart/${userId}`, {
  //       method: 'PATCH',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${currUser?.data?.token}`,
  //       },
  //       body: JSON.stringify(updatedItem),
  //     });
  //     if (response.ok) {
  //       const data = await response.json();
  //       setCartItems(data.data);
  //       alert('Item added to cart');
  //     } else {
  //       // Handle error
  //       throw new Error('Network response was not ok');
  //     }
  //   } catch (error) {
  //     console.error('Error updating item in cart:', error);
  //   }
  // };

//   const handleUpdateCartItem = async (newItem) => {
//     try {
//         const updatedItems = [...cartItems, newItem]; // Merge existing cart items with the new item
//         const response = await fetch(`/api/v1/shoppingCart/updateShoppingcart/${userId}`, {
//             method: 'PATCH',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${currUser?.data?.token}`,
//             },
//             body: JSON.stringify({ items: updatedItems }), // Send the updated array of items
//         });
//         if (response.ok) {
//             const data = await response.json();
//             const ar = [data.data];
//             console.log(ar)
//             setCartItems(ar);
//             // setCartItems(data.data);
//             alert('Item added to cart');
//         } else {
//             // Handle error
//             throw new Error('Network response was not ok');
//         }
//     } catch (error) {
//         console.error('Error updating item in cart:', error);
//     }
// };

const handleUpdateCartItem = async (newItem) => {
  try {
      // Flatten the cartItems array
      const flattenedItems = cartItems.flatMap(cart => cart.items);
      // Merge existing cart items with the new item
      const updatedItems = [...flattenedItems, newItem];
      const response = await fetch(`/api/v1/shoppingCart/updateShoppingcart/${userId}`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${currUser?.data?.token}`,
          },
          body: JSON.stringify({ items: updatedItems }), // Send the updated array of items
      });
      if (response.ok) {
          const data = await response.json();
          setCartItems([data.data]); // Set the updated cartItems
          // console.log([data.data])
          alert('Item added to cart');
      } else {
          // Handle error
          throw new Error('Network response was not ok');
      }
  } catch (error) {
      console.error('Error updating item in cart:', error);
  }
};

  const handleAddToCart = async (item) => {
    setIsAddedToCart(true);
    try {
      // Ensure cart existence is checked before proceeding
      await checkCartExistence(); // Wait for the result of checkCartExistence()
      // console.log(cartExists)
      if (!cartExists) {
        // console.log('created new')
        setCartExists(true);
        const response = await fetch(`/api/v1/shoppingCart/createShoppingcart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currUser?.data?.token}`,
          },
          body: JSON.stringify({
            user_id: userId,
            items: [item],
            isDeleted: true,
            // Other necessary fields
          }),
        });
        
        if (response.ok) {
          // Cart created successfully
          const data = await response.json();
          const arr = [data.data];
          setCartItems(arr);
          // console.log(arr)
          alert('Item added to cart');
        } else {
          throw new Error('Network response was not ok');
        }
      } else {
        // console.log('existing')
        await fetchCartItems();        
        // const updatedItems = [...cartItems, item]; // Merge existing cart items with the new item
        // setCartItems(updatedItems);
        // const updatedItem = [...cartItems, item];
        // setCartItems(updatedItem);
        // console.log(updatedItem);
        await handleUpdateCartItem(item);

      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };  


  const appearance = {
    theme: "stripe",
    fontSize: "16px",
    fontFamily: "Arial, sans-serif",
    
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className={styles.App}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/Createlisting" element={<Createlisting />} />
          <Route path="/Listingpage" element={<Listingpage handleAddToCart={handleAddToCart} isAddedToCart={isAddedToCart} />} />
          <Route path="/Cart" element={<Cart cartItems={cartItems} />} />
          <Route element={<PrivateRoute />}>
            <Route path="/modify-listing" element={<AdminRentalApprove />} />
          </Route>
          <Route path="/itemLocation" element={<ItemLocation />} />
          <Route path="/carDetails/:carId" element={<CarDetailsPage />} />
          {clientSecret && (
            <Route
              path="/checkout"
              element={
                <Elements options={options} stripe={stripePromise}>
                  <CheckoutForm />
                </Elements>
              }
            />
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
