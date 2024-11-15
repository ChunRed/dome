import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link';
import Image from "next/image";

import "bootstrap/dist/css/bootstrap.css";
import layout from '../styles/layout.module.css';
import styles from '../styles/Home.module.css';


export default function Home() {
  return (
    <div className="container-fluid bg-black">




      {/* --------------------- main --------------------- */}

      <header>
        <video className='fullscreen-video' src={require('../media/01.mp4')} autoPlay muted loop playsInline />
        <div className="header-content">
          <div className="header-content-inner">

            <div className="row w-100 test justify-content-center">
              <div className="col-xl-6 col-lg-10 col-md-12 col-sm-12 col-12 text-center h1" style={{ color: "#3BC5AC" }}>
                Overloaded
              </div>
            </div>


            <div className="row w-100 test mt-5 justify-content-center">
              <div className="col-xl-6 col-lg-10 col-md-12 col-sm-12 col-12 text-center ">
                <button className='btn btn-block btn-outline-light w-50' style={{ backgroundColor: "#3BC5AC" }}><Link className='h3' href={'/record'}>Start</Link></button>
              </div>
            </div>




          </div>

        </div>
      </header>



      {/* --------------------- footer --------------------- */}

      <div className="row justify-content-center">
        <div className="col-xl-6 col-lg-10 col-md-12 col-sm-12 col-12 text-center text-light opacity-50 m-5">2023.5 LAB</div>
      </div>

      <div className="row mt-2 justify-content-center">
        <div className="col-xl-6 col-lg-10 col-md-12 col-sm-12 col-12 text-center ">
          <button className='btn btn-block btn-outline-light w-50' style={{ backgroundColor: "#3BC5AC" }}><Link className='h3' href={'/demo'}>test</Link></button>
        </div>
      </div>


      <div className="row m-5 justify-content-center">
        
      </div>



    </div>

  );
}
