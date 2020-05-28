


//
// Global variables
//

//
const totalBoids = 200
const totalPredators = 1

const boxSize = {
    x: 1000,
    y: 500,
    z: 1000
}
const center = {
    x: 0,
    y: 0,
    z: 0
}

// Sliders
let alignSlider, cohesionSlider, separationSlider

//
let boids = []
let predators = []


//
let renderRange = false
let renderTrace = false
let renderLights = false
let renderAxis = false

// 
let camera 
let firstPersonCamera = false

function preload(){
    
}

function setup(){

    createCanvas(window.innerWidth, window.innerHeight, WEBGL)
    
    camera = createCamera()

    alignSlider = createSlider(0, 5, 1, .1)
    cohesionSlider = createSlider(0, 5, 1, .1)
    separationSlider = createSlider(0, 5, 1, .1)

    for(let i = 0; i < totalBoids; i++)
        boids[i] = new Boid(random(boxSize.x) , random(boxSize.y), random(boxSize.z))

    for(let i = 0; i < totalPredators; i++)
        predators[i] = new Predator(random(boxSize.x) , random(boxSize.y), random(boxSize.z))
    

}

function draw(){
    
    background(renderTrace ? 'rgba(0,0,0,.15)' : 'black')

    push()
    fill('white')
    //text(frameRate().toFixed(0), 0, 20) 
    pop()

    if(renderAxis){
        push()
        stroke('green')
        line(0, 0, 0, 100, 0, 0)
        stroke('red')
        line(0, 0, 0, 0, 100, 0)
        stroke('blue')
        line(0, 0, 0, 0, 0, 100)
        pop()
    }

    if(renderLights)
        pointLight(255,255,255, 1,0,0)

    if(!firstPersonCamera)
        orbitControl()

    for (const boid of boids) {
        //boid.Align(boids)
        boid.Flock(boids, predators)
    }

    for (const predator of predators) {
        predator.Flock(boids, predators)
    }

    for (const boid of boids) {
        boid.Update()
    }

    for (const predator of predators) {
        predator.Update()
    }
    for (const predator of predators) {
        predator.Draw()
    }
    for (const boid of boids) {
        boid.Draw()
    }

    
}