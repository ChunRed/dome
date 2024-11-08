import React, { useState, useEffect, useRef } from 'react'
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

import Link from 'next/link';
import Image from "next/image";

import "bootstrap/dist/css/bootstrap.css";
import layout from '../styles/layout.module.css';
import styles from '../styles/Home.module.css';

import Canvas3, { RecordFlag, firebase_value } from '../src/Canvas3.jsx';


// import FireBase from '../src/FireBase.jsx';

import useRWD from '../src/useRWD';
import FireBase, { writeUserData } from '../src/FireBase.jsx';


export default function Record() {

    const [show, setShow] = useState(false);
    let count = 0;
    let record_time = 5;

    function Timer() {
        let timer = setInterval(() => {
            if (record_time > count) count += 1;
            else {
                setShow(true);
                RecordFlag();
                clearInterval(timer);
            }
            console.log(count);
        }, 1000)
    }


    function SendMSG() {
        setShow(false);
        writeUserData(firebase_value[0], firebase_value[1], firebase_value[2]);
    }


    // useEffect(Timer, []);

    return (
        <div className="container-fluid bg-black ">

            {/* --------------------- title --------------------- */}
            <div className="row mt-3">
                <div className="h1 text-center m-2 text-light">Overloaded</div>
                <div className={layout.hrline}></div>
            </div>




            {/* --------------------- main --------------------- */}

            <div className="row">
                <div id="dev1" className="col bg-black text-center Canvas">
                    {/* <Canvas></Canvas> */}
                    {/* <Canvas2></Canvas2> */}
                    <Canvas3></Canvas3>
                    {/* <FireBase></FireBase> */}
                    <FireBase ></FireBase>
                </div>
            </div>

            <div className="row justify-content-center">
                <Alert show={show} variant={layout.gray} className='col-xl-5 col-lg-5 col-md-6 col-sm-12 col-12 mt-3'>
                    <Alert.Heading className='text-success'>收音成功</Alert.Heading>
                    <p className='text-success'>
                        傳送資料至Dome<br />Received successfully, data sent to Dome.
                    </p>

                    <div className='text-success'>
                        send message: {firebase_value[0]} : {firebase_value[1]} : {firebase_value[2]}
                    </div>

                    <hr />
                    <div className="d-flex justify-content-end ">
                        <Button onClick={() => SendMSG()} variant=" bg-success w-100">
                            <h3>傳送｜Send Message</h3>
                        </Button>
                    </div>
                </Alert>
            </div>




            {!show &&
                <div>
                    <div className="row mt-5">
                        <div className=" col-xl-3 col-lg-1 "></div>
                        <div className=" col-xl-3 col-lg-5 col-md-6 col-sm-6 col-6">
                            <div className="card bg-black">
                                <ul className="list-group list-group-flush ">
                                    <li className=" list-group-item bg-black text-success border-secondary">分貝｜decibel </li>
                                    <li className="list-group-item bg-black text-success border-secondary">頻率｜frequency </li>
                                    <li className="list-group-item bg-black text-success border-secondary">色彩｜color </li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-xl-3 col-lg-5 col-md-6 col-sm-6 col-6">
                            <div className="card bg-black">
                                <ul className="list-group list-group-flush ">
                                    <li className="decibel list-group-item bg-black text-light border-secondary">0000</li>
                                    <li className="frequency list-group-item bg-black text-light border-secondary">0000</li>
                                    <li className="color list-group-item bg-black text-light border-secondary">#000000</li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-1"></div>
                    </div>

                    <div className="row mt-5 justify-content-center ">
                        <div className="col-xl-6 col-lg-10 col-md-12 col-sm-12 text-center">
                            <button onClick={() => { RecordFlag(); Timer(); }} className='BTN btn btn-block p-2 w-100 bg-success'>開始錄製｜Start Recording</button>
                        </div>
                    </div>


                    <div className="row mt-5 justify-content-center">
                        <div className="col-xl-6 col-lg-10 col-md-12 col-sm-12 text-center">
                            <button className='btn btn-block btn-outline-secondary p-2 w-100'><Link className='text-light' href={'/'}>返回｜Back</Link></button>
                        </div>
                    </div>

                </div>


            }

            <div className="row mt-5  w-100" style={{height:"100px"}}></div>






            <style jsx>{`
                .Canvas{
                    height: 45vh;
                }
                    
            `}</style>

        </div>

    );
}
