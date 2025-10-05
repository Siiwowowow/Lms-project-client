import React, { useEffect, useState } from 'react';

import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { AuthContext } from './AuthContext';
import {auth} from '../Firebase/Firebase.init'

const googleUser=new GoogleAuthProvider();
const AuthProvider = ({children}) => {
    const [user,setUser]=useState(null)
    const [loading,setLoading]=useState(true)
    const createUser=(email,password)=>{
        setLoading(true)
            return createUserWithEmailAndPassword(auth,email,password)
    }
    const signInUser=(email,password)=>{
        setLoading(true)
        return signInWithEmailAndPassword(auth,email,password)
    }
    const signInWithGoogle=()=>{
        setLoading(true)
        return signInWithPopup(auth,googleUser)
    }
    const uploadProfile= profileInfo=>{
        return updateProfile(auth.currentUser,profileInfo)
    }
    
    const logOut=()=>{
        setLoading(true)
        return signOut(auth)
    }
    useEffect(()=>{
        const unSubscribe=onAuthStateChanged(auth,currentUser=>{
            setUser(currentUser)
            setLoading(false)
        });
        return()=>{
            (unSubscribe)
        }
    },[])
    const AuthInfo={
        createUser,
        signInUser,
        logOut,
        signInWithGoogle,
        uploadProfile,
        setUser,
        user,
        loading,
    }
    return (
        <AuthContext value={AuthInfo}>
        {children}
        </AuthContext>
    );
};

export default AuthProvider;