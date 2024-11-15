import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link';
import Image from "next/image";

import "bootstrap/dist/css/bootstrap.css";
import layout from '../styles/layout.module.css';
import styles from '../styles/Home.module.css';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get, set, push } from "firebase/database";

import FireBase, { writeUserData } from '../src/FireBase.jsx';


let target_value = [0,0,"#ffffff",0];

const COLOR_STOPS = [
    '#FFFFFF',
    '#FF0000', // 紅
    '#FF8000', // 橙
    '#FFFF00', // 黃
    '#00FF00', // 綠
    '#0080FF', // 藍
    '#8000FF', // 紫
    '#FFFFFF',
];

const SHAPE = [0, 3, 4, 5, 6, 7, 8, 9, 10];


function SetFrequency(e) {
    const { value } = document.querySelector(e.target.getAttribute("data-input"));
    target_value[1] = parseInt(value);
    ChangeValue();
}

function Random(){
    target_value[0] = Math.floor(Math.random() * 100);
    target_value[1] = Math.floor(Math.random() * 1000);
    target_value[2] = COLOR_STOPS[Math.floor(Math.random() * 8)];
    target_value[3] = SHAPE[Math.floor(Math.random() * 9)];
    ChangeValue()
}

function ChangeValue(){
    document.querySelector(".decibel").innerHTML = target_value[0];
    document.querySelector(".frequency").innerHTML = target_value[1];
    document.querySelector(".color").innerHTML = target_value[2];
    document.querySelector(".color").innerHTML = target_value[2];
    document.querySelector(".shape").innerHTML = target_value[3];
}

function SEND(){
    writeUserData(target_value[0], target_value[1], target_value[2], target_value[3]);
    Random();
    ChangeValue();
}


export default function Demo() {


    return (
        <div className="container bg-black ">
            <FireBase ></FireBase>
            {/* --------------------- title --------------------- */}
            <div className="row mt-3">
                <div className="h1 text-center m-2 text-light">Test Web</div>
                <div className={layout.hrline}></div>
            </div>


            {/* --------------------- 指定頻率 --------------------- */}

            <div className="row mt-5 text-light justify-content-center h4">指定頻率</div>

            <div className="row mt-1">
                <div className="input-group mt-2 ">
                    <input id='input_value' type="text" className="form-control" placeholder="your message..." aria-label="Write Message In This Barcode" aria-describedby="basic-addon2" />
                    <div className="input-group-append">
                        <button className="btn btn-outline-light" data-input="#input_value" onClick={(e) => SetFrequency(e)} type="button">Save</button>
                    </div>
                </div>
            </div>


            {/* --------------------- 隨機按鈕 --------------------- */}

            <div className="row mt-3">
                <div className="col text-center">
                    <button className='btn btn-block btn-outline-light p-2 w-100 h4' onClick={() => {Random()}}>Random Frequency</button>
                </div>
            </div>


            {/* --------------------- 傳送列表 --------------------- */}

            <div className="row mt-5 h4 text-light justify-content-center"> 傳送資料 </div>

            <div className="row mt-3">
                <div className=" col-xl-3 col-lg-1 "></div>
                <div className=" col-xl-3 col-lg-5 col-md-6 col-sm-6 col-6">
                    <div className="card bg-black">
                        <ul className="list-group list-group-flush ">
                            <li className=" list-group-item bg-black border-secondary text-light" >分貝｜decibel </li>
                            <li className="list-group-item bg-black border-secondary text-light" >頻率｜frequency </li>
                            <li className="list-group-item bg-black border-secondary text-light" >色彩｜color </li>
                            <li className="list-group-item bg-black border-secondary text-light" >形狀｜shape </li>
                        </ul>
                    </div>
                </div>

                <div className="col-xl-3 col-lg-5 col-md-6 col-sm-6 col-6">
                    <div className="card bg-black">
                        <ul className="list-group list-group-flush ">
                            <li className="decibel list-group-item bg-black text-light border-secondary">{target_value[0]}</li>
                            <li className="frequency list-group-item bg-black text-light border-secondary">{target_value[1]}</li>
                            <li className="color list-group-item bg-black text-light border-secondary">{target_value[2]}</li>
                            <li className="shape list-group-item bg-black text-light border-secondary">{target_value[3]}</li>
                        </ul>
                    </div>
                </div>
                <div className="col-xl-3 col-lg-1"></div>
            </div>

            {/* --------------------- 傳送按鈕 --------------------- */}

            <div className="row mt-5">
                <div className="col text-center">
                    <button className='btn btn-block btn-outline-light p-2 w-100 h4' onClick={() => {SEND()}}>Send</button>
                </div>
            </div>





            {/* --------------------- footer --------------------- */}

            <div className="row mt-5">
                <div className="col text-center">
                    <button className='btn btn-block btn-outline-light p-2 w-100'><Link className='text-light' href={'/'}>Back</Link></button>
                </div>
            </div>

        </div>

    );
}
