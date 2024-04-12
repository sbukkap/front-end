import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

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
  
  
  return (
    <div>
      <h2>Shopping Cart</h2>
      {cartItems && cartItems[0] && cartItems[0].items.map(item => (
        <div key={item._id}>
          <p>{`${item.carMake} ${item.carModel}`} - ${item.pricePerDay}</p>
          <button onClick={() => handleDeleteFromCart(item._id)}>Delete</button>
        </div>
      ))}
      <p>Total Price: ${totalPrice}</p>
      <button>Proceed to Payment</button>
    </div>
  );
};


export default Cart;


