import React, { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import BasicRating from "./Modify_rating";
import GradualBlur from "./GradualBlur";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { IoMdArrowRoundBack } from "react-icons/io";
const Silk = lazy(() => import("./Silk"));
import Footer from "./Footer";
import { FaSearch } from "react-icons/fa";

export default function AddBook({ userId }) {
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(3);
  const [cover, setCover] = useState(null);
  const [genre, setGenre] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorHeader, setErrorHeader] = useState("Error");
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const textareaStyle = document.createElement("style");
    textareaStyle.textContent = `
    textarea {
      overflow: overlay; /* This helps with rounded corners */
    }
    
    textarea::-webkit-scrollbar {
      width: 8px;
    }
    
    textarea::-webkit-scrollbar-track {
      background: transparent;
      border-radius: 4px;
      margin: 8px 0; /* Add margin to keep scrollbar away from corners */
    }
    
    textarea::-webkit-scrollbar-thumb {
      background: #ffffff;
      border-radius: 4px;
      margin: 8px 0; /* Add margin to keep scrollbar away from corners */
    }
    
    textarea::-webkit-scrollbar-thumb:hover {
      background: #e0e0e0;
    }
    
    textarea::-webkit-scrollbar-corner {
      background: transparent; /* Hide corner where scrollbars meet */
    }

        select {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 1rem center;
      background-size: 1.5em 1.5em;
      padding-right: 3rem; /* Add space for the arrow */
    }

    select:hover {
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23e0e0e0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
    }

    /* Style the dropdown options */
    select option {
      background-color: rgb(36,36,38);
      color: white;
      padding: 8px;
    }

    select option:hover {
      background-color: rgb(52,52,53);
    }
  `;
    document.head.appendChild(textareaStyle);

    return () => {
      document.head.removeChild(textareaStyle);
    };
  }, []);

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  const handleGenreChange = (event) => {
    setGenre(event.target.value);
  };

  const formatUrlParameter = (str) => {
    return str.trim().replace(/\s+/g, "+");
  };

  const goHome = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
      return;
    } else {
      navigate("/login");
    }
  };

  const removeCover = () => {
    setCover(null);
  };

  const fetchCover = async () => {
    if (!title || !author) {
      setErrorHeader("Missing Fields!");
      setErrorMessage(
        "Please enter both title and author to search for a cover",
      );
      handleOpen();
      return;
    }

    try {
      const encodedTitle = formatUrlParameter(title);
      const encodedAuthor = formatUrlParameter(author);
      const response = await fetch(
        `https://bookcover.longitood.com/bookcover?book_title=${encodedTitle}&author_name=${encodedAuthor}`,
      );

      if (!response.ok) {
        setErrorHeader("No Cover Found!");
        setErrorMessage(
          "No cover image was found for this title and author. Try adjusting the spelling or use a different book.",
        );
        handleOpen();
        return;
      }

      const data = await response.json();

      if (data?.url) {
        setCover(data.url);
        return;
      } else {
        setErrorHeader("No Cover Found!");
        setErrorMessage(
          "The cover service returned an unexpected response. Please try again later.",
        );
      }
    } catch (error) {
      console.error("Error fetching cover:", error);
      setErrorHeader("Network Error!");
      setErrorMessage(
        "Unable to connect to the cover search service. Please check your internet connection and try again.",
      );
      handleOpen();
    }
  };

  const formData = new FormData();
  formData.append("author", author);
  formData.append("title", title);
  formData.append("review", review);
  formData.append("rating", rating);
  if (cover) {
    formData.append("cover", cover);
  } else {
    formData.append("cover", "https://i.ibb.co/CptkSkTK/no-book.png");
  }
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();

    const storedUserId = localStorage.getItem("userId");
    const activeUserId = userId || storedUserId;

    if (!activeUserId) {
      navigate("/login");
      return;
    }

    if (!title || !review || !author || !rating || !genre) {
      setErrorHeader("Incomplete Review!");
      setErrorMessage("All fields must be filled");
      handleOpen();
      return;
    }

    const submissionCover = cover || "https://i.ibb.co/CptkSkTK/no-book.png";
    const url = `${import.meta.env.VITE_API_URL}/users/${activeUserId}`;
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        author,
        title,
        review,
        rating,
        cover: submissionCover,
        genre,
      }),
    };

    try {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error(await response.text());
      }

      // const data = await response.json();
      localStorage.removeItem(`shelf_${userId}`);
      navigate(`/user/${activeUserId}`);
    } catch (error) {
      console.error("Error adding review:", error);
      setErrorHeader("Error!");
      setErrorMessage(
        "Unable to submit the book review. Please try again later.",
      );
      handleOpen();
    }
  }

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
      <div>
        <IoMdArrowRoundBack
          size={60}
          color="white"
          onClick={goHome}
          className="z-50 h-12 md:h-16 fixed mx-auto left-2 md:left-10 mt-6 cursor-pointer"
        />
        <img
          src="/chaptr-logo-sm.webp"
          alt="Chaptr Logo"
          className="z-50 h-12 md:h-16 fixed mx-auto left-0 right-0 mt-6"
        />
      </div>
      <div className="fixed inset-0 w-full h-full min-h-screen">
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
      <div className="relative min-h-screen">
        <div className="flex h-full flex-col">
          <h2 className="text-white mt-40 md:mt-48 py-0 md:py-3 text-center mx-auto text-6xl font-bold tracking-tight font-['Radley'] max-w-[85%]">
            Add Book Review
          </h2>

          <div className="mt-20">
            <form
              action="#"
              method="POST"
              className="mb-10 lg:mb-15 w-[90%] sm:w-[70%] lg:max-w-[55%] xl:max-w-[75%] 2xl:max-w-[80%] grid grid-cols-1 xl:grid-cols-2 mx-auto items-stretch gap-10"
            >
              <div className="space-y-6 flex flex-col xl:mx-auto xl:min-w-[400px] 2xl:min-w-[550px]">
                <label
                  htmlFor="title"
                  className="block text-3xl font-bold text-white font-['Radley']"
                >
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  maxLength="50"
                  required
                  className="bg-[#242626] block w-full border-0 py-4 px-4 text-white shadow-sm ring-1 ring-inset ring-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[rgb(36,36,38)] text-lg sm:leading-6 rounded-[15px]"
                />
                <label
                  htmlFor="author"
                  className="block text-3xl font-bold text-white font-['Radley']"
                >
                  Author
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={handleAuthorChange}
                  maxLength="25"
                  required
                  className="bg-[#242626] block w-full border-0 py-4 px-4 text-white shadow-sm ring-1 ring-inset ring-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[rgb(36,36,38)] text-lg sm:leading-6 rounded-[15px]"
                />
                <label
                  htmlFor="genre"
                  className="block text-3xl font-bold text-white font-['Radley']"
                >
                  Genre
                </label>
                <select
                  name="genre"
                  id="genre"
                  value={genre}
                  onChange={handleGenreChange}
                  className={`bg-[#242626] block w-full border-0 py-4 px-4 text-white shadow-sm ring-1 ring-inset ring-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[rgb(36,36,38)] text-lg sm:leading-6 rounded-[15px] ${
                    genre === "" ? "text-gray-400" : "text-white"
                  } `}
                >
                  <option value="" disabled>
                    Select a genre...
                  </option>
                  <option value="crime">Crime / Mystery</option>
                  <option value="romance">Romance</option>
                  <option value="fantasy">Fantasy / Sci Fi</option>
                  <option value="action">Action / Adventure</option>
                  <option value="horror">Horror / Thriller</option>
                  <option value="graphic">Graphic Novel</option>
                  <option value="comedy">Comedy</option>
                  <option value="poetry">Poetry</option>
                  <option value="drama">Drama</option>
                  <option value="historical">Historical</option>
                  <option value="children">Children's</option>
                  <option value="philo">Philosophical / Religious</option>
                  <option value="Biography">Biography / Autobiography</option>
                </select>
                <label
                  htmlFor="review"
                  className="block text-3xl font-bold text-white font-['Radley']"
                >
                  Review
                </label>
                <textarea
                  value={review}
                  onChange={handleReviewChange}
                  maxLength="600"
                  required
                  className="resize-none bg-[#242626] block w-full border-0 py-4 px-4 text-white shadow-sm ring-1 ring-inset ring-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[rgb(36,36,38)] text-lg sm:leading-6 rounded-[15px]"
                  style={{ maxHeight: "300px", minHeight: "300px" }}
                />

                <div className=" mx-auto">
                  <BasicRating value={rating} setRating={setRating} />
                </div>

                {/* This button will take the user back to the home page 
                  <button
                    type="submit"
                    className="flex w-[70%] mx-auto justify-center rounded-full py-3 px-5 text-2xl font-semibold bg-white border-transparent border-2 hover:border-[#404040] hover:bg-[rgb(36,36,38)] hover:text-white text-[#404040]"
                    onClick={goHome}
                  >
                    Cancel
                  </button>
                  */}
              </div>

              <div className="flex flex-col 2xl:max-w-[700px] xl:mx-auto">
                <div className="flex justify-between items-center mb-8">
                  <label
                    htmlFor="cover"
                    className="block font-bold text-white text-3xl font-['Radley']"
                  >
                    Cover
                  </label>
                  <div className="flex gap-2">
                    {!cover && (
                      <button
                        type="button"
                        onClick={fetchCover}
                        className="p-4 shadow-custom-dark border-4 border-white bg-transparent backdrop-blur text-white rounded-full"
                      >
                        <FaSearch size={24} />
                      </button>
                    )}
                    {cover && (
                      <button
                        type="button"
                        onClick={removeCover}
                        className="px-4 py-2 bg-red-600 hover:bg-red-900 border-2 border-white text-white rounded-full text-xl"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex justify-center">
                  {!cover && (
                    <img
                      src="/no-book.png"
                      alt="Book Cover"
                      className="h-[500px] lg:h-[700px] 2xl:h-[800px] w-auto border-2 rounded-3xl border-white object-cover"
                    />
                  )}
                  {cover && (
                    <img
                      src={cover}
                      alt="Book Cover"
                      className="h-[500px] lg:h-[700px] 2xl:h-[800px] w-auto border-2 rounded-3xl border-white object-cover"
                    />
                  )}
                </div>
              </div>

              <div className="col-span-1 xl:col-span-2 mt-10 mb-20">
                <button
                  type="submit"
                  onClick={submit}
                  className="flex w-full sm:w-[250px] lg:w-[300px] xl:w-[350px] 2xl:w-[400px] mx-auto justify-center rounded-[15px] py-3 px-5 text-xl font-semibold bg-white border-transparent border-2 hover:border-white hover:bg-[rgb(105,105,105)] hover:text-white text-[#404040]"
                >
                  Confirm
                </button>
                <button
                  onClick={goHome}
                  className="mt-5 flex w-full sm:w-[250px] lg:w-[300px] xl:w-[350px] 2xl:w-[400px] mx-auto justify-center rounded-[15px] py-3 px-5 text-xl font-semibold bg-red-600 hover:bg-red-900 border-white border-2 text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12  bg-[#242626] border-2 border-white rounded-3xl p-6 max-w-[80%] sm:max-w-md">
            <img
              src="/alert.png"
              alt="Alert icon"
              className="mx-auto w-[40%]"
            ></img>
            <h1 className="text-white font-bold text-3xl mt-2 font-['Radley']">
              {errorHeader}
            </h1>
            <h2 className="text-white text-xl mt-2 font-['Libre Baskerville']">
              {errorMessage}
            </h2>
          </Box>
        </Modal>

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

        <Footer />
      </div>
    </>
  );
}
