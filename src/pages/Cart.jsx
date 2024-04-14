import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ListingCard } from './Listingpage';

const Cart = () => {
  const { currUser } = useSelector((state) => state.user_mod);
  const userId = currUser ? currUser.data.username : null;
  
  const [cartItems, setCartItems] = useState([]);
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
        },
      });
  
      // Check if the response is successful
      if (response.ok) {
        // Update the cartItems state to remove the deleted item
        setCartItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
        alert('Item deleted successfully!');
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
  //       <div key={item._id}>
  //         <p>{`${item.carMake} ${item.carModel}`} - ${item.pricePerDay}</p>
  //         <button onClick={() => handleDeleteFromCart(item._id)}>Delete</button>
  //       </div>
  //     ))}
  //     <p>Total Price: ${totalPrice}</p>
  //     <button>Proceed to Payment</button>
  //   </div>
  // );

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
      <h2>Shopping Cart</h2>
      {cartItems && cartItems[0] && cartItems[0].items.map(item => (
        <div key={item._id}>
          {/* Replace the inner div structure with the ListingCard component */}
          <ListingCard
            key={item._id} // Use the item._id as a unique key
            car={item} // Pass the item as the car prop
            handleAddToCart={handleDeleteFromCart} // Pass the delete function as handleAddToCart for now
            isButtonClicked={false} // Use this prop if you have logic for disabling the Add to Cart button
          />
          {/* Add a delete button to allow deleting items from the cart */}
          <button
            onClick={() => handleDeleteFromCart(item._id)}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ml-4 focus:outline-none focus:shadow-outline"
          >
            Delete
          </button>
        </div>
      ))}
      <p>Total Price: ${totalPrice}</p>
      <button>Proceed to Payment</button>
    </div>
  );
  

};


export default Cart;


