import { signIn } from "@/app/services/firebaseAuth";

export default function doLogin(email: string, password: string) {
    return signIn(email, password).then((userCredential) => {
        const user = userCredential.user;
        alert('Login successful: ' + user.email);
        return userCredential;
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error)
        alert('Login failed: ' + errorMessage);
        throw error;
    });
}