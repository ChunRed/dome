import React from "react";
//import Sketch from "react-p5";
import dynamic from 'next/dynamic'

const Sketch = dynamic(() => import('react-p5').then((mod) => {
    require('p5/lib/addons/p5.sound');
    return mod.default
}), {
    ssr: false,
})


let song, analyzer;
let r, g, b;
let mic, fft;

export default (props) => {
    const setup = (P5, canvasParentRef) => {
        P5.createCanvas(300, 300).parent(canvasParentRef);

        // create a new Amplitude analyzer
        analyzer = new p5.Amplitude();

        // Patch the input to an volume analyzer
        analyzer.setInput(song);

        //for mic
        mic = new p5.AudioIn();
        mic.start();
        fft = new p5.FFT();
        fft.setInput(mic);
    };

    const draw = (P5) => {
        P5.background(30);


        // Get the average (root mean square) amplitude
        let rms = analyzer.getLevel();
        P5.fill(r, g, b, 127);
        P5.stroke(0);

        // Draw an ellipse with size based on volume
        P5.ellipse(300 / 2, 300 / 2, 10 + rms * 200, 10 + rms * 200);


        let spectrum = fft.analyze();

        P5.beginShape();
        for (let i = 0; i < spectrum.length; i++) {
            P5.vertex(i, P5.map(spectrum[i], 0, 255, 300, 0));
        }
        P5.endShape();

    };

    return <Sketch setup={setup} draw={draw} />;
};