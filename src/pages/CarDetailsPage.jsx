import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from "react-redux";


function CarDetailsPage() {
  const { currUser } = useSelector((state) => state.user_mod);
  const { carId } = useParams();
  const [carDetails, setCarDetails] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/v1/cars/getSingleCarListings/${carId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currUser?.data?.token}`
          }
        });
        if (!response.ok) {
          throw new Error('Could not fetch car details');
        }
        const data = await response.json();
        setCarDetails(data.data);
        setSelectedImage(data.data.image_url[0]); 
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarDetails();
  }, [carId, currUser?.data?.token]);

  if (isLoading) {
    return <div className="text-center text-xl mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-500 mt-10">Error: {error}</div>;
  }

  if (!carDetails) {
    return <div className="text-center text-xl text-gray-500 mt-10">Car not found</div>;
  }

  return (
    <div className="bg-customecolor-50 min-h-screen pt-10">
      <div className="container mx-auto px-4">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* Image Gallery */}
          <div className="text-center">
          <h1 className="text-4xl md:text-4xl font-bold mb-4 font-mono">{carDetails.carMake} {carDetails.carModel}</h1>
            <img 
              className="w-full max-w-3xl mx-auto h-auto object-contain"
              src={selectedImage}
              alt={`${carDetails.carMake} ${carDetails.carModel}`} 
            />
          </div>
          {/* Thumbnails */}
          <div className="flex justify-center space-x-1 overflow-x-auto py-2">
            {carDetails.image_url.map((image, index) => (
              <img
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`object-cover rounded-lg cursor-pointer p-1 border-2 border-transparent hover:border-blue-500 ${selectedImage === image ? 'border-blue-500' : ''}`}
                src={image}
                alt={`Thumbnail ${index}`}
                style={{ width: '100px', height: '75px' }} 
              />
            ))}
          </div>
          {/* Car Details */}
          <div className="p-6 bg-floralwhite">
          {/* <h1 className="text-3xl font-bold mb-4">{carDetails.carMake} {carDetails.carModel}</h1> */}
            <p className="text-lg "><strong>Year:</strong> {carDetails.year}</p>
            <p className="text-lg "><strong>Mileage:</strong> {carDetails.mileage} miles</p>
            <p className="text-lg "><strong>Transmission:</strong> {carDetails.transmission}</p>
            <p className="text-lg "><strong>Fuel Type:</strong> {carDetails.fuelType}</p>
            <p className="text-lg "><strong>Seats:</strong> {carDetails.seats}</p>
            <p className="text-lg "><strong>Price Per Day:</strong> ${carDetails.pricePerDay}</p>
            <p className="text-lg "><strong>Available From:</strong> {new Date(carDetails.availableFrom).toLocaleDateString()}</p>
            <p className="text-lg "><strong>Available To:</strong> {new Date(carDetails.availableTo).toLocaleDateString()}</p>
            <Link to={`/itemLocation?lat=${carDetails.location.lat}&lng=${carDetails.location.lng}`} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition ease-in-out duration-300"
              >
          View item location
        </Link>
          
              <Link 
                to="/Listingpage"
                className="text-center mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition ease-in-out duration-300"
              >
                Go back
              </Link>
            </div>
          </div>
        </div>
      </div>
  
  );
}

export default CarDetailsPage;
