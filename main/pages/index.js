import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link';
import Image from "next/image";

import "bootstrap/dist/css/bootstrap.css";
import layout from '../styles/layout.module.css';
import styles from '../styles/Home.module.css';


export default function Home() {
  return (
    <div className="container bg-black ">

      {/* --------------------- title --------------------- */}
      <div className="row mt-3">
        <div className="h1 text-center m-2 text-light">Title Name</div>
        <div className={layout.hrline}></div>
      </div>




      {/* --------------------- main --------------------- */}

      <div className="row mt-5">
        <div className="col text-center">
          <button className='btn btn-block btn-outline-light p-2 w-100'><Link className='h4' href={'/record'}>Start</Link></button>
        </div>
      </div>


      <div className="row mt-5">
        <div className="col text-center">
          <button className='btn btn-block btn-outline-light p-2 w-100'><Link className='h4' href={'/demo'}>Demo</Link></button>
        </div>
      </div>

      {/* --------------------- footer --------------------- */}



    </div>

  );
}
