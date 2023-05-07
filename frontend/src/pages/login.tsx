import axios from "axios";
import {useState} from "react";
import {useMutation} from "react-query";
import {useHistory} from "react-router-dom";
import apiAxios from "../queries/axios-api";
import useAuthStore from "../stores/auth";
import jwt_decode from 'jwt-decode';

type LoginCredentials = {
    username: string;
    password: string;
};

export default function LoginPage() {
    const auth = useAuthStore();
    const history = useHistory();
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const sendLoginRequest = (credentials: LoginCredentials) => {
        const params = new URLSearchParams();
        params.append("username", credentials.username);
        params.append("password", credentials.password);
        params.append("grant_type", "password");
        params.append("client_id", "paint-webapp");
        return axios.post(`${import.meta.env.VITE_KEYCLOAK_TOKEN_URL}`, params);
    };

    const sendCreateUser = (credentials: LoginCredentials) => {
        return apiAxios.post(`/users`, {
            username: credentials.username,
            password: credentials.password
        });
    };

    const useLoginMutation = useMutation(sendLoginRequest, {
        onSuccess: (response) => {
            const accessToken = response.data.access_token;
            const decoded = jwt_decode(accessToken);

            auth.setToken(accessToken);

            // @ts-ignore
            auth.setCurrentUserId(decoded.sub);
        },
        onError: (error: any) => {
            setError("Invalid username or password");
        }
    });

    const useSignUpMutation = useMutation(sendCreateUser, {
        onSuccess: (response) => {
            auth.setCurrentUserId(response.data);
            setMessage("User created successfully. You may now login.");
        },
        onError: (error: any) => {
            setError("User with that username already exists");
        }
    });

    const handleLogin = async (e: any) => {
        e.preventDefault();
        setError(null);
        useLoginMutation.mutate({username, password});
    };

    const handleSignup = async (e: any) => {
        e.preventDefault();
        setError(null);
        useSignUpMutation.mutate({username, password});
    }

    return (
        <div className="flex items-stretch justify-center flex-col max-w-sm h-screen w-4/5">
            <h1 className="text-8xl text-center -mb-2">slack.</h1>
            <h4 className="text-2xl text-center mb-10">but not really</h4>
            <div id="button-container" className="flex flex-col justify-center items-stretch">
                <div className="divider">LOGIN</div>
                {error && <div className="text-red-500 text-center mb-3 -mt-1">{error}</div>}
                {message && <div className="text-green-500 text-center mb-3 -mt-1">{message}</div>}
                <div className="form-control gap-2">
                    <label className="input-group">
                        <span className="w-36">Username</span>
                        <input type="text" className="input input-bordered w-full" value={username}
                               onChange={(e) => setUsername(e.target.value)}/>
                    </label>
                    <label className="input-group">
                        <span className="w-36">Password</span>
                        <input type="password" className="input input-bordered w-full" value={password}
                               onChange={(e) => setPassword(e.target.value)}/>
                    </label>
                    <button className="btn btn-primary" onClick={handleLogin}>LOGIN</button>
                </div>
                <div className="divider">OR</div>
                <button className="btn btn-secondary" onClick={handleSignup}>SIGN UP</button>
            </div>
        </div>
    )
}
