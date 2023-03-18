import { addDoc, collection, Timestamp } from 'firebase/firestore';
import React, { useRef, useState } from 'react'
import { Button, Form, Stack } from 'react-bootstrap'
import { auth, dataBase, messageRef, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { IoIosAttach } from 'react-icons/io'
import { HiOutlineEmojiHappy } from 'react-icons/hi'
import { RiSendPlaneFill } from 'react-icons/ri';
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';


export function SendMessage({ scrollRef }: any) {
    const [message, setMessage] = useState('');
    const inputFile = useRef() as any;
    const inputRef = useRef<any>();
    const [openEmoji, setOpenEmoji] = useState(false);


    /*===== send message function =====*/
    async function sendMessage(e: React.FormEvent) {
        e.preventDefault();

        if (message === '') return;
        await addDoc(messageRef, {
            text: message,
            createdAt: Timestamp.fromDate(new Date()),
            photoURL: auth.currentUser?.photoURL,
            uid: auth.currentUser?.uid,
            // unread: true
        })
        setMessage('');
        setOpenEmoji(false);
        scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    /*===== attach file (image) =====*/
    function attachHandler(e: React.ChangeEvent) {
        let target = e.target as HTMLInputElement;
        let file = (target.files as FileList)[0];
        let fileRef = ref(storage, `${file.name}`);

        const uploadTask = uploadBytesResumable(fileRef, file);
        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        },
            (error) => {
                console.log(error);
            },
            () => {

                getDownloadURL(uploadTask.snapshot.ref)
                    .then((url) => {
                        const msgRef = collection(dataBase, 'messages');
                        addDoc(msgRef, {
                            text: '',
                            createdAt: Timestamp.fromDate(new Date()),
                            photoURL: '',
                            uid: auth.currentUser?.uid,
                            imgURL: url
                        })
                    })
            }
        )
    }

    /*===== open attach file input =====*/
    function openAttachHandler() {
        inputFile.current?.click();
    }


    return (
        <Form onSubmit={sendMessage}>
            <Stack direction='horizontal' gap={1}>

                {/* emoji and attach buttons */}
                <span style={{ cursor: 'pointer' }} onClick={() => setOpenEmoji(true)}>
                    {
                        openEmoji &&
                        <div style={{ position: 'absolute', bottom: '75px', right: '10px' }}>
                            <EmojiPicker
                                onEmojiClick={(emojiObject, e) => {
                                    const cursor = inputRef.current?.selectionStart;
                                    const text = message.slice(0, cursor) + emojiObject.emoji + message.slice(cursor);
                                    setMessage(text);
                                }}
                                emojiStyle={EmojiStyle.FACEBOOK} searchDisabled={true} previewConfig={{ showPreview: false }} width='350px' height='250px'
                            />
                        </div>
                    }
                    <HiOutlineEmojiHappy />
                </span>
                {/* attach file */}
                <input type='file' ref={inputFile} style={{ display: 'none' }} onChange={attachHandler} />
                <span onClick={openAttachHandler} style={{ cursor: 'pointer' }}><IoIosAttach /></span>

                {/* send message field */}
                <Form.Group>
                    <Form.Control
                        value={message}
                        type='text'
                        ref={inputRef}
                        onChange={(e) => setMessage(e.target.value)}
                        onFocus={() => setOpenEmoji(false)}
                    />
                </Form.Group>
                <Button type='submit'
                    className='d-flex justify-content-center align-items-center'
                    style={{ background: 'none', border: 'none', padding: 0, margin: 0 }}
                >
                    <RiSendPlaneFill fontSize='1.7rem' color='#0d6efd'/>
                </Button>

            </Stack>
        </Form>
    )
}
