import { Container } from 'react-bootstrap'
import { useAuthState } from 'react-firebase-hooks/auth';
import GoogleLogIn from '../components/GoogleLogIn'
import { auth } from '../firebase';
import Chat from './Chat';


export default function Home() {
  const [user] = useAuthState(auth);
  return (
    <Container className='d-flex justify-content-center' style={{ height: '100vh' }}>
      {
        user ?
          <Chat />
          :
          <div className='d-flex flex-column mt-5' style={{ height: 'fit-content' }}>
            <h1 className='mb-4'>Welcome to chat app</h1>
            <GoogleLogIn />
          </div>
      }
    </Container>
  )
}
