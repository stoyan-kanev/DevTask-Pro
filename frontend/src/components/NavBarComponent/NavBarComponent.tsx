import {useAuth} from "../../context/AuthContext.tsx";


export default function NavBarComponent() {

    const { user } = useAuth();

    console.log(user)
    return (
        <div>
            <h1>test</h1>
        </div>
    )


}