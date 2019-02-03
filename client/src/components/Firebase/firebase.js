import app from 'firebase/app'
import 'firebase/auth'

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
};

// const config = {
//     apiKey: "AIzaSyBqYf41qFzBDvTuhYwXIBnqN8FTnzDqdCc",
//     authDomain: "debatably-5f3b4.firebaseapp.com",
//     databaseURL: "https://debatably-5f3b4.firebaseio.com",
//     projectId: "debatably-5f3b4",
//     storageBucket: "debatably-5f3b4.appspot.com",
//     messagingSenderId: "148710591281"
// };

class Firebase {
    constructor() {
        app.initializeApp(config)

        this.auth = app.auth()
    }

    // *** Auth API *** (Asynchronous endpoints)

    doSignUp = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password)

    doSignIn = (email, password) =>
        this.auth.signInAndRetrieveDataWithEmailAndPassword(email, password)

    doSignOut = () => this.auth.signOut()

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email)

    doPasswordUpdate = password =>
        this.auth.currentUser.updatePassword(password)
}

export default Firebase