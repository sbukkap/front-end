import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const Cart = (props) => {
  const items = props.cartItems;
  const i = items[0];
  const ii = i.items;
  const [totalPrice, setTotalPrice] = useState(0);

  // console.log(ii);
  // const ListingCard = ({ car }) => {

  //   const placeholderImage = "../../assets/car2.jpg";
  //   const formattedAvailableFrom = formatDate(car.availableFrom);
  //   const formattedAvailableTo = formatDate(car.availableTo);
    
  //   return (
  // <div className="max-w-sm rounded overflow-hidden shadow-lg m-4 bg-white">
  //   <div className="h-48 bg-gray-200 flex items-center justify-center">
  //     <img
  //   className="object-cover h-full w-full"
  //   src={(car.image_url && car.image_url[0]) || placeholderImage}
  //   alt={`${car.carMake} ${car.carModel}`}
  // />
  
  //   </div>
  //   <div className="px-6 py-4">
  //     <div className="font-bold text-xl mb-1">{`${car.carMake} ${car.carModel}`}</div>
  //     <ul className="list-none">
  //       <li className="mb-1 font-serif">Year: {car.year}</li>
  //       <li className="mb-1 font-serif">Mileage: {car.mileage}</li>
  //       <li className="mb-1 font-serif">Transmission: {car.transmission}</li>
  //       <li className="mb-1 font-serif">Fuel Type: {car.fuelType}</li>
  //       <li className="mb-1 font-serif">Seats: {car.seats}</li>
  //       <li className="mb-1 font-serif">Price Per Day: ${car.pricePerDay}</li>
  //       <li className="mb-1 font-serif">Available From: {formattedAvailableFrom}</li>
  //       <li className="mb-1 font-serif">Available To: {formattedAvailableTo}</li>
  //       <li className="mb-1 font-serif">
  //         <Link to={`/itemLocation?lat=${car.location.lat}&lng=${car.location.lng}`} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
  //           View item location
  //         </Link>
  //         <Link
  //             to={`/carDetails/${car._id}`}
  //             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
  //           >
  //             View Details
  //           </Link>
  //       </li>
  //       <li>
  //       <button onClick={() => handleDeleteFromCart(car)} className="bg-red-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded ml-4 focus:outline-none focus:shadow-outline">
  //         Remove from Cart
  //       </button>
  //       </li>
  //     </ul>
  //   </div>  
  // </div>
  
  //   );
  // };
  

  // Function to delete an item from the cart
  
  const handleDeleteFromCart = async (itemId) => {
    try {
      const response = await fetch(`/api/v1/shoppingCart/deleteItemShoppingcart/${userId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Item deleted successfully
        setCartItems(prevItems => prevItems.filter(item => item._id !== itemId)); // Remove the deleted item from the cart items state
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('Error deleting item from cart:', error);
    }
  };

  useEffect(() => {
    // Calculate total price when cart items change
    const calculateTotalPrice = () => {
      let total = 0;
      ii.forEach(item => {
        total += item.pricePerDay; // Assuming pricePerDay is the price of each item
      });
      setTotalPrice(total);
    };

    calculateTotalPrice();
  }, [ii]);
  
  return (
    <div>
      <h2>Shopping Cart</h2>
      {ii.map(item => (
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
