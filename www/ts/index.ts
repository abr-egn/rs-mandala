import * as React from "react";
import * as ReactDOM from "react-dom";

import { Index } from "../tsx/index";
import * as wasm from "../wasm";
import { memory } from "../js/mem_hack";

function main() {
    const canvas = initCanvas();
    renderReact();

    const data = new wasm.Data(performance.now());
    window.requestAnimationFrame((ts) => drawFrame(canvas, data, ts));
}

function initCanvas(): HTMLCanvasElement {
    const canvas = document.getElementById("render") as HTMLCanvasElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.onresize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    canvas.addEventListener('keyup', (e) => {
        console.info("Key pressed: ", e.code);
    });
    canvas.focus();
    return canvas;
}

function renderReact() {
    let element = React.createElement(Index, {}, null);
    ReactDOM.render(element, document.getElementById("root"));
}

function drawFrame(canvas: HTMLCanvasElement, data: wasm.Data, ts: number) {
    data.update(ts);

    const count = data.count();
    const xs = new Float32Array(memory.buffer, data.xs(), count);
    const ys = new Float32Array(memory.buffer, data.ys(), count);
    const endXs = new Float32Array(memory.buffer, data.end_x(), count);
    const endYs = new Float32Array(memory.buffer, data.end_y(), count);

    canvas.width = canvas.width;  // clear
    const ctx = canvas.getContext("2d")!;
    ctx.strokeStyle = "#FFFFFF";
    ctx.translate(canvas.width/2, canvas.height/2);
    const ixDelta = Math.floor(ts * 0.005);
    for (let ix = 0; ix < count; ix++) {
        ctx.beginPath();
        ctx.moveTo(xs[ix], ys[ix]);
        ctx.lineTo(endXs[ix], endYs[ix]);
        ctx.strokeStyle = `rgb(${ix}, ${ix}, ${ix})`
        ctx.stroke();
    }

    window.requestAnimationFrame((ts) => drawFrame(canvas, data, ts));
}

main();