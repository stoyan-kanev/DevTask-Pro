import {useAuth} from "../../context/AuthContext.tsx";
import {Link} from "react-router-dom";


export default function NavBarComponent() {

    const { user ,logout,loading} = useAuth();




    return (
        <div>
            <h1>DevTask</h1>


            {loading ? null : user ? (
                <>
                    <Link className="navbar-item" to="/" onClick={logout}>Logout</Link>
                </>

            ) : (
                <>
                    <Link className="navbar-item" to="/login">Login</Link>
                    <Link className="navbar-item" to="/register">Register</Link>
                </>
            )}


        </div>
    )


}