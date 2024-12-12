import React from 'react';
// import PeriodHeader from '../components/PeriodHeader';
// import theme from '../Theme';
// import Navbar from '../components/Navbar';
// import { SAMPLE_USER } from '../state/sample';
// import BoxedStat from '../components/Stats';

import { useContext, useEffect, useState } from "react";
import { useFetchLocal } from '../../state/hooks';
import { User } from "../../state/User";

import "./index.css"
// import { AppContext } from "../App";
// import { useNavigate } from 'react-router-dom';
// import { set } from 'date-fns';


interface Employee{
  id: string;
  name: string;
  emplid: string;
  submitted: boolean;
  approved: boolean;
  totalWorked: number;
  alloted: number; 
}

function TimesheetTable( ) {

//const [sortKey, setSortKey] = useState()
//const [sortOrder, setSortOrder] = useState()

  //states for the employees 
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState<string | null>(null);

  //sorting states 
  const [sortKey, setSortKey] = useState<keyof Employee | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { data:allUsers  } = useFetchLocal<User[]>("/users/all");
  console.log(allUsers)

//   useEffect(() =>{
//       try{
//         const { data:allUsers  } = useFetchLocal<User[]>("/users/all");
//         //error handeling
//         if (! allUsers || allUsers.length === 0){
//           throw new Error(`HTTP error!`);
//         }
//         console.log(allUsers)
//         // const data: Employee[] = await response.json(); 
//         // setEmployees(data);
//         setIsLoading(false);
//       }catch(err){
//         const errorMessage = err instanceof Error ? err.message : String(err);
//         setError(errorMessage);
//         setIsLoading(false);
//       } 

//   }, []);



  //sorting function
  const handleSort = (key: keyof Employee) => {
    const isAscending = sortKey === key && sortOrder === 'asc';
    setSortKey(key);
    setSortOrder(isAscending ? 'desc' : 'asc');

    const sortedEmployees = [...employees].sort((a, b) => {
      if (a[key] < b[key]) return isAscending ? 1 : -1;
      if (a[key] > b[key]) return isAscending ? -1 : 1;
      return 0;
    });

    setEmployees(sortedEmployees);
  };



  const headers = [
    {key: "name", label: "Employee"}, 
    {key: "emplid", label: "Emplid"},
    {key: "submitted", label: "Submitted?"},
    {key: "approved", label: "Approved?"},
    {key: "total_worked", label: "Total Worked"},
    {key: "alotted", label: "Alloted"},
  ]
    
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <table className="table"> 
      <thead>
        <tr>
          {headers.map((header) => (
            <th
            key = {header.key}
            onClick = {() => handleSort(header.key as keyof Employee)}
            style={{ cursor: 'pointer' }}
          > 
            {header.label}
            {sortKey === header.key && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
            </th>
          ))}
        </tr>
      </thead>



      <tbody> 
        {employees.map((employee) => {
          return (
            <tr key = {employee.id}>
              <td>{employee.name}</td>
              <td>{employee.emplid}</td>
              <td>{employee.submitted ? 'Yes' : 'No'}</td>
              <td>{employee.approved ? 'Yes' : 'No'}</td>
              <td>{employee.totalWorked}</td>
              <td>{employee.alloted}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  
  );

}

export default TimesheetTable; 





export const Timesheet = () =>{
  
  // const [employees, setEmployees] = useState<Employee[]>{[]}; 
  // const {role,setRole} = useContext(AppContext);
  // const navigate = useNavigate()


  


};