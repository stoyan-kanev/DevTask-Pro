import {useAuth} from "../../context/AuthContext.tsx";
import {Link} from "react-router-dom";
import './NavBarCoponent.css'

export default function NavBarComponent() {
    const { user, logout, loading } = useAuth();

    return (
        <div className="navbar">
            <Link to="/" className="navbar-title">DevTask</Link>

            {!loading && (
                <div className="navbar-links">
                    {user ? (
                        <Link className="navbar-item" to="/" onClick={logout}>Logout</Link>
                    ) : (
                        <>
                            <Link className="navbar-item" to="/login">Login</Link>
                            <Link className="navbar-item" to="/register">Register</Link>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}