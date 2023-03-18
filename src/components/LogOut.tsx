import { signOut } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '.././firebase'
import { BiLogOut } from 'react-icons/bi'


export default function LogOut() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  return (
    <div className='d-flex justify-content-between align-items-center'>
      <div
        role='button'
        onClick={() => {
          signOut(auth);
          navigate('/');
        }}
      >
        <BiLogOut fontSize='2rem' color='#dc3545' />
      </div>

      {/* loged user badge */}
      <div className='d-flex align-items-center'>
        <span className='text-muted'>As</span>
        <span className='ms-1 badge text-bg-success' style={{ fontSize: '1rem' }}>
          {user?.displayName}
        </span>
      </div>
    </div>
  )
}
