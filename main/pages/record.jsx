import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link';
import Image from "next/image";

import "bootstrap/dist/css/bootstrap.css";
import layout from '../styles/layout.module.css';
import styles from '../styles/Home.module.css';

import Canvas from '../src/Canvas.jsx'


export default function Record() {
    return (
        <div className="container bg-black ">

            {/* --------------------- title --------------------- */}
            <div className="row mt-3">
                <div className="h1 text-center m-2 text-light">Title Name</div>
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







            <div className="row mt-5">
                <div className="h1 text-center m-2 text-light">Data</div>
            </div>
            <div className="row">
                <div className="col bg-dark text-center Canvas">  </div>
            </div>



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
