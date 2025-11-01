import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

export const AuthRoute = ({ component: Component, ...rest }) => {
  const { authenticated } = useSelector((state) => state.auth);

  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated === true ? <Redirect to="/" /> : <Component {...props} />
      }
    />
  );
};

export const UserRoute = ({ component: Component, ...rest }) => {
  const {
    authenticated,
    account: { role },
  } = useSelector((state) => state.auth);
  // console.log(props.component);
  // console.log("props:", ...props);

  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated === true && role === "ROLE_SELLER" ? (
          <Redirect to="/seller/dashboard" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export const SellerRoute = ({ component: Component, ...rest }) => {
  const {
    authenticated,
    account: { role },
  } = useSelector((state) => state.auth);

  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated === true && role === "ROLE_USER" ? (
          <Redirect to="/" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};
export const DeliveryRoute = ({ component: Component, ...rest }) => {
  const {
    authenticated,
    account: { role },
  } = useSelector((state) => state.auth);

  return (
    <Route
      {...rest}
      render={(props) =>
        !authenticated ? (
          <Redirect to="/login" /> // Chuyển hướng đến /login nếu chưa xác thực
        ) : role === "ROLE_DELIVERY" ? (
          <Component {...props} /> // Render Component (profile) nếu là ROLE_DELIVERY
        ) : (
          <Redirect to="/" /> // Chuyển hướng về / nếu không phải ROLE_DELIVERY
        )
      }
    />
  );
};