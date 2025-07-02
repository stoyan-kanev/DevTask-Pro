import {useState} from "react";
import './LoginComponent.css'
import {useAuth} from "../../context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import {loginApi} from "../../api/authApi.tsx";

export default function LoginComponent() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { login } = useAuth();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            await loginApi(email, password);
            await login();
            navigate("/");
        } catch {
            setError("Wrong email or password");
        }
    };


    return (
        <div className="center-wrapper">
            <div className="login-container">
                <h2>Login</h2>
                {error && <p className="error">{error}</p>}
                <form id="loginForm" method="POST" onSubmit={handleSubmit}>
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
                    <button type="submit" className="login-button">Log In</button>
                    <div className="register-link">
                        <p>Don't have an account? <a href="/register">Register here</a></p>
                    </div>
                </form>
            </div>
        </div>

    )


}