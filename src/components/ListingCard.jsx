import React from 'react';

const ListingCard = ({ car, onDelete, onEdit }) => {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
      <div className="flex flex-col">
        <div className="p-1">
          <div className="uppercase tracking-wide text-sm text-black font-bold">{car.carMake}</div>
          <a href="#" className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">{car.carModel}</a>
          <div className="uppercase tracking-wide text-sm text-black font-bold">{car.year}</div>
        </div>
      </div>
      <div className="flex items-center">
        <button onClick={() => onDelete(car.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-400 transition duration-300">
          Delete
        </button>
      </div>
    </div>
  );
};

export default ListingCard;