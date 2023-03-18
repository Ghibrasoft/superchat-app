import { deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react'
import { Card, Container } from 'react-bootstrap'
import Moment from 'react-moment';
import { auth, dataBase, queryRef } from '../firebase';
import { SendMessage } from '../components/SendMessage'
import { RiDeleteBinLine } from 'react-icons/ri'
import LogOut from '../components/LogOut';
import { useAuthState } from 'react-firebase-hooks/auth';



export default function Chat() {
  const [messages, setMessages] = useState<any[]>([]); // need a type 
  const scrollRef = useRef<HTMLInputElement>(null);
  const [user] = useAuthState(auth);

  /*===== set messages in firestore =====*/
  useEffect(() => {
    const unSubscribe = onSnapshot(queryRef, (snapshot) => {
      let msgs = [] as any;
      snapshot.forEach((docItem => {
        msgs.push({ ...docItem.data(), id: docItem.id })
      }))
      setMessages(msgs);
    })
    return () => unSubscribe();
  }, []);

  /*===== remove messages from firestore =====*/
  function deleteMessage(id: string) {
    return deleteDoc(doc(dataBase, "messages", id));
  }


  return (
    <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '700px' }}>

      <Card style={{ width: '95%', height: '80%', overflow: 'auto' }} >
        <Card.Header className='w-100 text-center' style={{ height: '10%' }}>
          {user && <LogOut />}
        </Card.Header>

        {/* show full info of message */}
        <div style={{ overflow: 'auto', height: '100%' }}>
          {
            messages.map(msg => (
              <Card.Body key={msg.id} className={`d-flex ${msg.uid === auth.currentUser?.uid ? 'justify-content-end' : 'justify-content-start'}`}
                style={{ position: 'relative' }}>

                {/* User image  */}
                <Card.Img src={msg.photoURL} alt='user-img' className='d-flex'
                  style={{
                    borderRadius: '50%',
                    height: '30px',
                    width: '30px',
                    position: 'absolute',
                  }}
                />

                {/* show message */}
                <div>
                  <div
                    className={`p-2 mx-5 ${msg.uid === auth.currentUser?.uid ? 'bg-light' : 'bg-primary text-white'}`}
                    style={{ borderRadius: '10px' }} >
                    <div className='d-flex flex-column'>
                      <span className='text-break'>{msg.text}</span>
                      {/* display send file/image */}
                      {
                        msg.imgURL &&
                        <Card>
                          <a href={msg.imgURL}>
                            <Card.Img src={msg.imgURL} alt='img' style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
                          </a>
                        </Card>
                      }
                    </div>
                  </div>

                  {/* show Timestamp (send message time) */}
                  <small className={`text-muted d-flex ${msg.uid === auth.currentUser?.uid ? 'justify-content-end' : 'justify-content-start'}`}>
                    <Moment fromNow>{msg.createdAt.toDate()}</Moment>
                    {
                      msg.uid === auth.currentUser?.uid &&
                      <span onClick={() => deleteMessage(msg.id)} style={{ fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', marginLeft: '3px' }}>
                        <RiDeleteBinLine />
                      </span>
                    }
                  </small>
                </div>

              </Card.Body>
            ))
          }
          <div ref={scrollRef}></div>
        </div>

        {/* send message field */}
        <Card.Footer className='d-flex justify-content-end' style={{ height: '15%' }}>
          <SendMessage scrollRef={scrollRef} />
        </Card.Footer>

      </Card>
    </Container>
  )
}
