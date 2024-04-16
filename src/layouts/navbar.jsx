import { getApiData } from "../function/api";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const [data, setData] = useState([]);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    img: "",
    phone_number: "",
    username: "",
  });
  useEffect(() => {
    const getData = async () => {
      try {
        const { data, status } = await getApiData("profile");
        if (status === 200) {
          // Assuming the first item in data array is the user profile
          const profileGet = data[0];
          setProfile({
            name: profileGet.nama_lengkap,
            username: profileGet.user.username,
            phone_number: profileGet.phone_number,
            email: profileGet.user.email,
            img: profileGet.photo_profile,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);
  return (
    <>
      <nav className="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex justify-start items-center">
            <button
              data-drawer-target="drawer-navigation"
              data-drawer-toggle="drawer-navigation"
              aria-controls="drawer-navigation"
              className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <svg
                aria-hidden="true"
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <svg
                aria-hidden="true"
                className="hidden w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Toggle sidebar</span>
            </button>
            <a href="#" className="flex items-center justify-between mr-4">
              <img
                src={import.meta.env.VITE_CLIENT_LOGO_DARK}
                className="mr-3 h-12"
                alt={import.meta.env.VITE_CLIENTS_NAME}
              />
            </a>
          </div>
          <div className="flex items-center lg:order-2">
            <div className="p-2 hover:bg-gray-50 rounded-md">
              <svg
                className="w-6 h-6 text-gray-700 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
                />
              </svg>
            </div>

            <button
              type="button"
              className="flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              id="user-menu-button"
              aria-expanded="false"
              data-dropdown-toggle="dropdown"
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="w-8 h-8 rounded-full"
                src={profile.img}
                alt="user photo"
              />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};
