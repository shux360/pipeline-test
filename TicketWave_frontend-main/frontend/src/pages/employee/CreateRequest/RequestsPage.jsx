import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import DataTable from "./DataTable";
import LayOut from "@/components/LayOut";

const backendUrl = import.meta.env.VITE_SERVER_DOMAIN;

const RequestsPage = () => {
  const { category } = useParams();
  const location = useLocation();
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);

  // Check for passed data from navigation
    const passedRequests = location.state?.requests;
    console.log("Passed requests:", passedRequests);
 

  useEffect(() => {
    if (passedRequests) {
      // Use the passed requests data
      setRequests(passedRequests);
    } 
  }, [category, passedRequests]);

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

    return (
    <LayOut title='Create Request' >
      <div className="md:w-9/12 w-11/12 min-h-screen my-40 md:ml-80 mx-auto p-8 bg-white dark:bg-dark3 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-indigo-900 dark:text-white">Requests in {category}</h1>
        </div>
        <div>
        <DataTable data={requests} />
        </div>
      </div>
    </LayOut>
  );
};

export default RequestsPage;