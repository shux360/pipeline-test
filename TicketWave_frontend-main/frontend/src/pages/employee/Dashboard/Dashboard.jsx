// import LayOut from '../../../components/LayOut'
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
//   } from "@/components/ui/table"

// const Dashboard = () => {
//   return (
//     <LayOut title='Dashboard'>
//         <div className='p-4 sm:ml-72 mt-28'>
//             {/* Requests done but not take actions */}
//             <section className="section1">
//                 <h1 className='text-2xl font-medium mb-8'>Requests done but not take actions</h1>
//                 <div className='bg-white dark:bg-dark3 w-[720px] rounded-xl shadow-lg'>
//                     <Table className='w-full'>
//                         <TableHeader className='font-medium text-lg text-text2 h-14'>
//                         <TableRow>
//                             <TableHead className='dark:text-light1'>Request ID</TableHead>
//                             <TableHead className='dark:text-light1'>Request Type</TableHead>
//                             <TableHead className='dark:text-light1 text-center'>Submission Date</TableHead>
//                             <TableHead className='dark:text-light1'>Status</TableHead>
//                         </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                         <TableRow className='font-medium'>
//                             <TableCell className='font-semibold text-base dark:text-light2'>001</TableCell>
//                             <TableCell className='font-normal'>Loan Approval</TableCell>
//                             <TableCell className='font-normal text-center'>01/01/2024</TableCell>
//                             <TableCell className='font-normal'>Pending</TableCell>
//                         </TableRow>
//                         <TableRow className='font-medium'>
//                             <TableCell className='font-semibold text-base dark:text-light2'>002</TableCell>
//                             <TableCell className='font-normal'>Address Update</TableCell>
//                             <TableCell className='font-normal text-center'>03/01/2024</TableCell>
//                             <TableCell className='font-normal'>Pending</TableCell>
//                         </TableRow>
//                         <TableRow className='font-medium'>
//                             <TableCell className='font-semibold text-base dark:text-light2'>003</TableCell>
//                             <TableCell className='font-normal'>Leave Application</TableCell>
//                             <TableCell className='font-normal text-center'>05/01/2024</TableCell>
//                             <TableCell className='font-normal'>Pending</TableCell>
//                         </TableRow>
//                         </TableBody>
//                     </Table>
//                 </div>
//             </section>
//             {/* Middle of the approving process */}
//             <section className="section2 my-12">
//                 <h1 className='text-2xl font-medium mb-8'>Middle of the approving process</h1>
//                 <div className='bg-white dark:bg-dark3 w-[720px] rounded-xl shadow-lg'>
//                     <Table className='w-full'>
//                         <TableHeader className='font-medium text-lg text-text2 h-14'>
//                         <TableRow>
//                             <TableHead className='dark:text-light1'>Request ID</TableHead>
//                             <TableHead className='dark:text-light1'>Request Type</TableHead>
//                             <TableHead className='dark:text-light1 text-center'>Submission Date</TableHead>
//                             <TableHead className='dark:text-light1'>Current Approver</TableHead>
//                         </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                         <TableRow className='font-medium'>
//                             <TableCell className='font-semibold text-base dark:text-light2'>001</TableCell>
//                             <TableCell className='font-normal'>Loan Approval</TableCell>
//                             <TableCell className='font-normal text-center'>01/01/2024</TableCell>
//                             <TableCell className='font-normal'>Manager Jhon</TableCell>
//                         </TableRow>
//                         <TableRow className='font-medium'>
//                             <TableCell className='font-semibold text-base dark:text-light2'>002</TableCell>
//                             <TableCell className='font-normal'>Address Update</TableCell>
//                             <TableCell className='font-normal text-center'>03/01/2024</TableCell>
//                             <TableCell className='font-normal'>Supervisor Emma</TableCell>
//                         </TableRow>
//                         <TableRow className='font-medium'>
//                             <TableCell className='font-semibold text-base dark:text-light2'>003</TableCell>
//                             <TableCell className='font-normal'>Leave Application</TableCell>
//                             <TableCell className='font-normal text-center'>05/01/2024</TableCell>
//                             <TableCell className='font-normal'>Manager Mike</TableCell>
//                         </TableRow>
//                         </TableBody>
//                     </Table>
//                 </div>
//             </section>
//             {/* Already approved requests */}
//             <section className="section3 mb-12">
//                 <h1 className='text-2xl font-medium mb-8'>Already approved requests</h1>
//                 <div className='bg-white dark:bg-dark3 w-[720px] rounded-xl shadow-lg'>
//                     <Table className='w-full'>
//                         <TableHeader className='font-medium text-lg text-text2 h-14'>
//                         <TableRow>
//                             <TableHead className='dark:text-light1'>Request ID</TableHead>
//                             <TableHead className='dark:text-light1'>Request Type</TableHead>
//                             <TableHead className='dark:text-light1 text-center'>Approval Date</TableHead>
//                             <TableHead className='dark:text-light1'>Final Approver</TableHead>
//                         </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                         <TableRow className='font-medium'>
//                             <TableCell className='font-semibold text-base dark:text-light2'>001</TableCell>
//                             <TableCell className='font-normal'>Loan Approval</TableCell>
//                             <TableCell className='font-normal text-center'>01/01/2024</TableCell>
//                             <TableCell className='font-normal'>Manager John</TableCell>
//                         </TableRow>
//                         <TableRow className='font-medium'>
//                             <TableCell className='font-semibold text-base dark:text-light2'>002</TableCell>
//                             <TableCell className='font-normal'>Address Update</TableCell>
//                             <TableCell className='font-normal text-center'>03/01/2024</TableCell>
//                             <TableCell className='font-normal'>Supervisor Emma</TableCell>
//                         </TableRow>
//                         <TableRow className='font-medium'>
//                             <TableCell className='font-semibold text-base dark:text-light2'>003</TableCell>
//                             <TableCell className='font-normal'>Leave Application</TableCell>
//                             <TableCell className='font-normal text-center'>05/01/2024</TableCell>
//                             <TableCell className='font-normal'>Manager Mike</TableCell>
//                         </TableRow>
//                         </TableBody>
//                     </Table>
//                 </div>
//             </section>
//             {/* Recent activities */}
//             <section className="section4">
//                 <h1 className='text-2xl font-medium mb-8'>Recent Activities</h1>
//                 <div className='bg-white dark:bg-dark3 w-[720px] rounded-xl shadow-lg'>
//                     <Table className='w-full'>
//                         <TableHeader className='font-medium text-lg text-text2 h-14'>
//                         <TableRow>
//                             <TableHead className='dark:text-light1'>Action Type</TableHead>
//                             <TableHead className='dark:text-light1'>Request</TableHead>
//                             <TableHead className='dark:text-light1 text-center'>Time</TableHead>
//                             <TableHead className='dark:text-light1'>Details</TableHead>
//                         </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                         <TableRow className='font-medium'>
//                             <TableCell className='font-semibold text-base dark:text-light2'>Request Approved</TableCell>
//                             <TableCell className='font-normal'>Leave Request</TableCell>
//                             <TableCell className='font-normal text-center'>15 minutes ago</TableCell>
//                             <TableCell className='font-normal'>Approved leave request for 5 days</TableCell>
//                         </TableRow>
//                         <TableRow className='font-medium'>
//                             <TableCell className='font-semibold text-base dark:text-light2'>Profile Updated</TableCell>
//                             <TableCell className='font-normal'>N/A</TableCell>
//                             <TableCell className='font-normal text-center'>10 minutes ago</TableCell>
//                             <TableCell className='font-normal'>Updated profile picture</TableCell>
//                         </TableRow>
//                         <TableRow className='font-medium'>
//                             <TableCell className='font-semibold text-base dark:text-light2'>Request Completed</TableCell>
//                             <TableCell className='font-normal'>Fix Bug</TableCell>
//                             <TableCell className='font-normal text-center'>05 minutes ago</TableCell>
//                             <TableCell className='font-normal'>Resolved critical bug</TableCell>
//                         </TableRow>
//                         </TableBody>
//                     </Table>
//                 </div>
//             </section>
//         </div>
//     </LayOut>
//   )
// }

