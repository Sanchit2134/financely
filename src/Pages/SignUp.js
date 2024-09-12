import React from 'react'
import SignUpSignInComponent from '../components/SignUpSignIn/signUpSignIn';
import Header from '../components/Header/header';
const SignUp = () => {
    return (
        <div>
           <div className='wrapper'>
            <Header/>
            <SignUpSignInComponent/>
           </div>
        </div>
    )
}
export default SignUp;