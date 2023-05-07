import { Redirect, Route, RouteProps } from "react-router-dom";
import useAuthStore from "../stores/auth";
import {StompSessionProvider} from "react-stomp-hooks";

const AuthedRoute = ({ component: Component, path }: RouteProps) => {
  const authStore = useAuthStore()
  if (authStore.isLoggedIn() === false) {
    return <Redirect to="/login" />;
  }

  return (
    <StompSessionProvider
      url={`${import.meta.env.VITE_BACKEND_WS_URL}/ws?access_token=${encodeURIComponent(useAuthStore.getState().token!)}`}
      reconnectDelay={500}
      onStompError={(err) => console.warn(err)}
      connectionTimeout={5000}
    >
      <Route component={Component} path={path} />
    </StompSessionProvider>
  );
};

const UnauthedRoute = ({ component: Component, path }: RouteProps) => {
  const authStore = useAuthStore()
  if (authStore.isLoggedIn() === true) {
    return <Redirect to="/dashboard" />;
  }

  return <Route component={Component} path={path} />;
};

export { AuthedRoute, UnauthedRoute };