// export default Dashboard

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LayOut from "../../../components/LayOut";

const EDashboard = () => {
  return (
    <LayOut title="Dashboard">
      <div className="p-4 sm:ml-72 mt-28 px-10">
        {/* Requests done but not take actions */}
        <section className="section1">
          <h1 className="text-2xl font-medium mb-8">
            Requests done but not take actions
          </h1>
          <div className="bg-white dark:bg-dark3 rounded-xl shadow-lg overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader className="font-medium text-lg text-text2 h-14">
                <TableRow>
                  <TableHead className="dark:text-light1">Request ID</TableHead>
                  <TableHead className="dark:text-light1">
                    Request Type
                  </TableHead>
                  <TableHead className="dark:text-light1 text-center">
                    Submission Date
                  </TableHead>
                  <TableHead className="dark:text-light1">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="font-medium">
                  <TableCell className="font-semibold text-base dark:text-light2">
                    001
                  </TableCell>
                  <TableCell className="font-normal">Loan Approval</TableCell>
                  <TableCell className="font-normal text-center">
                    01/01/2024
                  </TableCell>
                  <TableCell className="font-normal">Pending</TableCell>
                </TableRow>
                <TableRow className="font-medium">
                  <TableCell className="font-semibold text-base dark:text-light2">
                    002
                  </TableCell>
                  <TableCell className="font-normal">Address Update</TableCell>
                  <TableCell className="font-normal text-center">
                    03/01/2024
                  </TableCell>
                  <TableCell className="font-normal">Pending</TableCell>
                </TableRow>
                <TableRow className="font-medium">
                  <TableCell className="font-semibold text-base dark:text-light2">
                    003
                  </TableCell>
                  <TableCell className="font-normal">
                    Leave Application
                  </TableCell>
                  <TableCell className="font-normal text-center">
                    05/01/2024
                  </TableCell>
                  <TableCell className="font-normal">Pending</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Middle of the approving process */}
        <section className="section2 my-12">
          <h1 className="text-2xl font-medium mb-8">
            Middle of the approving process
          </h1>
          <div className="bg-white dark:bg-dark3 rounded-xl shadow-lg overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader className="font-medium text-lg text-text2 h-14">
                <TableRow>
                  <TableHead className="dark:text-light1">Request ID</TableHead>
                  <TableHead className="dark:text-light1">
                    Request Type
                  </TableHead>
                  <TableHead className="dark:text-light1 text-center">
                    Submission Date
                  </TableHead>
                  <TableHead className="dark:text-light1">
                    Current Approver
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="font-medium">
                  <TableCell className="font-semibold text-base dark:text-light2">
                    001
                  </TableCell>
                  <TableCell className="font-normal">Loan Approval</TableCell>
                  <TableCell className="font-normal text-center">
                    01/01/2024
                  </TableCell>
                  <TableCell className="font-normal">Manager John</TableCell>
                </TableRow>
                <TableRow className="font-medium">
                  <TableCell className="font-semibold text-base dark:text-light2">
                    002
                  </TableCell>
                  <TableCell className="font-normal">Address Update</TableCell>
                  <TableCell className="font-normal text-center">
                    03/01/2024
                  </TableCell>
                  <TableCell className="font-normal">Supervisor Emma</TableCell>
                </TableRow>
                <TableRow className="font-medium">
                  <TableCell className="font-semibold text-base dark:text-light2">
                    003
                  </TableCell>
                  <TableCell className="font-normal">
                    Leave Application
                  </TableCell>
                  <TableCell className="font-normal text-center">
                    05/01/2024
                  </TableCell>
                  <TableCell className="font-normal">Manager Mike</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Already approved requests */}
        <section className="section3 mb-12">
          <h1 className="text-2xl font-medium mb-8">
            Already approved requests
          </h1>
          <div className="bg-white dark:bg-dark3 rounded-xl shadow-lg overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader className="font-medium text-lg text-text2 h-14">
                <TableRow>
                  <TableHead className="dark:text-light1">Request ID</TableHead>
                  <TableHead className="dark:text-light1">
                    Request Type
                  </TableHead>
                  <TableHead className="dark:text-light1 text-center">
                    Approval Date
                  </TableHead>
                  <TableHead className="dark:text-light1">
                    Final Approver
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="font-medium">
                  <TableCell className="font-semibold text-base dark:text-light2">
                    001
                  </TableCell>
                  <TableCell className="font-normal">Loan Approval</TableCell>
                  <TableCell className="font-normal text-center">
                    01/01/2024
                  </TableCell>
                  <TableCell className="font-normal">Manager John</TableCell>
                </TableRow>
                <TableRow className="font-medium">
                  <TableCell className="font-semibold text-base dark:text-light2">
                    002
                  </TableCell>
                  <TableCell className="font-normal">Address Update</TableCell>
                  <TableCell className="font-normal text-center">
                    03/01/2024
                  </TableCell>
                  <TableCell className="font-normal">Supervisor Emma</TableCell>
                </TableRow>
                <TableRow className="font-medium">
                  <TableCell className="font-semibold text-base dark:text-light2">
                    003
                  </TableCell>
                  <TableCell className="font-normal">
                    Leave Application
                  </TableCell>
                  <TableCell className="font-normal text-center">
                    05/01/2024
                  </TableCell>
                  <TableCell className="font-normal">Manager Mike</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Recent activities */}
        <section className="section4">
          <h1 className="text-2xl font-medium mb-8">Recent Activities</h1>
          <div className="bg-white dark:bg-dark3 rounded-xl shadow-lg overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader className="font-medium text-lg text-text2 h-14">
                <TableRow>
                  <TableHead className="dark:text-light1">
                    Action Type
                  </TableHead>
                  <TableHead className="dark:text-light1">Request</TableHead>
                  <TableHead className="dark:text-light1 text-center">
                    Time
                  </TableHead>
                  <TableHead className="dark:text-light1">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="font-medium">
                  <TableCell className="font-semibold text-base dark:text-light2">
                    Request Approved
                  </TableCell>
                  <TableCell className="font-normal">Leave Request</TableCell>
                  <TableCell className="font-normal text-center">
                    15 minutes ago
                  </TableCell>
                  <TableCell className="font-normal">
                    Approved leave request for 5 days
                  </TableCell>
                </TableRow>
                <TableRow className="font-medium">
                  <TableCell className="font-semibold text-base dark:text-light2">
                    Profile Updated
                  </TableCell>
                  <TableCell className="font-normal">N/A</TableCell>
                  <TableCell className="font-normal text-center">
                    10 minutes ago
                  </TableCell>
                  <TableCell className="font-normal">
                    Updated profile picture
                  </TableCell>
                </TableRow>
                <TableRow className="font-medium">
                  <TableCell className="font-semibold text-base dark:text-light2">
                    Request Completed
                  </TableCell>
                  <TableCell className="font-normal">Fix Bug</TableCell>
                  <TableCell className="font-normal text-center">
                    05 minutes ago
                  </TableCell>
                  <TableCell className="font-normal">
                    Resolved critical bug
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </LayOut>
  );
};

export default EDashboard;
