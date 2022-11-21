// Essentials
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

// Firebase
import { doc, setDoc, getDoc, deleteDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from "../firebase/Config";
import {
    createUserWithEmailAndPassword,
    updateProfile,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    deleteUser,
    setPersistence,
    browserLocalPersistence,
    inMemoryPersistence
} from "firebase/auth";

// Hooks
import useFetch from "../hooks/useFetch";
import useCookieConsent from "../hooks/useCookieConsent/useCookieConsent";


// Jotai
import { atomWithStorage, RESET } from "jotai/utils";
import { useAtom } from "jotai";

// GLOBAL STATES
import { addressBook_guest_atom } from "../components/panels/auth/Panel_ManageAddresses/Panel_ManageAddresses";

export const isAuth_atom = atomWithStorage("isAuth", false);


// Context Reach
const AuthContext = createContext({});

// Navigation
const navHome = "/";
const navProfile = "/profile";
const navSignUp = "/register";
const navSignIn = "/login";

export const useAuthContext = () => useContext(AuthContext);

// Provider
export const AuthProvider = ({children}) => {

    // Redirect
    let navigate = useNavigate();

    // States
    const [currentUser, setCurrentUser] = useState(null);
    const [currentUserData, setCurrentUserData] = useState(null);

    const [signInError, setSignInError] = useState("");
    const [signUpError, setSignUpError] = useState("");

    const [loading, setLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(true);

    const [authEditResponse, setAuthEditResponse] = useState(0); // 0: neutral, 1: succes, 2: error.
    const [authEditLoading, setAuthEditLoading] = useState(true);

    const [isAuth, setIsAuth] = useAtom(isAuth_atom);
    const [addressBook_guest, setAddressBook_guest] = useAtom(addressBook_guest_atom);

    // Fetch User Data
    const fetchUserData = (userId) => {
        if(userId !== null){
            const docRef = doc(db, "users", userId);
            onSnapshot(docRef, (doc) => {
                const data = doc.data();
                if(data){
                    setLoading(true);
                    if(data) {
                        if(data.length !== 0){
                            setCurrentUserData(data);
                            setIsAuth(true);
                            setLoading(false);
                        }else{
                            setCurrentUserData(null);
                            setIsAuth(RESET);
                            setLoading(false);
                        }
                    }
                }else{
                    setCurrentUserData(null);
                    setIsAuth(RESET);
                    setLoading(false);
                }
            })
        }else{
            setCurrentUserData(null);
        }
    }


    // User Roles
    const { fetch, data: roles } = useFetch();
    const [ passRoles, setPassRoles ] = useState([]);
    const [ userRoleAccess, setUserRoleAccess ] = useState([]);

    useEffect(() => {
        currentUserData && fetch("roles", undefined, undefined, undefined, undefined, true);
    }, [currentUserData]);

    useEffect(() => {
        if(roles && currentUserData) {
            let allRoles = [];

            roles.map((role) => {
            allRoles = [...allRoles, role.id];
            })

            setPassRoles(allRoles);

            const access = roles.filter(role => role.roleName === currentUserData.role)[0];
            setUserRoleAccess(access);
        }
    }, [roles, currentUserData]);


    // Check User Permission
    const checkUserPermission = async (category, permission) => {
        // Check User
        const checkUser = await getDoc(doc(db, "users", currentUserData.userId))
        const user = checkUser.data();
        if(user) {
            if(user.length !== 0){ 
                // Check Role
                const checkRole = await getDoc(doc(db, "roles", user.role)) 
                const role = checkRole.data();
                if(role) {
                    if(role.length !== 0){
                        if (role[category]) {
                            const userRole = role[category];
                            if (userRole === "all" || userRole.includes(permission)) {
                                return true;
                            } else return false; 
                        } else return false; 
                    } else return false; 
                } else return false; 
            } else return false; 
        } else return false;
    }


    // Sign Up
    const signUp = (email, password, firstName, lastName, country, civility, subscriptionAgreement) => {
        setLoading(true);
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                setDoc(doc(db, "users", auth.currentUser.uid),{
                    userId: auth.currentUser.uid,
                    role: "user",
                    email,
                    fullName: firstName+" "+lastName,
                    firstName,
                    lastName,
                    country,
                    civility,
                    addressBook: [
                        {
                            country,
                            type: "HOME",
                            defaultAddress: true,
                        }
                    ],
                    subscriptionAgreement
                });

                updateProfile(auth.currentUser, {
                    displayName : firstName+" "+lastName
                });
                setLoading(false);
                navigate(navHome);

                setAddressBook_guest(RESET);
            })
            .catch(err => setSignUpError(err.message))
            .finally(() => {
                setLoading(false)
            });
    }


    // Sign In
    const signIn = (email, password, rememberMe = false) => {
        setLoading(true);
        if (rememberMe) {
            setPersistence(auth, browserLocalPersistence)
            .then(() => {
                return signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    setLoading(false);
                    navigate(navHome);

                    setAddressBook_guest(RESET);
                })
                .catch(err => setSignInError(err.message))
                .finally(() => {
                    setLoading(false);
                });
            });
        } else {
            setPersistence(auth, inMemoryPersistence)
            .then(() => {
                return signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    setLoading(false);
                    navigate(navHome);

                    setAddressBook_guest(RESET);
                })
                .catch(err => setSignInError(err.message))
                .finally(() => {
                    setLoading(false);
                });
            });
        }
    }


    // Log Out
    const logOut = () => {
        setAuthLoading(true);
        signOut(auth)
        .then(() => {
            setAuthLoading(false);
            navigate(navSignIn);
        });
    }

    // Update Auth
    const updateAuth = (updateList) => {

        setAuthLoading(true);
        if(updateList.fullName) {
            updateProfile(auth.currentUser, {
                displayName : updateList.fullName
            })
        }
        updateDoc(doc(db, "users", auth.currentUser.uid), updateList)
        .then(() => {
            setAuthLoading(false);
        })
        .catch(err => setSignUpError(err.message))
        .finally(() => {
            setAuthLoading(false)
        });
    }

    // Send Password Reset Email
    const passwordReset = () => {
        setAuthEditLoading(true);
        sendPasswordResetEmail(auth, currentUserData.email)
        .then(() => {
            setAuthEditResponse(1);
            setAuthEditLoading(false);
        })
        .catch(() => {
            setAuthEditResponse(2);
            setAuthEditLoading(false);
        });
    }

    // Forgot Password
    const forgotPassword = (email) => {
        setAuthEditLoading(true);
        sendPasswordResetEmail(auth, email)
        .then(() => {
            setAuthEditResponse(1);
            setAuthEditLoading(false);
        })
        .catch(() => {
            setAuthEditResponse(2);
            setAuthEditLoading(false);
        });
    }


    // Delete Account
    const deleteAccount = () => {
        const user = auth;
        
        setAuthLoading(true);
        setLoading(true);
        deleteDoc(doc(db, "users", user.currentUser.uid))
            .then(() => {
                signOut(user);
                deleteUser(user.currentUser)
                .then(() => {
                    setCurrentUser(null)
                    setAuthLoading(false);
                    setLoading(false);
                    navigate(navSignUp);
                })
                .catch((err) => {
                    console.log(err);
                })
            });
    }


    useEffect(() => {
        setLoading(true);
        setAuthLoading(true);
        setAuthEditResponse(0);
        const unsub = onAuthStateChanged(auth, res => {
            if (res) {
                setCurrentUser(res);
                fetchUserData(res.uid);
                window.scroll(0,0);
            }
            else {
                setCurrentUser(null);
                fetchUserData(null);
                setIsAuth(RESET);
                window.scroll(0,0);
            }
            setSignInError("");
            setSignUpError("");
            setLoading(false)
            setAuthLoading(false);
            setAuthEditLoading(false);
        });

        return unsub;
    }, [])


    const value = {
        /* States: User */
        currentUser,
        currentUserData,
        loading,
        authLoading,
        authEditResponse,
        authEditLoading,

        /* States: Roles */
        userRoleAccess,
        passRoles,

        /* States: Errors */
        signInError,
        signUpError,

        /* Funcs: User */
        signIn,
        signUp,
        logOut,
        updateAuth,
        passwordReset,
        forgotPassword,
        deleteAccount,

        /* Funcs: Roles */
        checkUserPermission,

        /* Funcs: Signals */
        setAuthEditResponse
    }


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}