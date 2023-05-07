import axios from "axios";
import { useState } from "react";
import { useMutation } from "react-query";
import { useHistory } from "react-router-dom";
import { User } from "../models/user";
import apiAxios from "../queries/axios-api";
import useAuthStore from "../stores/auth";
import { useUserStore } from "../stores/user";

type LoginCredentials = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const auth = useAuthStore();
  const history = useHistory();
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const sendLoginRequest = (credentials: LoginCredentials) => {
    const params = new URLSearchParams();
    params.append("username", credentials.username);
    params.append("password", credentials.password);
    params.append("grant_type", "password");
    params.append("client_id", "login-app");
    return axios.post(`${import.meta.env.VITE_KEYCLOAK_TOKEN_URL}`, params);
  };

  const sendCreateUser = () => {
    return apiAxios.post(`/users`);
  };

  const useCreateUser = useMutation(sendCreateUser, {
    onSuccess: (response) => {
      // backend returns the current user ID (as per the JWT token)
      auth.setCurrentUserId(response.data);
    },
    onError: (error: any) => {
      setError("Backend error, please try again later");
    }
  });

  const useLoginMutation = useMutation(sendLoginRequest, {
    onSuccess: (response) => {
      auth.setToken(response.data.access_token);
      useCreateUser.mutate();
    },
    onError: (error: any) => {
      setError("Invalid username or password");
    }
  });

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError(null);
    useLoginMutation.mutate({ username, password });
  };
      
  
  // const handleLogin = async (userId: string) => {
  //   const res = await axios.get<User[]>(`${import.meta.env.VITE_BACKEND_URL}/users/`)
  //   const user = res.data.find((user) => user.id === userId);

  //   if (!user) return;

  //   //userStore.loginUser(user);
  //   history.replace("/dashboard");
  // };

  return ( 
    <div className="flex items-stretch justify-center flex-col max-w-sm h-screen w-4/5">
      <h1 className="text-8xl text-center -mb-2">slack.</h1>
      <h4 className="text-2xl text-center mb-10">but not really</h4>
      <div id="button-container" className="flex flex-col justify-center items-stretch">
        <div className="divider">LOGIN</div>
        {error && <div className="text-red-500 text-center mb-3 -mt-1">{error}</div>}
        <div className="form-control gap-2">
          <label className="input-group">
            <span className="w-36">Username</span>
            <input type="text" className="input input-bordered w-full" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <label className="input-group">
            <span className="w-36">Password</span>
            <input type="password" className="input input-bordered w-full" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <button className="btn btn-primary" onClick={handleLogin}>LOGIN</button>
        </div>
      <div className="divider">OR</div>
      <button className="btn btn-secondary">SIGN UP</button>
      </div>
    </div>
  )
}