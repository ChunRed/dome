import React from 'react';
import dynamic from 'next/dynamic';

const Sketch = dynamic(() => import('react-p5').then((mod) => {
    require('p5/lib/addons/p5.sound');
    return mod.default;
}), {
    ssr: false,
});

//DOM item
let record_button;
let decibel;
let frequency;
let color;
let db;
let freq;

//value
let song, analyzer;
let mic, fft;
let record_flag = false;
let rms;
let spectrum = 0;
export let firebase_value = ["","","#44DBC4"];

// 視覺化參數
let angle = 0;
let radius = 60;
let outerRadius = 85;
let innerRadius = 60;
let radiatingAngle = 0;
let colorOffset = 0;  // 用於顏色漸變
let shapeEdges = Array(5).fill(0);
let currentShapeIndex = 0;
let shapeChangeTimer = 0;
let lastDecibels = 0;
let lastCircleCount = 5;
let isPlaying = false;

// 常量
const SHAPE_CHANGE_INTERVAL = 1000;
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

// 顏色處理(還在思考)
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

const rgbToHex = (r, g, b) => {
    const toHex = (n) => {
        const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const interpolateColor = (color1, color2, factor) => {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    const r = rgb1.r + factor * (rgb2.r - rgb1.r);
    const g = rgb1.g + factor * (rgb2.g - rgb1.g);
    const b = rgb1.b + factor * (rgb2.b - rgb1.b);
    
    return rgbToHex(r, g, b);
};

const getGradientColor = (offset) => {
    const numberOfStops = COLOR_STOPS.length - 1;
    const scaledOffset = (offset % 1) * numberOfStops;
    const index = Math.floor(scaledOffset);
    const factor = scaledOffset - index;
    
    return interpolateColor(
        COLOR_STOPS[index],
        COLOR_STOPS[index + 1],
        factor
    );
};

//畫面尺寸 Canvas Size
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

//判斷是否開始錄音，Start Record 按鈕控制
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





// 輔助函數們~~

//決定顏色
const getCurrentColor = (p5, opacity = 1) => {
    const baseColor = getGradientColor(colorOffset);
    return p5.color(baseColor + Math.floor(opacity * 255).toString(16).padStart(2, '0'));
};

//計算多邊形畫法的函式
const drawPolygon = (p5, x, y, radius, edges) => {
    if (edges === 0) {
        p5.ellipse(x, y, radius * 2, radius * 2);
    } else {
        p5.beginShape();
        for (let i = 0; i < edges; i++) {
            let angle = p5.TWO_PI * i / edges - p5.PI/2;
            let px = x + p5.cos(angle) * radius;
            let py = y + p5.sin(angle) * radius;
            p5.vertex(px, py);
        }
        p5.endShape(p5.CLOSE);
    }
};


class Canvas3 extends React.Component {
    render() {
        const setup = (P5, canvasParentRef) => {
            canvasWidth = innerWidth - 50;
            canvasHeight = vh(45);
            P5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
            P5.noFill();
        };


        //MARK:DRAW
        const draw = (P5) => {
            P5.background(0);

/////////////////////////////聲音數據分析區開始///////////////////////////////////////////////////////
            if (record_flag) {
                // 獲取音頻數據
                rms = analyzer.getLevel();  // 這個值範圍是 0-1
                spectrum = fft.analyze();
                
                decibel = document.querySelector('.decibel');
                frequency = document.querySelector('.frequency');
                color = document.querySelector('.color');
            
                //分貝計算改
                if (decibel) {
                    // 計算平均振幅
                    const sumAmplitude = spectrum.reduce((sum, value) => sum + value, 0);
                    const avgAmplitude = sumAmplitude / spectrum.length;
                    
                    // 振幅轉分貝
                    // 使用 255 為參考值，因為 FFT 分析返回 0-255 的值
                    const normalizedAmplitude = avgAmplitude / 255;
                    
                    // 分貝計算0-100
                    const MIN_DB = 0;
                    const MAX_DB = 100;
                    
                    db = P5.map(normalizedAmplitude, 0, 1, MIN_DB, MAX_DB)*5;//乘以5數值比較正常，如果有需要可以微調這個係數
                    db = Math.max(MIN_DB, Math.min(MAX_DB, db));
                    
                    //MARK:decibel.innerHTML
                    decibel.innerHTML = Math.round(db);
                    firebase_value[0] = Math.round(db);
                    
                    // tttttesttttt
                    //console.log("Amplitude:", avgAmplitude, "DB:", db);
                    //console.log(firebase_value[0] + " : " + firebase_value[1] + " : " + firebase_value[2]);
                    
                }
                
                // 頻率計算保持不變
                if (frequency) {
                    let maxIndex = 0;
                    let maxEnergy = 0;
                    for (let i = 0; i < spectrum.length; i++) {
                        if (spectrum[i] > maxEnergy) {
                            maxEnergy = spectrum[i];
                            maxIndex = i;
                        }
                    }
                    freq = Math.round((maxIndex * 44100) / (spectrum.length * 2));

                    //MARK:frequency.innerHTML
                    frequency.innerHTML = freq;
                    firebase_value[1] = freq;
                }
                
                if (color) {
                    //MARK:color.innerHTML
                    color.innerHTML = getGradientColor(colorOffset);
                    firebase_value[2] = getGradientColor(colorOffset);
                    firebase_value[3] = shapeEdges[currentShapeIndex];

                }
/////////////////////////////聲音數據分析區結束///////////////////////////////////////////////////////
                



                P5.push();
                P5.translate(P5.width/2, P5.height/2);
            
            
            
                P5.pop();
            }

            // 視覺化部分
            P5.push();
            P5.translate(canvasWidth/2, canvasHeight/2);

            if (record_flag && P5.millis() - shapeChangeTimer > SHAPE_CHANGE_INTERVAL) {
                shapeEdges[currentShapeIndex] = Math.random() < 0.33 ? 0 : Math.floor(Math.random() * 6) + 3;
                currentShapeIndex = (currentShapeIndex + 1) % 5;
                shapeChangeTimer = P5.millis();
            }

            const mappedRadius = P5.map(db || 0, 0, 100, innerRadius, innerRadius * 3);
            const currentColor = getCurrentColor(P5);
            P5.stroke(currentColor);

            // 放射狀線條
            P5.push();
            P5.strokeWeight(0.5);
            P5.rotate(-radiatingAngle);
            for(let i = 0; i < 36; i++) {
                P5.rotate(P5.TWO_PI/36);
                P5.line(0, 0, radius, 0);
            }
            P5.pop();

            // 中心形狀(放射線)
            P5.push();
            P5.strokeWeight(1);
            P5.rotate(angle);
            for(let i = 0; i < 5; i++) {
                P5.push();
                P5.rotate(P5.TWO_PI * i / 5);
                P5.translate(40, 0);
                if (i === currentShapeIndex && record_flag) {
                    P5.strokeWeight(2);
                }
                // 使用相同的邊數（都用 currentShapeIndex 對應的邊數）(上次林提到的中間多邊形一起更新的部分)
                drawPolygon(P5, 0, 0, 100, shapeEdges[currentShapeIndex]);
                P5.pop();
            }
            P5.pop();

            // 外圈
            P5.strokeWeight(3);
            P5.stroke(255);
            P5.ellipse(0, 0, outerRadius * 2, outerRadius * 2);

            // 動態圓點
            const circleCount = Math.floor(P5.map(freq || 0, 0, 1000, 2, 6));
            //const darkerColor = getCurrentColor(P5, 0.7);  // 70% 透明度
            P5.fill(255);
            for(let i = 0; i < circleCount; i++) {
                const sphereAngle = angle * 3 + (P5.TWO_PI * i / circleCount);
                const x = P5.cos(sphereAngle) * mappedRadius;
                const y = P5.sin(sphereAngle) * mappedRadius;
                
                P5.strokeWeight(1);
                P5.circle(x, y, 10);
            }
            P5.noFill();

            if (record_flag) {
                angle += 0.01;
                radiatingAngle += 0.01;
                colorOffset = (colorOffset + 0.002) % 1;  // 循環顏色
            }



            P5.pop();
        };

        return (
            <div>
                <Sketch setup={setup} draw={draw} />
            </div>
        );
    }
}

export default Canvas3;