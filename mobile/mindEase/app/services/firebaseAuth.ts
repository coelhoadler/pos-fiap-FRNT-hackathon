import auth from "@react-native-firebase/auth";

export default function signUp(email: string, password: string): void {
    auth().createUserWithEmailAndPassword(email, password).then(() => {
        alert('User account created & signed in!');
    })
        .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
                alert('That email address is already in use!');
            }
        });
}
