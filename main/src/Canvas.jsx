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

        };

        const draw = (P5) => {


        };




        return (
            <div>
                <Sketch setup={setup} draw={draw} />;
            </div>
        );
    }


}


export default Canvas;
