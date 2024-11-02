import React from 'react';
import dynamic from 'next/dynamic'
const Sketch = dynamic(() => import('react-p5').then((mod) => {
    require('p5/lib/addons/p5.sound');
    return mod.default
}), {
    ssr: false,
})


//value
let angle = 0;
let radius = 40;
let outerRadius = 45;
let innerRadius = 60;
// 音頻分析器
let mic;
let fft;
let amplitude;
// 錄音狀態
let isRecording = false;
let recordStartTime;
let recordDuration = 0;
// 按鈕
let recordButton;
let micStarted = false;
// 可變參數
let solidCircleCount = 5;
let orbitingCircleCount = 5;
let segmentCount = 32;
let orbitRadiusMultiplier = 1;


//Canvas Size
let canvasWidth = 0;
let canvasHeight = 0;



class Canvas extends React.Component {

    render() {

        const setup = (P5, canvasParentRef) => {

            canvasWidth = innerWidth - 50;
            canvasHeight = innerHeight * 0.35;

            P5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);




            // 初始化音頻
            mic = new p5.AudioIn();
            mic.getSources().then(sources => {
                console.log('Available audio sources:', sources);
            });

        };

        const draw = (P5) => {
            P5.background(0);
            P5.translate(canvasWidth / 2, canvasHeight / 2);

            // 獲取分貝值和圓點數量
            let decibels = 0;
            let currentCircleCount = 5;

            if (micStarted && amplitude) {
                let level = amplitude.getLevel();
                decibels = levelToDecibels(level);
                decibels = constrain(decibels, 0, 100);
                currentCircleCount = calculateCircleCount();
            }

            // 將分貝值映射到軌道半徑
            let mappedRadius = P5.map(decibels, 0, 100, innerRadius, innerRadius * 3);

            // 放射狀線條
            P5.push();
            P5.strokeWeight(0.5);
            for (let i = 0; i < 36; i++) {
                P5.rotate(P5.TWO_PI / 36);
                P5.stroke(255);
                P5.line(0, 0, radius, 0);
            }
            P5.pop();

            // 五個大圓形
            P5.push();
            P5.strokeWeight(1);
            P5.rotate(angle);
            for (let i = 0; i < 5; i++) {
                P5.push();
                P5.rotate(P5.TWO_PI * i / 5);
                P5.translate(40, 0);
                P5.stroke(255);
                P5.ellipse(0, 0, 200, 200);
                P5.pop();
            }
            P5.pop();

            // 外圈軌道
            P5.strokeWeight(6);
            P5.ellipse(0, 0, outerRadius * 2, outerRadius * 2);

            // 動態數量的小圓點
            for (let i = 0; i < currentCircleCount; i++) {
                let sphereAngle = angle * 3 + (P5.TWO_PI * i / currentCircleCount);
                let x = P5.cos(sphereAngle) * mappedRadius;
                let y = P5.sin(sphereAngle) * mappedRadius;

                P5.fill(255);
                P5.stroke(255);
                P5.strokeWeight(1);
                P5.circle(x, y, 15);
                P5.noFill();
            }

            // 更新旋轉角度
            angle += 0.01;

            // 顯示資訊
            P5.push();
            P5.translate(-canvasWidth / 2 + 80, -canvasHeight / 2 + 25);
            P5.fill(255);
            P5.noStroke();
            P5.textSize(16);
            if (isRecording) {
                P5.text("Recording Time: " + nf((millis() - recordStartTime) / 1000, 0, 1) + "s", 10, 0);
                P5.text("Volume: " + nf(decibels, 0, 1) + " dB", 10, 20);
                P5.text("Circles: " + currentCircleCount, 10, 40);
            }
            P5.pop();
        };


        function startAudio() {
            userStartAudio();

            if (!micStarted) {
                mic.start(() => {
                    console.log('Mic started');
                    micStarted = true;
                    amplitude = new p5.Amplitude();
                    amplitude.setInput(mic);
                    fft = new p5.FFT(0.8, 64); // 增加FFT的平滑度，使用64個頻帶
                    fft.setInput(mic);

                    // 更改按鈕為錄製按鈕
                    recordButton.html('Record');
                    recordButton.mousePressed(toggleRecording);
                });
            }
        }

        // 計算頻率能量並返回對應的圓點數量
        function calculateCircleCount() {
            if (!fft) return 5; // 默認值

            let spectrum = fft.analyze();
            let bassEnergy = 0;
            let midEnergy = 0;
            let trebleEnergy = 0;

            // 分析不同頻段的能量
            // 低頻 (20-250Hz)
            for (let i = 0; i < 10; i++) {
                bassEnergy += spectrum[i];
            }
            bassEnergy = bassEnergy / 10;

            // 中頻 (250-2000Hz)
            for (let i = 10; i < 30; i++) {
                midEnergy += spectrum[i];
            }
            midEnergy = midEnergy / 20;

            // 高頻 (2000-20000Hz)
            for (let i = 30; i < spectrum.length; i++) {
                trebleEnergy += spectrum[i];
            }
            trebleEnergy = trebleEnergy / (spectrum.length - 30);

            // 計算總能量的平均值
            let avgEnergy = (bassEnergy + midEnergy + trebleEnergy) / 3;

            // 將能量映射到2-6的範圍
            let circleCount = Math.round(map(avgEnergy, 0, 255, 2, 6));
            return constrain(circleCount, 2, 6);
        }

        // 將音量級別轉換為 0-100 分貝值
        function levelToDecibels(level) {
            if (level === 0) return 0;
            let db = 20 * Math.log10(level);
            return map(db, -60, 0, 0, 100);
        }

        function toggleRecording() {
            isRecording = !isRecording;
            if (isRecording) {
                recordStartTime = millis();
                recordButton.html('Stop');
                recordButton.style('background-color', '#ff0000');
                recordButton.style('color', '#ffffff');
            } else {
                recordDuration = (millis() - recordStartTime) / 1000;
                recordButton.html('Record');
                recordButton.style('background-color', '#ffffff');
                recordButton.style('color', '#000000');
            }
        }



        return (
            <div>
                <Sketch setup={setup} draw={draw} />;
            </div>
        );
    }


}


export default Canvas;
