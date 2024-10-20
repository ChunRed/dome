import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link';
import Image from "next/image";

import "bootstrap/dist/css/bootstrap.css";
import layout from '../styles/layout.module.css';
import styles from '../styles/Home.module.css';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get, set, push } from "firebase/database";


export default function Record() {

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

    //read firebase data/////////////////////////////////////////////////////////
    let firebase_data = '';
    let firebase_data_length = 0;
    let typed;

    function readOnceWithGet() {
        const dbRef = ref(getDatabase());
        //if (value != undefined) {
            get(child(dbRef, '/test')).then((snapshot) => {
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
        //}
    }

    useEffect(readOnceWithGet, []);
    //read data 
    /////////////firebase/////////////////////////////////////////////////////


    //send data to firebase/////////////////////////////////////////////////////
    function set_firebase_data(e) {
        const { value } = document.querySelector(e.target.getAttribute("data-input"));
        firebase_data = '';
        writeUserData(value);
        // typed.destroy();
        readOnceWithGet();
    }
    function writeUserData(value) {
        const db = getDatabase();

        set(ref(db, '/test/' + (firebase_data_length)), value);
        console.log("send message:"+ value+ " done");
    }
    //send data to firebase/////////////////////////////////////////////////////


    return (
        <div className="container bg-black ">

            {/* --------------------- title --------------------- */}
            <div className="row mt-3">
                <div className="h1 text-center m-2 text-light">Title Name</div>
                <div className={layout.hrline}></div>
            </div>



            {/* --------------------- main --------------------- */}

            <div className="row mt-5">
                <div className="input-group mt-2 ">
                    <input id='input_value' type="text" className="form-control" placeholder="your message..." aria-label="Write Message In This Barcode" aria-describedby="basic-addon2" />
                    <div className="input-group-append">
                        <button className="btn btn-outline-light" data-input="#input_value" onClick={(e) => set_firebase_data(e)} type="button">Save</button>
                    </div>
                </div>
            </div>



            {/* --------------------- footer --------------------- */}

            <div className="row mt-5">
                <div className="col text-center">
                    <button className='btn btn-block btn-outline-light p-2 w-100'><Link className='h4' href={'/'}>Back</Link></button>
                </div>
            </div>



            <style jsx>{`
                .Canvas{
                    height: 25vh;
                }
                    
            `}</style>

        </div>

    );
}
