import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useState } from 'react'
import { Button, Spinner } from 'react-bootstrap';
import { auth } from '.././firebase'
import { FcGoogle } from 'react-icons/fc';



export default function GoogleLogIn() {
    const [loading, setloading] = useState(false);

    function logInWithGoogle() {
        setloading(true);

        signInWithPopup(auth, new GoogleAuthProvider())
            .then(() => {
                setloading(true);
            })
            .catch(() => {
                setloading(false);
            })
    }

    return (
        <Button
            onClick={() => logInWithGoogle()}
            disabled={loading}
            variant='outline-primary'
        >
            <div className='d-flex justify-content-center align-items-center'>
                <FcGoogle />
                <span>oogle LogIn</span>
                {loading && <Spinner variant='light' animation='border'></Spinner>}
            </div>
        </Button>
    )
}
