import { auth, db, provider } from "@/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React from "react";
import CoolButton from "./CoolButton";
import FormField from "./FormField";
import { AiOutlineGoogle } from "react-icons/ai";
import { BsArrowRight } from "react-icons/bs";
import axios from "axios";

function SignupModal() {
  const router = useRouter();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [emailAddressError, setEmailAddressError] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");

  // custom function that validates the email address with regex
  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  // custom function that validates the password with regex:
  // at least 8 characters, at least 1 uppercase, at least 1 lowercase, at least 1 number
  // at least 1 special character
  const validatePassword = (password: string) => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    return re.test(password);
  };

  const resetErrors = () => {
    setEmailAddressError("");
    setPasswordError("");
  }

  const handleEmailSignIn = async () => {
    resetErrors();
    if (emailAddress === "") {
      setEmailAddressError("Please enter an email address.");
    }
    if (password === "") {
      setPasswordError("Please enter a password.");
    }
    if (!validateEmail(emailAddress)) {
      setEmailAddressError("Please enter a valid email address.");
    }
    if (!validatePassword(password)) {
      setPasswordError(
        "Please enter a password that is at least 8 characters long, contains at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."
      );
    } else {
      createUserWithEmailAndPassword(auth, emailAddress, password)
        .then((userCredential) => {
          router.push("/");
        })
        .catch((error) => {
          if (error.code === "auth/email-already-in-use") {
            setEmailAddressError("Email address already in use.");
          } else if (error.code === "auth/invalid-email") {
            setEmailAddressError("Invalid email address.");
          } else if (error.code === "auth/weak-password") {
            setPasswordError("Password is too weak.");
          } else {
            setPasswordError(error.message);
          }
          // ..
        });
    }
  };

  const handleGoogleSignIn = async () => {
    signInWithPopup(auth, provider).then(async (res) => {
      const profileId = res.user?.uid;
      const docRef = doc(db, "users", profileId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        // handle existing user
        // ...
      } else {
        // handle new user
        // ...
      }
      router.push("/");
    });
  };
  
  const goToSignIn = () => {
    router.push("/login");
  };

  return (
    <div className="absolute w-screen h-screen flex flex-col items-center text-black justify-center bg-transparent">
      <div className="font-monumentExtended text-3xl mb-4">Soheil Labs</div>
      <div className="w-[30vw] h-auto overflow-hidden border bg-white border-black rounded-xl p-10">
        <div className="font-monumentExtended text-xl mb-4">Signup</div>
        <div className="font-spaceMono">
          <div className="flex flex-col gap-1">
            <FormField
              label={"Email Address"}
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder={"Email Address..."}
              error={emailAddressError}
            />
            <FormField
              label={"Password"}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={"Password..."}
              type={"password"}
              error={passwordError}
            />
            <CoolButton
              type={"yellow"}
              onClick={handleEmailSignIn}
              icon={<BsArrowRight size={15} />}
            />
          </div>

          <div className="flex items-center gap-4 mt-10 mb-3 opacity-50">
            <div className="font-spaceMono text-black">OR</div>
            <div className="h-[1px] w-[50%] bg-black" />
          </div>
          <CoolButton
            type={"white-on-black"}
            text={"Sign Up with Google"}
            onClick={handleGoogleSignIn}
            icon={<AiOutlineGoogle size={15} color={"black"} />}
          />
        </div>
        <div className="border-t border-black w-[100vw] ml-[-50vw] mt-10" />
        <div className="justify-center items-center flex mt-5  text-sm font-spaceMono">
          Have an account?{" "}
          <CoolButton type={"link"} text={"Sign In"} onClick={goToSignIn} />
        </div>
      </div>
    </div>
  );
}

export default SignupModal;
