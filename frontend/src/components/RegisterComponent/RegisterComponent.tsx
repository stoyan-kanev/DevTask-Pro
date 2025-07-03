import {type FormEvent, useState} from "react";
import {registerApi} from "../../api/authApi.tsx";
import {useAuth} from "../../context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import './RegisterComponent.css'
import axios from "axios";

export default function RegisterComponent(){

    const { register } = useAuth();
    const navigate = useNavigate();


    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);




    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            await registerApi(email,firstName,lastName, password);
            await register()
            navigate("/");
        }catch (err) {
            if (axios.isAxiosError(err)) {
                const data = err.response?.data;
                if (data?.details) {
                    const firstKey = Object.keys(data.details)[0];
                    const messages = data.details[firstKey];
                    if (messages && messages.length > 0) {
                        setError(messages[0]);
                        return;
                    }
                }
                if (data?.error) {
                    setError(data.error);
                    return;
                }
                setError(err.message || "An unknown error occurred.");
            } else {
                setError("An unexpected error occurred.");
            }
        }



    }
    return (
        <div className="center-wrapper">
            <div className="register-container">
                <h2>Register</h2>
                {error && <p className="error">{error}</p>}
                <form id="registerForm" method="POST" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            value={email}
                            autoComplete="username"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="firstName">Fist Name</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            value={firstName}
                            autoComplete="firstName"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            value={lastName}
                            autoComplete="lastName"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            value={password}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            value={confirmPassword}
                        />
                    </div>
                    <button type="submit" className="register-button">Register</button>
                    <div className="register-link">
                        <p>Already have an account? <a href="/login">Login here</a></p>
                    </div>
                </form>
            </div>
        </div>

    )
}