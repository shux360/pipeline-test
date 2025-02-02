// import React from 'react'
// import LayOut from '../../../components/LayOut'

// const Alerts = () => {
//   return (
//     <LayOut title='Alerts'></LayOut>
//   )
// }

// export default Alerts

import React from "react";
import LayOut from "../../../components/LayOut";

const EAlerts = () => {
  const alerts = [
    {
      id: 1,
      title: "QSearch Request",
      status: "Approved",
      date: "24 Nov 2023 at 0:30 AM",
      description: "O4M approved the request OTT20",
      actions: ["Report"],
    },
    {
      id: 2,
      title: "Report",
      status: "Reported",
      date: "25 Nov 2023 at 10:33 AM",
      description: "O4M approved the request OTT20",
      actions: ["Resolve", "Review"],
    },
    {
      id: 3,
      title: "Resolve",
      status: "Resolved",
      date: "26 Nov 2023 at 11:30 AM",
      description: "O4M resolved the request OTT20",
      actions: [],
    },
    {
      id: 4,
      title: "Review",
      status: "Reviewed",
      date: "26 Nov 2023 at 11:30 AM",
      description: "O4M reviewed the request OTT20",
      actions: [],
    },
  ];

  return (
    <LayOut title="Alerts">
      <div className="p-4 sm:ml-72 mt-28 mr-8">
        <h1 className="text-2xl font-semibold text-text3 dark:text-light1 mb-8">
          Alerts 3
        </h1>
        <div className="space-y-6">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-6 bg-white dark:bg-dark4 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-text3 dark:text-light1">
                  {alert.title}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    alert.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : alert.status === "Reported"
                      ? "bg-yellow-100 text-yellow-800"
                      : alert.status === "Resolved"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {alert.status}
                </span>
              </div>
              <p className="mt-2 text-text3 dark:text-light1">
                {alert.description}
              </p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-text3 dark:text-light1">
                  {alert.date}
                </span>
                <div className="space-x-2">
                  {alert.actions.map((action, index) => (
                    <button
                      key={index}
                      className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </LayOut>
  );
};

export default EAlerts;
