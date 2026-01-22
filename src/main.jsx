import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App";
import NotFound from "./404";
import Log from "./login";
import Sign from "./signup";
import Bookshelf from "./Bookshelf";
import Add from "./Add";
import Book from "./Book";
import Protected from "./Protected";
import User from "./User";
import Edit from "./Edit";
import FAQ from "./FAQ";
import Support from "./Support";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="login" element={<Log />} />
          <Route path="signup" element={<Sign />} />
          <Route path="*" element={<NotFound />} />
          <Route
            path="/user/:userId"
            element={
              <Protected>
                <Bookshelf />
              </Protected>
            }
          />
          <Route
            path="/user/:userId/add"
            element={
              <Protected>
                <Add />
              </Protected>
            }
          />
          <Route
            path="/user/:userId/book/:bookId"
            element={
              <Protected>
                <Book />
              </Protected>
            }
          />
          <Route
            path="/user/:userId/profile"
            element={
              <Protected>
                <User />
              </Protected>
            }
          />
          <Route
            path="/user/:userId/book/:bookId/edit"
            element={
              <Protected>
                <Edit />
              </Protected>
            }
          />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/support" element={<Support />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
