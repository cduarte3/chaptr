import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { TiThMenu } from "react-icons/ti";
import { PiBooksFill } from "react-icons/pi";
import {
  FaWindowClose,
  FaSort,
  FaUserCircle,
  FaSearch,
  FaArrowLeft,
} from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { isOwnProfile, getCurrentUserId } from "../utils/auth";
const Silk = lazy(() => import("./Silk"));
import GradualBlur from "./GradualBlur";

export default function Shelf({ userData }) {
  const isCurrentUserProfile = isOwnProfile(userData.id);
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const [nav, setNav] = useState(true);
  const navRef = useRef();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortCriteria, setSortCriteria] = useState("addedDesc");
  const [hoveredBook, setHoveredBook] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleNav = () => {
    setNav(!nav);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const getLastName = (authorName) => {
    const names = authorName.split(" ");
    return names.length > 1 ? names[names.length - 1] : names[0];
  };

  const handleMouseMove = (e, book) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
    setHoveredBook(book);
  };

  const handleMouseLeave = () => {
    setHoveredBook(null);
  };

  const goBack = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate(-1);
      return;
    }
  };

  const sortBooks = (books) => {
    return [...books].sort((a, b) => {
      switch (sortCriteria) {
        case "titleAsc":
          return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
        case "titleDesc":
          return b.title.toLowerCase().localeCompare(a.title.toLowerCase());
        case "authorAsc":
          return getLastName(a.author)
            .toLowerCase()
            .localeCompare(getLastName(b.author).toLowerCase());
        case "authorDesc":
          return getLastName(b.author)
            .toLowerCase()
            .localeCompare(getLastName(a.author).toLowerCase());
        case "genre":
          return a.genre.toLowerCase().localeCompare(b.genre.toLowerCase());
        case "addedAsc":
          return new Date(a.dateAdded) - new Date(b.dateAdded);
        case "addedDesc":
          return new Date(b.dateAdded) - new Date(a.dateAdded);
        case "ratingAsc":
          return parseInt(a.rating) - parseInt(b.rating);
        case "ratingDesc":
          return parseInt(b.rating) - parseInt(a.rating);
        case "newlyUpdated":
          return new Date(b.lastUpdated) - new Date(a.lastUpdated);
        default:
          return 0;
      }
    });
  };

  const addBook = () => {
    navigate(`/user/${userData.id}/add`);
  };

  const visitBook = (bookId) => {
    if (!bookId) {
      console.error("No bookId provided");
      return;
    }
    try {
      navigate(`/user/${userData.id}/book/${bookId}`);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const goToMyShelf = () => {
    navigate(`/user/${currentUserId}`);
  };

  const goProfile = () => {
    navigate(`/user/${userData.id}/profile`);
  };

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  // goHome if needed will navigate to / route

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

  const getPosessiveName = (name) => {
    return name.endsWith("s") ? `${name}'` : `${name}'s`;
  };

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
      {hoveredBook && (
        <div
          className="fixed pointer-events-none z-[200] bg-black bg-opacity-80 text-white px-3 py-2 rounded-lg text-sm font-bold shadow-lg"
          style={{
            left: mousePosition.x + 10,
            top: mousePosition.y - 40,
            transform: "translate(0, 0)",
          }}
        >
          {hoveredBook.title}
        </div>
      )}
      <div className="fixed inset-0 w-full h-full min-h-screen z-0">
        <Suspense
          fallback={
            <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800" />
          }
        >
          <Silk
            speed={6}
            scale={1}
            color="#565656"
            noiseIntensity={0}
            rotation={0}
          />
        </Suspense>
      </div>
      <div className="min-h-screen bg-[url('/background-shelf.png')] bg-cover bg-no-repeat bg-fixed">
        <div
          className="min-h-screen pb-20"
          /* 
          className={`${
            isDropdownOpen ? "min-h-screen" : "min-h-screen"
          } pb-20`}
          style={{
            minHeight: isDropdownOpen
              ? `${window.innerHeight + 300}px`
              : "100vh",
          }}
          */
        >
          <div className="fixed z-[100] left-0 right-0 top-5 hidden md:block">
            <nav>
              <ul className="flex justify-center items-center space-x-4 md:px-5 text-xl px-1">
                <li>
                  <img
                    src="/chaptr-logo-sm.webp"
                    className="w-[150px]"
                    alt="Chaptr Logo"
                  />
                </li>
              </ul>
            </nav>
          </div>
          <div className="fixed top-0 left-0 right-0 px-4 flex justify-between items-center py-4 z-[100]">
            <nav>
              <ul className="flex justify-center items-center space-x-4 md:px-3 text-xl">
                {isCurrentUserProfile && (
                  <li>
                    <img
                      src="/add.webp"
                      alt="add book"
                      className="w-[60px] cursor-pointer"
                      onClick={addBook}
                    ></img>
                  </li>
                )}
                {!isCurrentUserProfile && (
                  <li onClick={goBack}>
                    <FaArrowLeft
                      size={60}
                      color="white"
                      className="cursor-pointer"
                    />
                  </li>
                )}
              </ul>
            </nav>
            <nav className="hidden md:flex">
              <ul className="flex justify-center items-center font-bold space-x-4 text-white text-2xl font-['Radley']">
                {isCurrentUserProfile && (
                  <li className="md:px-3 cursor-pointer" onClick={goProfile}>
                    <FaUserCircle size={60} />
                  </li>
                )}
                {!isCurrentUserProfile && (
                  <li className="md:px-3 cursor-pointer" onClick={goToMyShelf}>
                    <PiBooksFill size={60} />
                  </li>
                )}
                <li className="md:px-3 cursor-pointer" onClick={logOut}>
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
                <li
                  className="p-4 font-bold cursor-pointer"
                  onClick={goProfile}
                >
                  <Link>PROFILE</Link>
                </li>
                <li className="p-4 font-bold cursor-pointer" onClick={logOut}>
                  <Link>LOG OUT</Link>
                </li>
              </ul>
            </div>
          </div>

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

          <div className="relative pt-28">
            <h1 className="font-bold mt-[2%] p-5 text-center flex flex-wrap justify-center lg:text-8xl md:text-7xl sm:text-6xl text-5xl mx-auto text-white font-['Radley'] gap-4">
              <span>{getPosessiveName(userData.username)}</span>
              <span className="">Shelf</span>
            </h1>
            <hr className="xl:w-[75%] w-[90%] h-1 mx-auto my-4 border-0 rounded md:my-10 bg-white" />
            <div className="mt-4 md:mt-10 mb-10 mx-auto w-[90%] md:w-[75%] xl:max-w-[55%]">
              <div className="relative">
                <div className="h-16 w-16 md:h-20 md:w-20 absolute left-0 top-0 items-center justify-center mx-auto flex z-10 ">
                  <FaSearch className="h-8 w-8 md:h-10 md:w-10" color="white" />
                </div>

                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search..."
                  className="shadow-custom-dark border-4 border-white bg-transparent backdrop-blur-lg pl-16 md:pl-20 pr-16 h-16 md:pr-20 md:h-20 w-full text-xl md:text-2xl text-white placeholder-white rounded-full"
                ></input>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="bg-white rounded-full h-16 w-16 md:h-20 md:w-20 absolute right-0 top-0 items-center justify-center mx-auto flex"
                >
                  <FaSort
                    className="h-8 w-8 md:h-10 md:w-10"
                    color="rgb(36,38,38)"
                  />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl shadow-lg bg-[#242626] border-4 border-white z-40">
                    <div className="py-1 font-bold">
                      {[
                        "titleAsc",
                        "titleDesc",
                        "authorAsc",
                        "authorDesc",
                        "genre",
                        "addedAsc",
                        "addedDesc",
                        "ratingAsc",
                        "ratingDesc",
                        "newlyUpdated",
                      ].map((criteria, index, array) => (
                        <div key={criteria}>
                          <button
                            key={criteria}
                            onClick={() => {
                              setSortCriteria(criteria);
                              setIsDropdownOpen(false);
                            }}
                            className={`
            block px-4 py-2 text-lg md:text-xl w-full text-left
            ${
              sortCriteria === criteria
                ? "bg-white text-[#242626]"
                : "text-white hover:bg-white hover:text-[#242626]"
            }
          `}
                          >
                            {criteria === "titleAsc" && "Title (A-Z)"}
                            {criteria === "titleDesc" && "Title (Z-A)"}
                            {criteria === "authorAsc" && "Author (A-Z)"}
                            {criteria === "authorDesc" && "Author (Z-A)"}
                            {criteria === "genre" && "Genre"}
                            {criteria === "addedAsc" && "Old - New"}
                            {criteria === "addedDesc" && "New - Old"}
                            {criteria === "ratingAsc" && "★ 1 - 5"}
                            {criteria === "ratingDesc" && "★ 5 - 1"}
                            {criteria === "newlyUpdated" && "Recently Updated"}
                          </button>
                          {index < array.length - 1 && (
                            <hr className="border-gray-500 border-t-1 mx-2" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="text-center flex-col grid w-[90%] xl:w-[75%] lg:grid-cols-4 grid-cols-2 mx-auto justify-items-center gap-12 sm:p-3">
              {userData.books &&
                sortBooks(userData.books)
                  .filter(
                    (book) =>
                      book.title.toLowerCase().includes(searchTerm) ||
                      book.author.toLowerCase().includes(searchTerm),
                  )
                  .map((book, index, arr) => (
                    <React.Fragment key={book.id}>
                      <div
                        className="relative w-full cursor-pointer z-10"
                        onClick={(e) => {
                          e.preventDefault();
                          visitBook(book.id);
                        }}
                        onMouseMove={(e) => handleMouseMove(e, book)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {new Date(book.dateAdded) >
                          new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) && (
                          <img
                            src="/new-icon.png"
                            alt="New"
                            className="absolute top-0 left-0 z-20 w-12 md:w-20"
                          />
                        )}
                        <img
                          src="/book.webp"
                          alt="Book placeholder"
                          className="w-full shadow-custom-dark rounded-2xl"
                        />
                        <img
                          src={book.cover}
                          alt="Book cover"
                          className="absolute top-[1%] left-[7%] w-[92%] h-[98%] bottom-[-10%] object-cover shadow-lg rounded-xl"
                        />
                      </div>
                      {((index + 1) % 2 === 0 || index === arr.length - 1) &&
                        arr.length > 0 && (
                          <img
                            src="/shelf-rack.webp"
                            alt="Shelf"
                            className="col-span-2 lg:hidden w-full h-auto -mt-14 sm:-mt-16 md:-mt-20 z-0"
                            fetchPriority="high"
                          />
                        )}
                      {((index + 1) % 4 === 0 || index === arr.length - 1) &&
                        arr.length > 0 && (
                          <img
                            src="/shelf-rack.webp"
                            alt="Shelf"
                            className="hidden lg:block col-span-4 w-full h-auto -mt-24 xl:-mt-26 2xl:-mt-28 z-0"
                            fetchPriority="high"
                          />
                        )}
                    </React.Fragment>
                  ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
