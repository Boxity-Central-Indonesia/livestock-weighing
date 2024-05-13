// footer.jsx

import React, { useState, useEffect } from "react";
import { getApiData } from "../function/api";

const Footer = () => {
  // State to store the company name
  // const [companyName, setCompanyName] = useState("");

  // useEffect(() => {
  //   const getData = async () => {
  //     try {
  //       const { data, status } = await getApiData("companies");
  //       if (status === 200) {
  //         // Assuming the first item in data array is the user profile
  //         const companiesConnected = data[0];
  //         setCompanyName(companiesConnected.name);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   getData();
  // }, []); // The empty array means this effect runs once when the component mounts
  const authorReserved = import.meta.env.VITE_AUTHOR_RESERVED;
  const authorLINK = import.meta.env.VITE_AUTHOR_LINK;
  const clientsNAME = import.meta.env.VITE_CLIENTS_NAME;

  return (
    <footer className="footer absolute bottom-0 border bg-white rounded-lg shadow dark:bg-gray-800 w-full">
      <div className="w-full mx-auto py-6 px-6 flex flex-col md:flex-row items-center justify-between">
        <span className="text-sm text-center text-gray-500 sm:text-center dark:text-gray-400">
          ©Copyright 2024 - {clientsNAME || "loading..."}. All rights reserved
          by &nbsp;
          <abbr title={authorReserved}>
            <a
              href={authorLINK}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {authorReserved}
            </a>
          </abbr>
        </span>
        <ul className="flex gap-3 w-fit flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <a
              href={authorLINK}
              className="mr-4 hover:underline md:mr-6"
              target="_blank"
              rel="noopener noreferrer"
            >
              About
            </a>
          </li>
          <li>
            <a
              href={authorLINK}
              className="mr-4 hover:underline md:mr-6"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact
            </a>
          </li>
          <li>
            <a href="/panduan" className="hover:underline">
              Documentation
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
