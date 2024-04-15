import { lazy } from "react";
import { Redirect, Router, Switch } from "react-router-dom";
import Login from "./login";

import { CONTACTS, HOME, LOGIN } from "./paths";
import LayoutComponent from "./components/LayoutComponent";
import history from "./history";
import PrivateRoute from "./components/privateRoute";
import { useAppSelector } from "@redux/Store";
import Loader from "./components/Loader";
import WorkersWrapper from "@/wrappers/WorkersWrapper";

const Home = lazy(() => import("./home"));
const Contacts = lazy(() => import("./contacts"));

const SwitchRoute = () => {
  const { authLoading, superAdmin, authenticated, blur } = useAppSelector((state) => state.auth);

  if (authLoading) return <Loader />;
  return (
    <>
      {blur && <div className="fixed w-full h-full bg-black/50 z-[900]"></div>}
      <Router history={history}>
        {/* NORMAL USERS */}
        {!superAdmin && authenticated && (
          // eslint-disable-next-line jsx-a11y/aria-role
          <WorkersWrapper>
            <LayoutComponent role={1} history={history} isLoginPage={false}>
              <Switch>
                <PrivateRoute exact path={HOME} authenticated={authenticated} allowByRole={true} Component={Home} />
                <PrivateRoute
                  exact
                  path={CONTACTS}
                  authenticated={authenticated}
                  allowByRole={true}
                  Component={Contacts}
                />
                <Redirect to={HOME} />
              </Switch>
            </LayoutComponent>
          </WorkersWrapper>
        )}

        {/*  LOGINS NO AUTH */}
        {!superAdmin && !authenticated && (
          // eslint-disable-next-line jsx-a11y/aria-role
          <LayoutComponent role={1} history={history} isLoginPage={true}>
            <Switch>
              <PrivateRoute exact path={LOGIN} authenticated={authenticated} allowByRole={true} Component={Login} />
              <Redirect to={LOGIN} />
            </Switch>
          </LayoutComponent>
        )}
      </Router>
    </>
  );
};

export default SwitchRoute;
