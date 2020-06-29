use std::f32::consts::PI;

use log::{Level, info};
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn wasm_start() {
    std::panic::set_hook(Box::new(console_error_panic_hook::hook));
    console_log::init_with_level(Level::Debug).expect("error initializing console_log");

    info!("WASM initialized.");
}

#[wasm_bindgen]
pub struct Data {
    xs: Vec<f32>,
    ys: Vec<f32>,
    end_x: Vec<f32>,
    end_y: Vec<f32>,
}

const POINTS: usize = 200;
const RADIUS: f32 = 400.0;
const POINT_SPEED: f32 = 0.0001;
const END_SPEED: f32 = -0.0002;

#[wasm_bindgen]
impl Data {
    #[wasm_bindgen(constructor)]
    pub fn new(time: f32) -> Self {
        let mut out = Data {
            xs: vec![0.0; POINTS],
            ys: vec![0.0; POINTS],
            end_x: vec![0.0; POINTS],
            end_y: vec![0.0; POINTS],
        };
        out.update(time);
        out
    }

    pub fn count(&self) -> usize { self.xs.len() }
    pub fn xs(&self) -> *const f32 { self.xs.as_ptr() }
    pub fn ys(&self) -> *const f32 { self.ys.as_ptr() }
    pub fn end_x(&self) -> *const f32 { self.end_x.as_ptr() }
    pub fn end_y(&self) -> *const f32 { self.end_y.as_ptr() }

    pub fn update(&mut self, time: f32) {
        let inc = (2.0*PI)/(POINTS as f32);
        for ix in 0..POINTS {
            let angle = (ix as f32) * inc + (time*POINT_SPEED);
            self.xs[ix] = RADIUS * angle.cos();
            self.ys[ix] = RADIUS * angle.sin();
            let end = angle + (time*END_SPEED);
            self.end_x[ix] = RADIUS * end.cos();
            self.end_y[ix] = RADIUS * end.sin();
        }
    }
}