import React, { useState, useRef, useEffect } from "react";
import Footer from "./Footer";
import Rating from "@mui/material/Rating";
import { useNavigate, Link } from "react-router-dom";
import { FaWindowClose } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { TiThMenu } from "react-icons/ti";
import { PiBooksFill } from "react-icons/pi";
import { FaArrowLeft } from "react-icons/fa";
import { isOwnProfile } from "../utils/auth";
import GradualBlur from "./GradualBlur";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

export default function BookDetail({ bookData, userId }) {
  const navigate = useNavigate();
  const [nav, setNav] = useState(true);
  const navRef = useRef();
  const isCurrentUserProfile = isOwnProfile(userId);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getGenreDisplay = (genreValue) => {
    const genreMap = {
      crime: "Crime / Mystery",
      romance: "Romance",
      fantasy: "Fantasy / Sci Fi",
      action: "Action / Adventure",
      horror: "Horror / Thriller",
      graphic: "Graphic Novel",
      comedy: "Comedy",
      poetry: "Poetry",
      drama: "Drama",
      historical: "Historical",
      children: "Children's",
      philo: "Philosophical / Religious",
      Biography: "Biography / Autobiography",
    };
    return genreMap[genreValue] || genreValue;
  };

  const handleNav = () => {
    setNav(!nav);
  };

  const deleteBook = () => {
    handleOpen();
  };

  const confirmDelete = async () => {
    const bookId = bookData.id;
    const token = localStorage.getItem("token");

    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${userId}/book/${bookId}`,
        requestOptions,
      );

      if (response.ok) {
        navigate("/user/" + userId);
      } else {
        console.error("Failed to delete the book");
        alert("Error deleting book. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Connection error. Please try again later.");
    }
  };

  const editBook = () => {
    const currentPath = window.location.pathname;
    navigate(`${currentPath}/edit`);
  };

  const goShelf = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
      return;
    } else {
      navigate("/login");
    }
  };

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setNav(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-40 hidden landscape:max-lg:hidden landscape:block">
        <GradualBlur
          target="parent"
          position="top"
          height="6rem"
          strength={1}
          divCount={10}
          curve="bezier"
          exponential={true}
          opacity={1}
        />
      </div>
      <div className="min-h-screen bg-[#242626] bg-cover bg-no-repeat bg-fixed">
        <div className="min-h-screen">
          <div className="fixed top-0 left-0 right-0 px-4 flex justify-between items-center py-4 z-[100]">
            <nav>
              <ul className="flex justify-center items-center space-x-4 md:px-3 text-xl">
                <li onClick={goShelf}>
                  <FaArrowLeft
                    size={60}
                    color="white"
                    className="cursor-pointer"
                  />
                </li>
                {isCurrentUserProfile && (
                  <>
                    <li>
                      <img
                        src="/delete.png"
                        alt="Delete Review"
                        className="w-[60px] cursor-pointer"
                        onClick={deleteBook}
                      ></img>
                    </li>
                    <li>
                      <img
                        src="/edit.png"
                        alt="Edit Review"
                        className="w-[60px] cursor-pointer"
                        onClick={editBook}
                      ></img>
                    </li>
                  </>
                )}
              </ul>
            </nav>
            <nav className="hidden md:flex">
              <ul className="flex justify-center items-center font-bold space-x-4 text-white sm:text-3xl md:px-5 text-xl px-1">
                <li className="md:px-3" onClick={goShelf}>
                  <PiBooksFill size={60} />
                </li>
                <li className="md:px-3" onClick={logOut}>
                  <FiLogOut size={60} />
                </li>
              </ul>
            </nav>
            <div onClick={handleNav} className="block md:hidden">
              {!nav ? (
                <FaWindowClose
                  size={55}
                  color="rgb(255,255,255)"
                  className="cursor-pointer"
                />
              ) : (
                <TiThMenu
                  size={55}
                  color="rgb(255,255,255)"
                  className="cursor-pointer"
                />
              )}
            </div>

            <div
              id="dark-grey-div"
              ref={navRef}
              className={
                !nav
                  ? "fixed left-0 top-0 w-[50%] h-full border-r bg-white-400 bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-70 border-gray-100"
                  : "fixed left-[-100%] top-0 w-[50%] h-full border-r"
              }
            >
              <ul className="pt-4 uppercase text-2xl text-white font-['Radley']">
                <li>
                  <img
                    src="/chaptr-logo-lg.webp"
                    alt="Logo in light beige"
                    className="w-[10rem] justify-center mx-auto py-5"
                  ></img>
                </li>
                <li className="p-4 font-bold cursor-pointer" onClick={goShelf}>
                  <Link>Bookshelf</Link>
                </li>
                <li className="p-4 font-bold cursor-pointer" onClick={logOut}>
                  <Link>LOG OUT</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-28">
            <h1 className="font-['Radley'] font-bold mt-[2%] p-5 text-center flex flex-col xl:text-8xl sm:text-7xl text-5xl mx-auto justify-center text-white">
              {bookData.title}
            </h1>
            <h2 className="text-center flex flex-col xl:text-5xl md:text-4xl sm:text-4xl text-2xl mx-auto justify-center text-white">
              {bookData.author}
            </h2>
            <hr className="xl:w-[75%] w-[90%] h-1 mx-auto my-4 border-0 rounded md:my-10 bg-white" />
            <div className="border-2 border-white relative py-10 sm:py-20 rounded-3xl grid justify-items-center flex-col w-[90%] xl:w-[80%] grid-cols-1 mx-auto gap-5 sm:px-3 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${bookData.cover})` }}
              />

              {/* Progressively blur the image into a darker colour for readability*/}
              <div className="absolute inset-0 backdrop-blur-xl bg-gradient-to-b from-black/20 via-black/40 to-black/70" />

              <div className="relative z-30 w-[60%] sm:w-[55%] md:w-[50%] lg:w-[40%] 2xl:w-[30%] aspect-[3/4] mb-5 sm:mb-10">
                <img
                  src="/book.webp"
                  alt="blank book"
                  className="w-full shadow-custom-dark rounded-2xl"
                />
                <img
                  src={bookData.cover}
                  alt="Cover"
                  className="absolute top-[1%] left-[7%] w-[92%] h-[98%] max-h-[99%] bottom-[-10%] object-cover shadow-lg object-fit rounded-xl"
                />
              </div>
              <div className="px-2 sm:px-14 py-8 rounded-3xl z-30 mx-5 sm:mx-20 flex flex-col justify-center">
                <p className="text-white text-2xl xl:text-3xl 2xl:text-4xl text-center">
                  {bookData.review}
                </p>
                <div className="mt-6 flex justify-center">
                  <Rating
                    value={Number(bookData.rating)}
                    readOnly
                    sx={{
                      fontSize: {
                        xs: "3rem",
                        sm: "4rem",
                        md: "4rem",
                        lg: "4.5rem",
                        xl: "5rem",
                      },
                    }}
                  />
                </div>
                <div>
                  <h2 className="text-center flex flex-col xl:text-5xl sm:text-4xl text-3xl mx-auto justify-center text-white mt-6 font-['Radley'] font-bold">
                    Genre:
                  </h2>
                  <h3 className="text-center flex flex-col xl:text-4xl sm:text-3xl text-2xl mx-auto justify-center text-white mt-6">
                    {getGenreDisplay(bookData.genre)}
                  </h3>
                  <h2 className="text-center flex flex-col xl:text-5xl sm:text-4xl text-3xl mx-auto justify-center text-white mt-6 font-['Radley'] font-bold">
                    Added:
                  </h2>
                  <h3 className="text-center flex flex-col xl:text-4xl sm:text-3xl text-2xl mx-auto justify-center text-white mt-6">
                    {new Date(bookData.dateAdded).toLocaleDateString("en-US")}
                  </h3>
                </div>
              </div>
            </div>
            <br />
            <br />
          </div>
        </div>

        <Footer />

        <div className="fixed bottom-0 left-0 right-0 z-40 hidden landscape:max-lg:hidden landscape:block">
          <GradualBlur
            target="parent"
            position="bottom"
            height="2rem"
            strength={1}
            divCount={10}
            curve="bezier"
            exponential={true}
            opacity={1}
          />
        </div>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12  bg-[#242626] border-2 border-white rounded-3xl p-6 max-w-[80%] sm:max-w-md">
            <img
              src="/trash-bin.png"
              alt="Trash bin icon"
              className="mx-auto w-[40%]"
            ></img>
            <h1 className="text-white font-bold text-3xl mt-5 font-['Radley']">
              Delete Review
            </h1>
            <h2 className="text-white text-xl mt-2 font-['Libre Baskerville']">
              Are you sure you want to delete{" "}
              <span className="font-bold">{bookData.title}</span>? This action
              cannot be undone.
            </h2>
            <div className="mt-5 flex justify-center gap-4">
              <button
                onClick={handleClose}
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white hover:bg-gray-300 text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Delete
              </button>
            </div>
          </Box>
        </Modal>
      </div>
    </>
  );
}
