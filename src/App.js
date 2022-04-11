import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import app from './firebase.init';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';

const auth = getAuth(app);

function App() {
  const [validated, setValidated] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState({});


  // get name field value
  const handleNameBlur = event => {
    setName(event.target.value);
  }
  // get email field value
  const handleEmailBlur = event => {
    setEmail(event.target.value);
  }

  // get password value
  const handlePasswordBlur = event => {
    setPassword(event.target.value);
  }

  // check register? or login?
  const handleRegisteredChange = event =>{
    setRegistered(event.target.checked)
  }

  // register user
  const handleFormSubmit = event => {
    // prevent browser reloading on submit form
    event.preventDefault();

    // check form email and password validity
    const form = event.currentTarget;
    // if (form.checkValidity() === false) {
    //   event.stopPropagation();
    //   console.log('checked')
    //   return;
    // }

    // check password should contain at least 1 special character
    if (!/(?=.*?[#?!@$%^&*-])/.test(password)) {
      setError('Password Should contain at least one special character');
      return;
    }

    setValidated(true);
    setError('');

    // check if user is already registered
    if(!registered){
      if(form.checkValidity() === true){
        // create user in firebase auth with email and password
        createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
          const user = userCredential.user;
          console.log(user);
          setEmail('');
          setPassword('');
          verifyEmail();
          setUserName();
        })
        .catch(error => {
          console.error(error);
          setError(error.message);
        })
      }
        
    }
    else{
        signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
          const user = userCredential.user;
          console.log(user);
        })
        .catch(error => {
          console.log(error);
          setError(error.message)
        })
    }
  }

  // set use name
  const setUserName = () => {
    updateProfile(auth.currentUser, {
      displayName: name
    })
    .then(() => {
      console.log('Updating name');
    })
    .catch(error => {
      setError(error.message);
    })
  }

  // verify email
  const verifyEmail = () =>{
    sendEmailVerification(auth.currentUser)
    .then(() =>{
      console.log('Email Verification Sent');
    })
  }

  // reset password
  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email)
    .then(() => {
      console.log('Email Send');
    })
  }

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      setUser(user)
    })
  },[])

  // sign out
  const handleSignOut = () => {
    signOut(auth)
    .then(() => {
      console.log('signed out');
    })
    .catch(error => {
      console.log(error);
    })
  }

  return (
    <div className="registration w-50 mx-auto mt-5">
      <h2 className='text-primary text-center'>{registered ? 'Login' : 'Registration'}</h2>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>

      {/* name field */}
      { !registered && <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Your name</Form.Label>
            <Form.Control onBlur={handleNameBlur} type="text" placeholder="Enter your name" required />
            <Form.Control.Feedback type="invalid">
              Please provide your name.
            </Form.Control.Feedback>
          </Form.Group>}

        {/* email field */}
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control onBlur={handleEmailBlur} type="email" placeholder="Enter email" required/>
          <Form.Control.Feedback type="invalid">
            Please provide a valid email.
          </Form.Control.Feedback>
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        {/* password field */}
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control onBlur={handlePasswordBlur} type="password" placeholder="Password" required/>
          <Form.Control.Feedback type="invalid">
            Please provide a valid password.
          </Form.Control.Feedback>
          <p className="text-danger">{error}</p>
        </Form.Group>

        {/* checkbox */}
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check onChange={handleRegisteredChange} type="checkbox" label="Already Registered?" />
        </Form.Group>

        {/* reset password */}
        <Button onClick={handlePasswordReset} variant="link">Forget Password?</Button> <br />

        {/* submit button */}
        <Button variant="primary" type="submit">
          {registered ? 'Login' : 'Register'}
        </Button>
      </Form>

      <h2>Name: {user?.displayName}</h2>
      <h3>Email: {user?.email}</h3>
      {user ?
        <button onClick={handleSignOut} className='btn btn-primary'>Sign out</button>
        : 'No user Logged in'
      }
    </div>
  );
}

export default App;
