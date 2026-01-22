import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useNavigate, Link } from "react-router-dom";
const Footer = lazy(() => import("./Footer"));
import { FiLogOut } from "react-icons/fi";
import { TiThMenu } from "react-icons/ti";
import { FaUserCircle, FaWindowClose } from "react-icons/fa";
import { TbBooks, TbMessageCheck } from "react-icons/tb";
import { RiBookMarkedLine } from "react-icons/ri";
import { LuBookOpenText } from "react-icons/lu";
const GradualBlur = lazy(() => import("./GradualBlur"));
import SpotlightCard from "./SpotlightCard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
const Silk = lazy(() => import("./Silk"));

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  useEffect(() => {
    const timer = setTimeout(() => {
      let ctx = gsap.context(() => {
        gsap.fromTo(
          ".custom-spotlight-card",
          { y: 50, opacity: 0 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            scrollTrigger: {
              trigger: ".custom-spotlight-card",
              start: "top 90%",
              toggleActions: "play none none",
            },
          },
        );

        gsap.fromTo(
          ".craft-section",
          { y: 50, opacity: 0 },
          {
            opacity: 1,
            duration: 0.6,
            y: 0,
            scrollTrigger: {
              trigger: ".craft-section",
              start: "top 55%",
              toggleActions: "play none none",
            },
          },
        );

        gsap.fromTo(
          ".step-card",
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: window.innerWidth < 1024 ? 0.2 : 0,
            scrollTrigger: {
              trigger: ".steps-container",
              start: "top 75%",
              toggleActions: "play none none",
            },
          },
        );

        gsap.fromTo(
          ".get-started-section",
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            scrollTrigger: {
              trigger: ".get-started-section",
              start: "top 75%",
              toggleActions: "play none none",
            },
          },
        );
      });
      return () => ctx.revert();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [nav, setNav] = useState(true);
  const navRef = useRef();

  const handleNav = () => {
    setNav(!nav);
  };

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const goProfile = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/user/" + userId + "/profile");
      return;
    }
  };

  const goShelf = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/user/" + userId);
      return;
    } else {
      navigate("/");
    }
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
          <ul className="flex justify-center items-center font-bold space-x-4 text-white text-2xl font-['Radley']">
            {!token && (
              <>
                <li className="md:px-3 py-3">
                  <Link to="/login" className="px-5 hover:text-[rgb(82,82,82)]">
                    SIGN IN
                  </Link>
                </li>
                <li className="md:px-3 py-3">
                  <Link
                    to="/signup"
                    className="px-5 hover:text-[rgb(82,82,82)]"
                  >
                    SIGN UP
                  </Link>
                </li>
              </>
            )}
            {token && (
              <>
                <li className="md:px-3" onClick={goShelf}>
                  <TbBooks size={60} />
                </li>
                <li className="md:px-3" onClick={goProfile}>
                  <FaUserCircle size={60} />
                </li>
                <li className="md:px-5">
                  <FiLogOut size={60} onClick={logOut} />
                </li>
              </>
            )}
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
            {!token && (
              <>
                <li className="p-4 font-bold">
                  <Link to="login">SIGN IN</Link>
                </li>
                <li className="p-4 font-bold">
                  <Link to="/signup">SIGN UP</Link>
                </li>
              </>
            )}
            {token && (
              <>
                <li className="p-4 font-bold" onClick={goShelf}>
                  <Link>BOOKSHELF</Link>
                </li>
                <li className="p-4 font-bold" onClick={goProfile}>
                  <Link>PROFILE</Link>
                </li>
                <li className="p-4 font-bold" onClick={logOut}>
                  <Link>LOG OUT</Link>
                </li>
              </>
            )}
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

      <div className="relative lg:fixed inset-0 w-full h-full z-5 min-h-screen justify-center items-center flex">
        <div className="w-full mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 pt-20 mx-auto justify-center items-center content-center pb-20 lg:pb-0">
            <img
              src="chaptr-logo-lg.webp"
              alt="Chaptr logo"
              className="w-auto h-[55%] mx-auto"
            />
            <div className="md:block hidden">
              <img
                src="desk_dash.webp"
                className="w-auto mx-auto px-10 lg:pr-10"
                alt="Laptop with app screenshot"
                fetchPriority="high"
              />
            </div>
            <div className="md:hidden">
              <img
                src="mobile_dash.webp"
                className="w-auto mx-auto px-10 sm:px-32"
                alt="Smartphone with app screenshot"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <div className="lg:min-h-screen"></div>

        <img
          src="book_div.svg"
          alt="Waves"
          className="w-full rotate-180 relative z-20 h-10 sm:h-16 md:h-18 lg:h-20 xl:h-24"
        />

        <div className="-mt-[1px] relative w-full min-h-screen flex flex-col bg-[#242626]">
          <SpotlightCard
            className="custom-spotlight-card w-[90%] h-full max-w-[1800px] mx-auto mt-20 md:mt-32 lg:mt-44 mb-10 border border-gray-100 flex flex-col items-center text-center p-10 lg:p-20"
            spotlightColor="rgba(255, 255, 255, 0.2)"
          >
            <h1 className="text-white text-6xl sm:text-7xl lg:text-8xl xl:text-[7rem] 2xl:text-9xl drop-shadow-lg text-center font-['Radley']">
              <span className="lg:hidden">
                Welcome
                <br />
                to Chaptr
              </span>
              <span className="hidden lg:block">Welcome to Chaptr</span>
            </h1>
            <h2 className="py-10 lg:py-20 text-center text-2xl md:text-3xl 2xl:text-4xl max-w-[90%] sm:max-w-[80%] text-white">
              Chaptr is your personal digital library, designed to make book
              reviews simple and intuitive.
            </h2>
            <Link to="/login">
              <button className="font-['Radley'] flex w-[180px] lg:w-[300px] justify-center mx-auto rounded-[15px] py-3 px-5 text-2xl lg:text-3xl font-semibold bg-white border-transparent border-2 hover:border-white hover:bg-[rgb(187,187,187)] text-[#404040]">
                Get Started
              </button>
            </Link>
          </SpotlightCard>

          <div className="h-full relative w-full px-5 lg:px-20 overflow-hidden">
            <div className="craft-section">
              <div className="grid lg:grid-cols-12 gap-12 mb-24 border-b border-white/30 pb-16"></div>
              <div className="absolute -right-[9rem] lg:-right-80 2xl:-right-34 top-20 w-[35rem] h-[35rem] lg:w-[70rem] lg:h-[70rem] border border-white/30 rounded-full"></div>

              <h1 className="text-white text-5xl sm:text-7xl lg:text-8xl xl:text-[7rem] 2xl:text-9xl drop-shadow-lg mx-auto lg:mx-0 text-center lg:text-left mb-20 font-['Radley']">
                CRAFT YOUR
                <br />
                <i>DIGITAL</i>
                <br />
                COLLECTION
              </h1>

              <h2 className="text-2xl md:text-3xl 2xl:text-4xl text-white w-[90%] lg:max-w-[70%] mx-auto lg:mx-0 text-center lg:text-left">
                As your collection grows, Chaptr becomes a searchable archive,
                helping you revisit past thoughts, track what you've read, and
                stay connected to the stories that matter to you.
              </h2>
            </div>
            <div>
              <div className="grid lg:grid-cols-12 gap-12 mb-24 border-b border-white/30 pb-16"></div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24 text-white steps-container">
                <div className="flex flex-col items-center lg:items-start lg:mx-auto step-card">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="border-white/30 border-2 w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0">
                      <RiBookMarkedLine size={48} />
                    </div>
                    <h1 className="font-['Radley'] text-2xl 2xl:text-3xl">
                      Step 1
                    </h1>
                  </div>
                  <h2 className="font-['Radley'] text-3xl 2xl:text-5xl mb-5 text-center lg:text-left">
                    CATALOG
                  </h2>
                  <h3 className="text-lg 2xl:text-2xl text-center lg:text-left">
                    Enter book details, your thoughts, and select a Cover.
                  </h3>
                </div>
                <div className="flex flex-col items-center lg:items-start lg:mx-auto step-card">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="border-white/30 border-2 w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0">
                      <TbMessageCheck size={48} />
                    </div>
                    <h1 className="font-['Radley'] text-2xl 2xl:text-3xl">
                      Step 2
                    </h1>
                  </div>
                  <h2 className="font-['Radley'] text-3xl 2xl:text-5xl mb-5 text-center lg:text-left">
                    BUILD
                  </h2>
                  <h3 className="text-lg 2xl:text-2xl text-center lg:text-left">
                    Save or modify entries and watch your personalized library
                    grow.
                  </h3>
                </div>
                <div className="flex flex-col items-center lg:items-start lg:mx-auto step-card">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="border-white/30 border-2 w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0">
                      <LuBookOpenText size={48} />
                    </div>
                    <h1 className="font-['Radley'] text-2xl 2xl:text-3xl">
                      Step 3
                    </h1>
                  </div>
                  <h2 className="font-['Radley'] text-3xl 2xl:text-5xl mb-5 text-center lg:text-left">
                    REVISIT
                  </h2>
                  <h3 className="text-lg 2xl:text-2xl text-center lg:text-left">
                    Browse your collection, and reflect on past favourites.
                  </h3>
                </div>
              </div>

              <div className="grid lg:grid-cols-12 gap-12 mb-24 border-b border-white/30"></div>
            </div>
          </div>

          <div className="flex flex-col mx-auto mb-[8rem] font-['Radley'] items-center get-started-section">
            <h1 className="text-white text-6xl sm:text-7xl lg:text-8xl drop-shadow-lg text-center my-5">
              <span className="lg:hidden">
                Get Started
                <br />
                Now
              </span>
              <span className="hidden lg:block">Get Started Now</span>
            </h1>
            <Link to="/login" className="mt-10">
              <button className="w-[300px] md:w-[400px] 2xl:w-[450px] bg-white border-transparent border-2 hover:border-white hover:bg-[rgb(187,187,187)] text-[#404040] font-semibold sm:py-4 md:px-9 py-3 px-5 rounded-[15px] md:text-3xl text-2xl">
                Sign In
              </button>
            </Link>

            <Link to="/signup" className="mt-8">
              <button className="w-[300px] md:w-[400px] 2xl:w-[450px] bg-[#404040] border-transparent border-2 hover:border-[#404040] hover:bg-[rgb(36,36,38)] text-white font-semibold sm:py-4 md:px-9 py-3 px-5 rounded-[15px] md:text-3xl text-2xl">
                Sign Up
              </button>
            </Link>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}
