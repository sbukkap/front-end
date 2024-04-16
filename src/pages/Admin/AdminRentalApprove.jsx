import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AdminListingCard from "../../components/AdminListingCard";
import ComplaintListingCard from "../../components/ComplaintListingCard";

export default function CRUDListings() {
  const [carsForApproval, setCarsForApproval] = useState([]);
  const [complaintsFiled, setComplaintsFiled] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currUser } = useSelector((state) => state.user_mod);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch available cars for approval
        const approvalResponse = await fetch(
          "/api/v1/cars/getAllCarsListingsAdmin",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${currUser?.data?.token}`,
            },
          }
        );
        if (!approvalResponse.ok) {
          throw new Error("Network response was not ok");
        }
        const approvalData = await approvalResponse.json();
        setCarsForApproval(approvalData.data);

        // Fetch complaints filed
        const complaintsResponse = await fetch(
          "/api/v1/ticketingSystem/adminGetAllComplaints",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${currUser?.data?.token}`,
            },
          }
        );
        if (!complaintsResponse.ok) {
          throw new Error("Network response was not ok");
        }
        const complaintsData = await complaintsResponse.json();
        setComplaintsFiled(complaintsData.data);
        console.log("complaints", complaintsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleRentalApproval = async (carId) => {
    try {
      const response = await fetch(`/api/v1/cars/adminApprove/${carId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currUser?.data?.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to approve the car listing"
        );
      }

      // Functional update to remove the deleted item from the state
      setCarsForApproval((currentCars) =>
        currentCars.filter((car) => car._id !== carId)
      );
    } catch (error) {
      console.error("Error approving listing:", error);
    }
  };

  const handleComplaintApprove = async (commentId) => {
    try {
      const response = await fetch(`/api/v1/ticketingSystem/updateComplaintResolveStatus/${commentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currUser?.data?.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to approve the car listing"
        );
      }

      // Functional update to remove the deleted item from the state
      setComplaintsFiled((currentComplaints) =>
        currentComplaints.filter((comment) => comment._id !== commentId)
      );
    } catch (error) {
      console.error("Error approving listing:", error);
    }
  };

  const handleRentalDeny = async (carId) => {
    try {
      const response = await fetch(`/api/v1/cars/deleteCarListings/${carId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currUser?.data?.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to delete the car listing"
        );
      }

      // Functional update to remove the deleted item from the state
      setCarsForApproval((currentCars) =>
        currentCars.filter((car) => car._id !== carId)
      );
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  const handleComplaintDeny = async (commentId) => {
    try {
      const response = await fetch(`/api/v1/ticketingSystem/deleteComplaint/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currUser?.data?.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to delete the car listing"
        );
      }

      // Functional update to remove the deleted item from the state
      setComplaintsFiled((currentComplaints) =>
        currentComplaints.filter((comment) => comment._id !== commentId)
      );
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  return (
    <main className="container mx-auto p-4">
      {currUser?.data?.username === "admin" && (
        <>
          <section className="mb-8">
            <h1 className="text-3xl font-bold text-center mb-6">
              AVAILABLE CARS FOR APPROVAL
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isLoading ? (
                <p className="mx-auto">Loading...</p>
              ) : carsForApproval.length > 0 ? (
                carsForApproval.map((car, index) => (
                  <AdminListingCard
                    key={`${car.id}-${Math.random()}`}
                    car={car}
                    onApproval={() => handleRentalApproval(car._id)}
                    onDenial={() => handleRentalDeny(car._id)}
                  />
                ))
              ) : (
                <p className="mx-auto">No available cars for approval.</p>
              )}
            </div>
          </section>

          <section>
            <h1 className="text-3xl font-bold text-center mb-6">
              COMPLAINTS FILED
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isLoading ? (
                <p className="mx-auto">Loading...</p>
              ) : complaintsFiled.length > 0 ? (
                complaintsFiled.map((complaint, index) => (
                  <ComplaintListingCard
                    key={`${complaint.id}-${Math.random()}`}
                    complaint={complaint}
                    onApproval={() => handleComplaintApprove(complaint._id)}
                    onDenial={() => handleComplaintDeny(complaint._id)}
                  />
                ))
              ) : (
                <p className="mx-auto">No complaints filed.</p>
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
}