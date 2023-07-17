import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Layout from "../layout/index";
import Cart from "../pages/Cart";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Product from "../pages/Product";
import Profile from "../pages/Profile";
import Register from "../pages/Register";
import History from "../pages/History";
import Categories from "../pages/Categories";
import Items from "../pages/Items";
import Trash from "../pages/Trash";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Layout />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },

      {
        path: "/product/category",
        element: <Categories />,
      },
      {
        path: "/product/items",
        element: <Items />,
      },

      {
        path: "/history",
        element: <History />,
      },
      {
        path: "/trash",
        element: <Trash />,
      },
    ],
  },

  {
    path: "/product",
    element: <Product />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export default Router;
