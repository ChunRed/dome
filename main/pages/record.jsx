import React, { useState, useEffect, useRef } from 'react'
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

import Link from 'next/link';
import Image from "next/image";

import "bootstrap/dist/css/bootstrap.css";
import layout from '../styles/layout.module.css';
import styles from '../styles/Home.module.css';

import Canvas from '../src/Canvas.jsx'


export default function Record() {

    const [show, setShow] = useState(false);
    let count = 0;
    let record_time = 3;

    function Timer(){
        let timer = setInterval(() => {
            if(record_time > count) count +=1;
            else{
                setShow(true);
                clearInterval(timer);
            }
            console.log(count);
        }, 1000)
    }

    function SendMSG(){
        setShow(false);
        Timer();
    }


    useEffect(Timer, []);

    return (
        <div className="container bg-black ">

            {/* --------------------- title --------------------- */}
            <div className="row mt-3">
                <div className="h1 text-center m-2 text-light">Overloaded</div>
                <div className={layout.hrline}></div>
            </div>




            {/* --------------------- main --------------------- */}

            <div className="row mt-5">
                <div className="h1 text-center m-2 text-light">Recording...</div>
            </div>

            <div className="row">
                <div id="dev1" className="col bg-black text-center Canvas">
                    <Canvas>

                    </Canvas>
                </div>
            </div>



            <Alert show={show} variant="dark" className='mt-3'>
                <Alert.Heading className='text-success'>收音成功</Alert.Heading>
                <p className='text-success'>
                    傳送資料至Dome<br />Received successfully, data sent to Dome.
                </p>
                <hr />
                <div className="d-flex justify-content-end ">
                    <Button onClick={() => SendMSG()} variant="outline-success w-100">
                        傳送｜Send Message
                    </Button>
                </div>
            </Alert>



            {!show &&
                <div>
                    <div className="row">
                        <div className="col-6">
                            <div className="card bg-black">
                                <ul className="list-group list-group-flush ">
                                    <li className="list-group-item bg-black text-light">分貝｜decibel </li>
                                    <li className="list-group-item bg-black text-light">頻率｜frequency </li>
                                    <li className="list-group-item bg-black text-light">色彩｜color </li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-6">
                            <div className="card bg-black">
                                <ul className="list-group list-group-flush ">
                                    <li className="list-group-item bg-black text-light">0000</li>
                                    <li className="list-group-item bg-black text-light">0000</li>
                                    <li className="list-group-item bg-black text-light">#000000</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            }



            {/* --------------------- footer --------------------- */}

            <div className="row mt-5">
                <div className="col text-center">
                    <button className='btn btn-block btn-outline-light p-2 w-100'><Link className='h4' href={'/'}>Back</Link></button>
                </div>
            </div>




            <style jsx>{`
                .Canvas{
                    height: 45vh;
                }
                    
            `}</style>

        </div>

    );
}
