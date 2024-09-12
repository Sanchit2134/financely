import React, { useState } from "react";
import "./style.css";
import Input from "../Input/input";
import Button from "../Button/button";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, provider } from "../../firebase";
import { addDoc, doc, getDoc, setDoc } from "firebase/firestore"; 
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider } from "firebase/auth";
import { collection} from "firebase/firestore";
  
const SignUpSignInComponent = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState(false);
  const navigate = useNavigate();

  //Authenticate the user create a new account using email and password

  //sign up using email and password
  const signupWithEmail = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Name",name);
    console.log("email",email);
    console.log("password",password);
    console.log("confirmPassword",confirmPassword);
    if (name !== "" && email !== "" && password !== "" && confirmPassword !== "") 
      {
      if (password === confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            console.log("User>>>",user);
            toast.success("User Created Successfully");

            setLoading(false);
            setEmail("");
            setPassword("");
            setName("");
            setConfirmPassword("");
            navigate("/dashboard");
            createDoc(user);
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
            // ..
          });
      } else {
        toast.error("Passwords do not match");
      }
    } else {
      toast.error("Please fill all the fields");
      setLoading(false);
    }
  };
  //Login using email and password
  const loginUsingEmail = () => {
    console.log("email", email);
    console.log("password", password);

    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Logged in
          const user = userCredential.user;
          toast.success("User Logged In Successfully");
          console.log("User Logged In !", user);
          navigate("/dashboard");
          
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
        });
    } else {
      toast.error("All fields are mandatory");
    }
  };

  //Create a doc in the firestore
  const createDoc = async (user) => {
    console.log("User", user);
    setLoading(true);
    // Make  sure that the doc with the uid doesn't exist
    // Create a doc
    if (!user) return;

    const userRef = doc(db, "user", user.uid);
    const userData = await getDoc(userRef);
    console.log("User Data", userData);
    if(!userData.exists()){
      try {
        // await addDoc(doc(db, "user", user.uid), {
        //   name: user.displayName ? user.displayName : name,
        //   email: user.email,
        //   photoURL: user.photoURL ? user.photoURL : "",
        //   createdAt: new Date(),
        // });
        await addDoc(collection(db, "user"), {
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: new Date(),
          uid: user.uid,
        });
        
        toast.success("Doc Created Successfully");
        setLoading(false);
      } catch (e) {
        toast.error(e.message);
      }
    }else{
      toast.error("Doc Already Exists");
      setLoading(false);
    }
  };

  const googleAuth = () => {
    // Google Auth
    setLoading(true);
    try{
        signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
            console.log(user);
            createDoc(user);
            setLoading(false);
            navigate("/dashboard");
            toast.success("User Authenticated Successfully");
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        })
        .catch((error) => {
          setLoading(false);
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
          // ...
        });
    }
    catch(e){
      toast.error(e.message);
    }
  };

  return (
    <>
      {loginForm ? (
        <div className="signup-wrapper">
          <h2 className="title">
            Log in <span style={{ color: "var(--theme)" }}>financely</span>
          </h2>
          <form>
            <Input
              label="Email"
              type={"email"}
              state={email}
              setState={setEmail}
              placeholder="jorogan@gmail.com"
              id = "email"
              name = "email"
            />
            <Input
              type="password"
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"Example@123"}
              id = "password"
              name = "password"
            />

            <Button
              disabled={loading}
              text={loading ? "Loading..." : "Login Using Email and Password"}
              onClick={loginUsingEmail}
            />
            <p style={{ textAlign: "center" }}>or</p>
            <Button
            onClick={googleAuth}
              text={loading ? "Loading..." : "Login Using Google"}
              blue={true}
            />
            <p
              className="p-login"
              style={{ cursor: "pointer" }}
              onClick={() => setLoginForm(!loginForm)}
            >
              Or Don't Have An Account? Click Here
            </p>
          </form>
        </div>
      ) : (
        <div className="signup-wrapper">
          <h2 className="title">
            Sign Up on <span style={{ color: "var(--theme)" }}>financely</span>
          </h2>
          <form>
            <Input
              label={"full name"}
              state={name}
              setState={setName}
              placeholder="jorogan"
              id = "full name"
              name = "full name"
            />
            <Input
              label="Email"
              type={"email"}
              state={email}
              setState={setEmail}
              placeholder="jorogan@gmail.com"
              id = "email"
              name = "email"
            />
            <Input
              type="password"
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"Example@123"}
              id = "password"
              name = "password"
            />
            <Input
              type="password"
              label={"confirm password"}
              state={confirmPassword}
              setState={setConfirmPassword}
              placeholder={"Example@123"}
              id = "confirmPassword"
              name = "confirmPassword"
            />
            <Button
              disabled={loading}
              text={loading ? "Loading..." : "Sign Up Using Email and Password"}
              onClick={signupWithEmail}
            />
            <p style={{ textAlign: "center" }}>or</p>
            <Button
                onClick={googleAuth}
                text={loading ? "Loading..." : "Sign Up Using Google"}
                blue={true}
            />
            <p
              className="p-login"
              style={{ cursor: "pointer" }}
              onClick={() => setLoginForm(!loginForm)}
            >
              Or Have an Account Already? Click Here
            </p>
          </form>
        </div>
      )}
    </>
  );
};
export default SignUpSignInComponent;
