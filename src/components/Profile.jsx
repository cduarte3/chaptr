import React, { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import GradualBlur from "./GradualBlur";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { IoMdArrowRoundBack } from "react-icons/io";
const Silk = lazy(() => import("./Silk"));
import Footer from "./Footer";

export default function UserProfile({ userData }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [modalIcon, setModalIcon] = useState("/alert.png");
  const [modalMessage, setModalMessage] = useState("");
  const [modalHeader, setModalHeader] = useState("Error");
  const [open, setOpen] = React.useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isModalLocked, setIsModalLocked] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    if (!isModalLocked) {
      setOpen(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  function cancelForm() {
    const token = localStorage.getItem("token");
    if (token) {
      navigate(-1);
      return;
    } else {
      navigate("/login");
    }
  }

  const getPosessiveName = (name) => {
    return name.endsWith("s") ? `${name}'` : `${name}'s`;
  };

  async function formValidation(event) {
    event.preventDefault();
    const token = localStorage.getItem("token");
    try {
      if (!token) {
        console.error("Token is not available");
        navigate("/login");
        return;
      } else if (
        username === userData.username ||
        email === userData.email ||
        (username === "" && email === "" && password === "")
      ) {
        setModalIcon("/alert.png");
        setModalHeader("No Changes");
        setModalMessage("All fields empty or unchanged. Please try again.");
        setIsModalLocked(false);
        handleOpen();
        return;
      } else if (password && password !== confirmPassword) {
        setModalIcon("/alert.png");
        setModalHeader("Password Mismatch");
        setModalMessage("Passwords do not match.");
        setIsModalLocked(false);
        handleOpen();
        return;
      } else if (password && password.length < 6) {
        setModalIcon("/lock.png");
        setModalHeader("Weak Password");
        setModalMessage("Password must be at least 6 characters.");
        setIsModalLocked(false);
        handleOpen();
        return;
      }
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify({ username, email, password }),
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${userData.id}/update`,
        requestOptions,
      );
      if (response.status === 200) {
        setModalIcon("/success.png");
        setModalHeader("Success!");
        setModalMessage("Profile updated successfully.");
        setIsModalLocked(true);
        setCountdown(5);
        handleOpen();

        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              navigate(`/user/${userData.id}`);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }

      if (!response.ok) {
        if (response.status === 400) {
          setModalIcon("/alert.png");
          setModalHeader("Error!");
          setModalMessage("Username must be between 3 and 20 characters.");
          setIsModalLocked(false);
          handleOpen();
          return;
        }
        if (response.status === 401) {
          setModalIcon("/alert.png");
          setModalHeader("Error!");
          setModalMessage("Email cannot be changed for a google OAuth User.");
          setIsModalLocked(false);
          handleOpen();
          return;
        }
        if (response.status === 404) {
          setModalIcon("/alert.png");
          setModalHeader("Error!");
          setModalMessage("Error with updating profile. User not found.");
          setIsModalLocked(false);
          handleOpen();
          return;
        }
        if (response.status === 407) {
          setModalIcon("/lock.png");
          setModalHeader("Error!");
          setModalMessage("Password must be at least 6 characters.");
          setIsModalLocked(false);
          handleOpen();
          return;
        }
        if (response.status === 408) {
          setModalIcon("/alert.png");
          setModalHeader("Conflict!");
          setModalMessage("Email already in use.");
          setIsModalLocked(false);
          handleOpen();
          return;
        }
        if (response.status === 409) {
          setModalIcon("/alert.png");
          setModalHeader("Conflict!");
          setModalMessage("Username already in use.");
          setIsModalLocked(false);
          handleOpen();
          return;
        }
        if (response.status === 500) {
          setModalIcon("/alert.png");
          setModalHeader("Error!");
          setModalMessage("Server connection error. Please try again later.");
          setIsModalLocked(false);
          handleOpen();
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
  /*
    The following was used to validate the username and password fields.

    It has been changed for functionality purposes.

      const regex_Username = /^[A-Za-z](?=.*\d)[A-Za-z\d]*$/;
          const regex_Password =
            / ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

          if (!regex_Username.test(username)) {
            alert("Error!! Enter a valid username");
          }

          if (!regex_Password.test(password) || password.length < 8) {
              alert("Error!! Password does not meet requirements");
          }
    */

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
          onClick={cancelForm}
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
      <div className="relative flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 z-10">
        <div className="flex h-full flex-col">
          <h2 className="flex flex-wrap justify-center items-center gap-4 text-white mt-20 py-0 md:py-3 text-center mx-auto text-6xl font-bold tracking-tight font-['Radley'] max-w-[85%]">
            <span>{getPosessiveName(userData.username)}</span>
            <span>Profile</span>
          </h2>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={formValidation} className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="font-['Radley'] block text-2xl text-white"
                >
                  Username
                </label>
                <div className="mt-2 shadow">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={userData.username}
                    minLength={3}
                    maxLength={20}
                    className="bg-[#242626] block w-full border-0 py-4 px-4 text-white shadow-sm ring-1 ring-inset ring-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[rgb(36,36,38)] text-lg sm:leading-6 rounded-[15px]"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="Email"
                  className="font-['Radley'] block text-2xl text-white"
                >
                  Email{" "}
                  {userData.googleId && (
                    <span className="text-sm text-gray-400">
                      (Google OAuth)
                    </span>
                  )}
                </label>
                <div className="mt-2 shadow">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={userData.email}
                    disabled={userData.googleId}
                    className={`bg-[#242626] block w-full border-0 py-4 px-4 text-white shadow-sm ring-1 ring-inset ring-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[rgb(36,36,38)] text-lg sm:leading-6 rounded-[15px] ${
                      userData.googleId ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="Password"
                  className="font-['Radley'] block text-2xl text-white"
                >
                  Password
                </label>
                <div className="mt-2 shadow">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    className="bg-[#242626] block w-full border-0 py-4 px-4 text-white shadow-sm ring-1 ring-inset ring-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[rgb(36,36,38)] text-lg sm:leading-6 rounded-[15px]"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="font-['Radley'] block text-2xl text-white"
                >
                  Confirm Password
                </label>
                <div className="mt-2 shadow">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={6}
                    className="bg-[#242626] block w-full border-0 py-4 px-4 text-white shadow-sm ring-1 ring-inset ring-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[rgb(36,36,38)] text-lg sm:leading-6 rounded-[15px]"
                  />
                </div>
              </div>
              <div className="mt-10 mb-20">
                <button
                  type="submit"
                  className="flex w-full justify-center mx-auto rounded-[15px] py-3 px-5 text-xl font-semibold bg-white border-transparent border-2 hover:border-white hover:bg-[rgb(105,105,105)] hover:text-white text-[#404040]"
                >
                  Confirm
                </button>
                <button
                  onClick={cancelForm}
                  className="mt-5 flex w-full justify-center mx-auto rounded-[15px] py-3 px-5 text-xl font-semibold bg-red-600 hover:bg-red-900 border-white border-2 text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableEscapeKeyDown={isModalLocked}
      >
        <Box className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12  bg-[#242626] border-2 border-white rounded-3xl p-6 max-w-[80%] sm:max-w-md">
          <img
            src={modalIcon}
            alt="Alert icon"
            className="mx-auto w-[40%]"
          ></img>
          <h1 className="text-white font-bold text-3xl mt-2 font-['Radley']">
            {modalHeader}
          </h1>
          <h2 className="text-white text-xl mt-2 font-['Libre Baskerville']">
            {modalMessage}
          </h2>
          {countdown > 0 && (
            <h2 className="text-white text-lg mt-2 font-['Libre Baskerville']">
              Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}...
            </h2>
          )}
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
    </>
  );
}
