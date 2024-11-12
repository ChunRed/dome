import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get, set, push } from "firebase/database";

let firebase_data = '';
let firebase_data_length = 0;
let typed;






//MARK:FIREBASE INIT
const firebaseConfig = {
    apiKey: "AIzaSyBEkaUuAs0sl-NMhIK45qZWV0H5RnPj3gQ",
    authDomain: "dome-test-714cb.firebaseapp.com",
    databaseURL: "https://dome-test-714cb-default-rtdb.firebaseio.com",
    projectId: "dome-test-714cb",
    storageBucket: "dome-test-714cb.appspot.com",
    messagingSenderId: "66308364634",
    appId: "1:66308364634:web:362e03d5d2cc8eea017b63",
    measurementId: "G-GG07CCQ2YH"
};
const app = initializeApp(firebaseConfig);










//MARK:READ DATA
function readOnceWithGet() {
    const dbRef = ref(getDatabase());

    get(child(dbRef, '/data')).then((snapshot) => {
        if (snapshot.exists()) {

            let data = snapshot.val();
            firebase_data_length = data.length;
            console.log(data);
            console.log(firebase_data_length);

        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}










//MARK:WRITE DATA
export function writeUserData(decibel, frequency, color, shape) {
    const db = getDatabase();

    set(ref(db, '/data/' + (firebase_data_length)), [decibel, frequency, color, shape]);
    console.log("send message: " + decibel.toString() + " : " + frequency.toString() + " : " + color + " : " + shape + " done");
}













//MARK:MAIN FUNCTION
export default function FireBase(props) {

    useEffect(() => {
        const id = setInterval(() => {
            const dbRef = ref(getDatabase());

            get(child(dbRef, '/data')).then((snapshot) => {
                if (snapshot.exists()) {
                    let data = snapshot.val();
                    firebase_data_length = data.length;
                    console.log("firebase length: " + firebase_data_length);
                    
                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });

        }, 1000);
        return () => clearInterval(id);
    }, [firebase_data_length]);



    return (
        <div></div>
    );
}
