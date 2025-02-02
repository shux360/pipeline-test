import React from 'react'
import LayOut from '../../../components/LayOut'
import { Button } from "@/components/ui/button"
import Download from '../../../assets/icons/download.png'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import user1 from '../../../assets/images/user1.png'
import user2 from '../../../assets/images/user2.png'
import user3 from '../../../assets/images/user3.png'
import user4 from '../../../assets/images/user4.jpg'
import user5 from '../../../assets/images/user5.jpg'
import user6 from '../../../assets/images/user6.jpg'
import RequstChart from '../../../components/Charts/RequestChart'



const Analytics = () => {
  return (
    <LayOut title='Analytics'>
      <div className="p-4 sm:ml-72 mt-24 mr-8">
        {/* download button */}
        <div className="flex justify-end items-center">
        <Button className='rounded-lg shadow-lg outline-none text-lg pl-1 py-1.5 dark:text-light1'><span><img src={Download} className='w-8 h-8 mr-2'/></span>Download data</Button>
        </div>

        {/* Top Requesters */}
        <section className='flex justify-center space-x-10 items-start mt-12'>
          <Card className='w-1/2 shadow-lg rounded-xl dark:bg-dark3'>
            <CardHeader>
              <div className="flex justify-between items-center">
              <CardTitle>Top Requesters</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger className='outline-none bg-chartDropdown dark:bg-dark4 w-32 rounded-lg p-1.5 mt-4'>Select Time</DropdownMenuTrigger>
                <DropdownMenuContent className='dark:bg-dark4'>
                  <DropdownMenuItem className='cursor-pointer'>Today</DropdownMenuItem>
                  <DropdownMenuItem className='cursor-pointer'>Yesterday</DropdownMenuItem>
                  <DropdownMenuItem className='cursor-pointer'>Last Week</DropdownMenuItem>
                  <DropdownMenuItem className='cursor-pointer'>Last Month</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
            <Table className='w-full'>
                <TableHeader className='font-medium text-lg text-text2 h-14 '>
                  <TableRow>
                    <TableHead className='text-center dark:text-light1'>User</TableHead>
                    <TableHead className='text-center dark:text-light1'>Department</TableHead>
                    <TableHead className='text-center dark:text-light1'>Requests made</TableHead>
                    
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className='font-medium'>
                    <TableCell className='text-center'>
                      <div className='inline-flex items-center'>
                        <img src={user1} alt='user1' className='w-12 h-12 rounded-full mx-auto' />
                        <span className='font-semibold text-base ml-4'>John</span>
                      </div>
                    </TableCell>
                    <TableCell className='font-semibold text-base text-center'>IT</TableCell>
                    <TableCell className='font-normal dark:text-light2 text-center text-base'>150</TableCell>
                    
                  </TableRow>
                  <TableRow className='font-medium'>
                    <TableCell className='text-center'>
                      <div className='inline-flex items-center'>
                        <img src={user2} alt='user1' className='w-12 h-12 rounded-full mx-auto' />
                        <span className='font-semibold text-base ml-4'>John</span>
                      </div>
                    </TableCell>
                    <TableCell className='font-semibold text-base text-center'>HR</TableCell>
                    <TableCell className='font-normal dark:text-light2 text-center text-base'>130</TableCell>
                    
                  </TableRow>
                  <TableRow className='font-medium'>
                    <TableCell className='text-center'>
                      <div className='inline-flex items-center'>
                        <img src={user3} alt='user1' className='w-12 h-12 rounded-full mx-auto' />
                        <span className='font-semibold text-base ml-4'>Mike</span>
                      </div>
                    </TableCell>
                    <TableCell className='font-semibold text-base text-center'>Finance</TableCell>
                    <TableCell className='font-normal dark:text-light2 text-center text-base'>120</TableCell>
                    
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card className='w-1/2 shadow-lg rounded-xl dark:bg-dark3'>
            <CardHeader>
              <div className="flex justify-between items-center">
              <CardTitle>Top Performers</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger className='outline-none bg-chartDropdown w-32 rounded-lg p-1.5 mt-4 dark:bg-dark4'>Select Time</DropdownMenuTrigger>
                <DropdownMenuContent className='dark:bg-dark4'>
                  <DropdownMenuItem className='cursor-pointer'>Today</DropdownMenuItem>
                  <DropdownMenuItem className='cursor-pointer'>Yesterday</DropdownMenuItem>
                  <DropdownMenuItem className='cursor-pointer'>Last Week</DropdownMenuItem>
                  <DropdownMenuItem className='cursor-pointer'>Last Month</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
            <Table className='w-full'>
                <TableHeader className='font-medium text-lg text-text2 h-14'>
                  <TableRow>
                    <TableHead className='text-center dark:text-light1'>User</TableHead>
                    <TableHead className='text-center dark:text-light1'>Department</TableHead>
                    <TableHead className='text-center dark:text-light1'>Average Response Time(hours)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className='font-medium'>
                    <TableCell className='text-center'>
                      <div className='inline-flex items-center'>
                        <img src={user4} alt='user1' className='w-12 h-12 rounded-full mx-auto' />
                        <span className='font-semibold text-base ml-4'>Emily</span>
                      </div>
                    </TableCell>
                    <TableCell className='font-semibold text-base text-center'>IT</TableCell>
                    <TableCell className='font-normal dark:text-light2 text-center text-base'>0.8</TableCell>
                    
                  </TableRow>
                  <TableRow className='font-medium'>
                    <TableCell className='text-center'>
                      <div className='inline-flex items-center'>
                        <img src={user5} alt='user1' className='w-12 h-12 rounded-full mx-auto' />
                        <span className='font-semibold text-base ml-4'>David</span>
                      </div>
                    </TableCell>
                    <TableCell className='font-semibold text-base text-center'>HR</TableCell>
                    <TableCell className='font-normal dark:text-light2 text-center text-base'>0.9</TableCell>
                    
                  </TableRow>
                  <TableRow className='font-medium'>
                    <TableCell className='text-center'>
                      <div className='inline-flex items-center'>
                        <img src={user6} alt='user1' className='w-12 h-12 rounded-full mx-auto' />
                        <span className='font-semibold text-base ml-4'>James</span>
                      </div>
                    </TableCell>
                    <TableCell className='font-semibold text-base text-center'>Finance</TableCell>
                    <TableCell className='font-normal dark:text-light2 text-center text-base'>1</TableCell>
                    
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

        </section>

        {/* Requset Types */}
        <section className='mt-16 '>
        <Card className='w-full shadow-lg rounded-xl h-auto dark:bg-dark3'>
          <CardHeader className='pt-0 mt-4'>
              <div className="flex justify-between items-center">
              <CardTitle>Request Types</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger className='outline-none bg-chartDropdown dark:bg-dark4 w-32 rounded-lg p-1.5 mt-4'>Select Time</DropdownMenuTrigger>
                <DropdownMenuContent className='dark:bg-dark4'>
                  <DropdownMenuItem className='cursor-pointer'>Today</DropdownMenuItem>
                  <DropdownMenuItem className='cursor-pointer'>Yesterday</DropdownMenuItem>
                  <DropdownMenuItem className='cursor-pointer'>Last Week</DropdownMenuItem>
                  <DropdownMenuItem className='cursor-pointer'>Last Month</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </div>
          </CardHeader>
          <CardContent>
            <RequstChart/>
          </CardContent>
        </Card>
        </section>
      </div>
    </LayOut>
  )
}

export default Analytics
