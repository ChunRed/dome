import React from 'react';
//import P5.JS
import dynamic from 'next/dynamic'
const Sketch = dynamic(() => import('react-p5').then((mod) => {
    require('p5/lib/addons/p5.sound');
    return mod.default
}), {
    ssr: false,
})


//Canvas import
import state from '../src/Canvas_state.jsx';
import { SHAPE_CHANGE_INTERVAL } from '../src/Canvas_state.jsx';
import {
    updateSingleShape,
    getCurrentColor,
    drawPolygon,
    levelToDecibels,
    calculateCircleCount,
    startAudio
} from '../src/Canvas_func.jsx';




//Canvas Size
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



class Canvas extends React.Component {

    render() {
        const setup = (P5, canvasParentRef) => {

            canvasWidth = innerWidth - 50;
            canvasHeight = vh(45);

            P5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);

            P5.colorMode(P5.HSB, 360, 100, 100, 1.0);
            P5.noFill();

            state.shapeEdges.fill(0);

            state.recordButton = P5.createButton('Start Mic');
            state.recordButton.position(10, 10);
            state.recordButton.mousePressed(startAudio(P5));
        };


        const draw = (P5) => {
            P5.background(220);
            P5.translate(canvasWidth / 2, canvasHeight / 2);

            if (state.isPlaying && P5.millis() - state.shapeChangeTimer > SHAPE_CHANGE_INTERVAL) {
                updateSingleShape(P5);
                state.shapeChangeTimer = P5.millis();
            }

            let decibels = 0;
            let currentCircleCount = 5;

            if (state.isPlaying && state.micStarted && state.amplitude) {
                let level = state.amplitude.getLevel();
                decibels = levelToDecibels(P5, level);
                decibels = P5.constrain(decibels, 0, 100);
                currentCircleCount = calculateCircleCount(P5);
                state.lastDecibels = decibels;
                state.lastCircleCount = currentCircleCount;
            } else {
                decibels = state.lastDecibels;
                currentCircleCount = state.lastCircleCount;
            }

            let mappedRadius = P5.map(decibels, 0, 100, state.innerRadius, state.innerRadius * 3);

            // 設置所有線條的統一顏色
            let currentColor = getCurrentColor(P5);
            P5.stroke(currentColor);

            // 放射狀線條
            P5.push();
            P5.strokeWeight(0.5);
            P5.rotate(-state.radiatingAngle);
            for (let i = 0; i < 36; i++) {
                P5.rotate(P5.TWO_PI / 36);
                P5.line(0, 0, state.radius, 0);
            }
            P5.pop();

            if (state.isPlaying) {
                state.radiatingAngle += 0.01;
            }

            // 五個形狀
            P5.push();
            P5.strokeWeight(1);
            P5.rotate(state.angle);
            for (let i = 0; i < 5; i++) {
                P5.push();
                P5.rotate(P5.TWO_PI * i / 5);
                P5.translate(40, 0);
                if (i === state.currentShapeIndex && state.isPlaying) {
                    P5.strokeWeight(2);
                }
                drawPolygon(P5, 0, 0, 100, state.shapeEdges[i]);
                P5.pop();
            }
            P5.pop();

            // 外圈軌道
            P5.strokeWeight(6);
            P5.ellipse(0, 0, state.outerRadius * 2, state.outerRadius * 2);

            // 動態數量的小圓點
            let darkerColor = getCurrentColor(P5, 70);
            P5.fill(darkerColor);
            for (let i = 0; i < currentCircleCount; i++) {
                let sphereAngle = state.angle * 3 + (P5.TWO_PI * i / currentCircleCount);
                let x = P5.cos(sphereAngle) * mappedRadius;
                let y = P5.sin(sphereAngle) * mappedRadius;

                P5.strokeWeight(1);
                P5.circle(x, y, 15);
            }
            P5.noFill();

            if (state.isPlaying) {
                state.angle += 0.01;
                state.colorAngle = (state.colorAngle + 0.5) % 360;
            }

            // 顯示資訊
            P5.push();
            P5.translate(-canvasWidth / 2 + 80, -canvasHeight / 2 + 25);
            P5.fill(0);
            P5.noStroke();
            P5.textSize(16);
            if (state.isRecording) {
                P5.text("Recording Time: " + P5.nf((P5.millis() - state.recordStartTime) / 1000, 0, 1) + "s", 10, 0);
                P5.text("Volume: " + nf(decibels, 0, 1) + " dB", 10, 20);
                P5.text("Circles: " + currentCircleCount, 10, 40);
            }
            P5.pop();
        };




        return (
            <div>
                <Sketch setup={setup} draw={draw} />;
            </div>
        );
    }


}


export default Canvas;
