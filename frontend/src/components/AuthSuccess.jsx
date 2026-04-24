import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function AuthSuccess() {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const username = params.get("username");

        if (username) {
            localStorage.setItem("user", username);
        }

        navigate("/");
    }, []);

    return <p>Logging in...</p>;
}