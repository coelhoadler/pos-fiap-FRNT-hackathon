import { Redirect } from "expo-router";

export default function Index() {

    const isLogged = false;

    if (isLogged) {
        return <Redirect href="/(screens)/home" />;
    }

    return <Redirect href="/(screens)/login" />;
}