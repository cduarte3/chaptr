import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HiMiniHome } from "react-icons/hi2";
import { TiThMenu } from "react-icons/ti";
import { FaWindowClose } from "react-icons/fa";
import GradualBlur from "./GradualBlur";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Footer from "./Footer";

const Silk = lazy(() => import("./Silk"));

export default function Signup() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const navigate = useNavigate();
  const [nav, setNav] = useState(true);
  const navRef = useRef();

  const handleNav = () => {
    setNav(!nav);
  };

  const goHome = () => {
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

  async function handleSubmit(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const username = e.target.username.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      handleOpen();
      return;
    } else if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      handleOpen();
      return;
    } else {
      const url = `${import.meta.env.VITE_API_URL}/signup`;
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify({
          email: email,
          username: username,
          password: password,
        }),
      };

      try {
        const response = await fetch(url, requestOptions);
        if (response.status === 201) {
          const data = await response.json();
          console.log(data);

          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.id);

          navigate(`/user/${data.id}`);
        }
        if (response.status === 400) {
          setErrorMessage("Missing required fields: email, username, password");
          handleOpen();
        }
        if (response.status === 401) {
          setErrorMessage("Password must be at least 6 characters");
          handleOpen();
        }
        if (response.status === 402) {
          setErrorMessage("Username must be between 3 and 20 characters");
          handleOpen();
        }
        if (response.status === 408) {
          setErrorMessage("Email already in use");
          handleOpen();
        }
        if (response.status === 406) {
          setErrorMessage("Username already in use");
          handleOpen();
        }
        if (response.status === 500) {
          setErrorMessage("Server connection error. Please try again later.");
          handleOpen();
        }
      } catch (error) {
        console.error("Error:", error);
        setErrorMessage("Connection error. Please try again later.");
        handleOpen();
      }
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
      <div className="fixed top-0 left-0 right-0 px-4 flex justify-between items-center py-4 z-[100]">
        <nav>
          <ul className="flex justify-center items-center space-x-4 md:px-5 text-xl px-1">
            <li>
              <img
                src="chaptr-logo-sm.webp"
                className="w-[150px]"
                alt="Chaptr Logo"
              />
            </li>
          </ul>
        </nav>
        <nav className="hidden md:flex">
          <ul className="flex justify-center items-center font-bold space-x-4 text-white sm:text-3xl md:px-5 text-xl px-1">
            <li>
              <HiMiniHome size={60} onClick={goHome} />
            </li>
          </ul>
        </nav>
        <div onClick={handleNav} className="block md:hidden">
          {!nav ? (
            <FaWindowClose size={50} color="white" />
          ) : (
            <TiThMenu size={50} color="white" />
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
            <li className="p-4 font-bold">
              <Link to="/">HOME</Link>
            </li>
            <li className="p-4 font-bold">
              <Link to="/login">SIGN IN</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative w-full min-h-screen overflow-hidden z-0">
        <div className="absolute inset-0 w-full h-full min-h-screen">
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
        <div className="mt-[3rem]  relative flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 z-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto w-[40%] lg:w-[60%]"
              src="chaptr-logo-lg.webp"
              alt="Chaptr Logo"
            />
            <h2 className="mt-10 text-center text-5xl font-bold leading-9 tracking-tight text-white font-['Radley']">
              Sign up
            </h2>
          </div>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12  bg-[#242626] border-2 border-white rounded-3xl p-6 max-w-[80%] sm:max-w-md">
              <img
                src="alert.png"
                alt="Alert icon"
                className="mx-auto w-[40%]"
              ></img>
              <h1 className="text-white font-bold text-3xl mt-2 font-['Radley']">
                Error
              </h1>
              <h2 className="text-white text-xl mt-2 font-['Libre Baskerville']">
                {errorMessage}
              </h2>
            </Box>
          </Modal>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form
              className="space-y-6"
              action="#"
              method="POST"
              onSubmit={handleSubmit}
            >
              <div>
                <label
                  htmlFor="email"
                  className="font-['Radley'] block text-2xl text-white"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="bg-[#242626] block w-full border-0 py-4 px-4 text-white shadow-sm ring-1 ring-inset ring-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[rgb(36,36,38)] text-lg sm:leading-6 rounded-[15px]"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="font-['Radley'] block text-2xl text-white"
                >
                  Username
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    className="bg-[#242626] block w-full border-0 py-4 px-4 text-white shadow-sm ring-1 ring-inset ring-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[rgb(36,36,38)] text-lg sm:leading-6 rounded-[15px]"
                    placeholder="Username"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="font-['Radley'] block text-2xl text-white"
                  >
                    Password (min. 6 chars)
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    placeholder="Password"
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="bg-[#242626] block w-full border-0 py-4 px-4 text-white shadow-sm ring-1 ring-inset ring-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[rgb(36,36,38)] text-lg sm:leading-6 rounded-[15px]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="confirmPassword"
                    className="font-['Radley'] block text-2xl text-white"
                  >
                    Confirm Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    placeholder="Password"
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="bg-[#242626] block w-full border-0 py-4 px-4 text-white shadow-sm ring-1 ring-inset ring-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[rgb(36,36,38)] text-lg sm:leading-6 rounded-[15px]"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center mx-auto rounded-[15px] py-3 px-5 text-xl font-semibold bg-white border-transparent border-2 hover:border-[#404040] hover:bg-[rgb(36,36,38)] hover:text-white text-[#404040]"
                >
                  Sign up
                </button>
                <h2 className="mt-4 text-center text-2xl leading-9 tracking-tight text-white">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="font-bold hover:underline text-blue-300"
                  >
                    Sign in
                  </a>
                </h2>
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
