import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ListingCard } from './Listingpage';

const Cart = ({ cartItems, setCartItems }) => {
  const { currUser } = useSelector((state) => state.user_mod);
  const userId = currUser ? currUser.data.username : null;
  
  const [totalPrice, setTotalPrice] = useState(0);

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
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const calculateTotalPrice = () => {
    let total = 0;
    if (cartItems && cartItems[0] && cartItems[0].items) {
      cartItems[0].items.forEach(item => {
        total += item.pricePerDay;
      });
    }
    setTotalPrice(total);
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    calculateTotalPrice(); 
  }, [cartItems]);

  const handleDeleteFromCart = async (itemId) => {
    try {
      // Send DELETE request to the backend to delete the specified cart item
      const response = await fetch(`/api/v1/shoppingCart/deleteItemShoppingcart/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currUser?.data?.token}`, // Include authorization header if needed
          user_id: userId
        },
      });
  
      // Check if the response is successful
      if (response.ok) {

        setCartItems((prevItems) => {
          // Create a copy of the current cartItems state
          const updatedCart = { ...prevItems[0] };
          
          // Filter the items array to remove the item with the specified ID
          updatedCart.items = updatedCart.items.filter((item) => item._id !== itemId);
  
          // Return the updated cart as an array with one element (to maintain original structure)
          return [updatedCart];
        });

        // alert('Item deleted successfully!');
      } else {
        // Handle error case
        console.error('Error deleting item:', response.statusText);
        alert('Failed to delete the item. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting item from cart:', error);
      alert('Failed to delete the item. Please try again.');
    }
  };
  
  // return (
  //   <div>
  //     <h2>Shopping Cart</h2>
  //     {cartItems && cartItems[0] && cartItems[0].items.map(item => (
  //       <div key={item._id} className="px-6 py-4">
  //         <div className="font-bold text-xl mb-1">{`${item.carMake} ${item.carModel}`}</div>
  //         <ul className="list-none">
  //           <li className="mb-1 font-serif">Year: {item.year}</li>
  //           <li className="mb-1 font-serif">Mileage: {item.mileage}</li>
  //           <li className="mb-1 font-serif">Transmission: {item.transmission}</li>
  //           <li className="mb-1 font-serif">Fuel Type: {item.fuelType}</li>
  //           <li className="mb-1 font-serif">Seats: {item.seats}</li>
  //           <li className="mb-1 font-serif">Price Per Day: ${item.pricePerDay}</li>
  //           <li className="mb-1 font-serif">Available From: {item.formattedAvailableFrom}</li>
  //           <li className="mb-1 font-serif">Available To: {item.formattedAvailableTo}</li>
  //           {/* <li className="mb-1 font-serif">
  //             <Link to={`/itemLocation?lat=${item.location.lat}&lng=${item.location.lng}`} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
  //               View item location
  //             </Link>
  //             <Link to={`/carDetails/${item._id}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  //               View Details
  //             </Link>
  //           </li> */}
  //           <li>
  //             <button onClick={() => handleDeleteFromCart(item._id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ml-4 focus:outline-none focus:shadow-outline">
  //               Delete
  //             </button>
  //           </li>
  //         </ul>
  //       </div>
  //     ))}
  //     <p>Total Price: ${totalPrice}</p>
  //     <button>Proceed to Payment</button>
  //   </div>
  // );

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-6">
        SHOPPING CART
      </h1>

      {/* Render cart items */}
      {cartItems && cartItems[0] && cartItems[0].items.map(item => (
        <div key={item._id} className="flex items-center justify-between bg-black p-4 rounded shadow-md mb-4">
          {/* Car details */}
          <div className="flex flex-col text-white">
            <p className="font-bold">{`${item.carMake} ${item.carModel}`}</p>
            <p>Price Per Day: ${item.pricePerDay}</p>
          </div>

          {/* Delete button */}
          <button
            onClick={() => handleDeleteFromCart(item._id)}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ml-4 focus:outline-none focus:shadow-outline"
          >
            Delete
          </button>
        </div>
      ))}

      {/* Total price */}
      <div className="font-bold text-right mb-4">
        Total Price: ${totalPrice}
      </div>

      {/* Proceed to payment button */}
      <div className="text-right">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Proceed to Payment
        </button>
      </div>
    </div>
  );
  

};


export default Cart;


