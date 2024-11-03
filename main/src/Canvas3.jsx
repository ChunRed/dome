import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
const Sketch = dynamic(() => import('react-p5').then((mod) => {
    require('p5/lib/addons/p5.sound');
    return mod.default
}), {
    ssr: false,
})

//DOM item
let record_button;
let decibel;
let frequency;
let color;


//value
let song, analyzer;
let r, g, b;
let mic, fft;
let record_flag = false;
let rms;
let spectrum=0;


//畫面尺寸Canvas Size ----------------------------------------------------
let canvasWidth = 0;
let canvasHeight = 0;
function vh(percent) {
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (percent * h) / 100;
}
function vw(percent) {
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    return (percent * w) / 100;
}
//畫面尺寸Canvas Size ----------------------------------------------------


//判斷是否開始錄音，Start Record 按鈕控制------------------------------------
export function RecordFlag() {
    record_flag = !record_flag;
    console.log("Start to record");

    analyzer = new p5.Amplitude();
    analyzer.setInput(song);
    mic = new p5.AudioIn();
    mic.start();
    fft = new p5.FFT();
    fft.setInput(mic);
}
//判斷是否開始錄音，Start Record 按鈕控制------------------------------------



class Canvas3 extends React.Component {

    render() {

        ////////////////////////////////////////////////////////////////////////
        /////////////////////////                ///////////////////////////////
        ///////////////////////// setup function ///////////////////////////////
        ////////////////////////                 ///////////////////////////////
        ////////////////////////////////////////////////////////////////////////
        const setup = (P5, canvasParentRef) => {

            // 畫布尺寸設定
            canvasWidth = innerWidth - 50;
            canvasHeight = vh(45);
            P5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);

            // DOM 宣告
            decibel = document.querySelector('.decibel');
            frequency = document.querySelector('.frequency');
            color = document.querySelector('.color');
        };
        ////////////////////////////////////////////////////////////////////////
        /////////////////////////                ///////////////////////////////
        ///////////////////////// setup function ///////////////////////////////
        ////////////////////////                 ///////////////////////////////
        ////////////////////////////////////////////////////////////////////////





        ////////////////////////////////////////////////////////////////////////
        /////////////////////////                ///////////////////////////////
        ///////////////////////// draw function  ///////////////////////////////
        ////////////////////////                 ///////////////////////////////
        ////////////////////////////////////////////////////////////////////////
        const draw = (P5) => {

            P5.background(30);

            if (record_flag) {
                rms = analyzer.getLevel();
                spectrum = fft.analyze();

                //顯示分貝、頻率、顏色數值在UI上
                //分別更改一下三行的value
                decibel.innerHTML = spectrum[0]; //分貝
                frequency.innerHTML = spectrum[1]; //頻率
                color.innerHTML = spectrum[2]; //顏色
            }

            //以下七行可刪，測試用影像
            P5.fill(r, g, b, 127);
            P5.stroke(0);
            P5.beginShape();
            for (let i = 0; i < spectrum.length; i++) {
                P5.vertex(i, P5.map(spectrum[i], 0, 255, 300, 0));
            }
            P5.endShape();
            //以上七行可刪，測試用影像
        };
        ////////////////////////////////////////////////////////////////////////
        /////////////////////////                ///////////////////////////////
        ///////////////////////// draw function  ///////////////////////////////
        ////////////////////////                 ///////////////////////////////
        ////////////////////////////////////////////////////////////////////////











        //勿動～～
        return (
            <div>
                <Sketch setup={setup} draw={draw} />;
            </div>
        );
        //勿動～～
    }
}


export default Canvas3;
