import { Redirect } from "expo-router";
import { isAuthenticated } from "./services/firebaseAuth";

export default function Index() {

    const isLogged = isAuthenticated();

    if (isLogged) {
        return <Redirect href="/(screens)/home/home" />;
    }

    return <Redirect href="/(screens)/login/login" />;
}