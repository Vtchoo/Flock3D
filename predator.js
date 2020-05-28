class Predator{

    //
    constantSpeed = false
    maxSpeed = 2

    // Force settings
    maxForce = 1

    // Sensors
    perceptionRange = 200


    // Render settings
    scale = 1.5

    
    constructor(x, y, z){
        this.position = createVector(x, y, z)
        this.velocity = p5.Vector.random3D()
        this.acceleration = createVector()
    }

    Flock(boids, predators){
        this.acceleration.mult(0)

        let hunt = this.Hunt(boids)
        let separation = this.Separation(predators)
        
        this.acceleration.add(hunt)
        this.acceleration.add(separation)
    }

    Hunt(boids){

        let steer = createVector()

        let total = 0
        for (const other of boids) {
            if(other != this)
                if(this.position.dist(other.position) <= this.perceptionRange){
                    steer.add(other.position)
                    total++
                }       
        }

        if(total > 0){
            steer.div(total)
            steer.sub(this.position)
            steer.setMag(this.maxSpeed)
            steer.sub(this.velocity)
            steer.limit(this.maxForce)
        }

        return steer
    }
    
    Separation(predators){

        let steer = createVector()

        let total = 0
        for (const other of predators) {
            if(other != this){

                let dist = this.position.dist(other.position)
                if(dist <= this.perceptionRange){
                    let diff = p5.Vector.sub(this.position, other.position)
                    diff.div(dist * dist)
                    steer.add(diff)
                    total++
                }     
            }  
        }

        if(total > 0){
            steer.div(total)
            steer.setMag(this.maxSpeed)
            steer.sub(this.velocity)
            steer.limit(this.maxForce)
        }
               
        return steer
    }

    Update(){
        this.velocity.add(this.acceleration)
        if(this.constantSpeed) this.velocity.setMag(this.maxSpeed)
        this.position.add(this.velocity)        
        this.Edges()
    }

    Draw(){

        if(firstPersonCamera)
        {
            camera.setPosition(this.position.x, this.position.y, this.position.z)
            camera.lookAt(this.position.x + this.velocity.x, this.position.y + this.velocity.y, this.position.z + this.velocity.z)
        }

        push()
        translate(this.position.x, this.position.y, this.position.z)
        if(renderRange){
            push()
            noStroke()
            fill('rgba(255, 0, 0, 0.25)')
            circle(0, 0, this.perceptionRange)
            pop()
        }
        setCamera(camera)

        //rotate(this.velocity.heading())
        //rotateZ(Math.atan2( this.velocity.y, this.velocity.x ))
        //rotateY(Math.atan2( this.velocity.mag(), this.velocity.x ))
        noStroke()
        fill('red')
        sphere(2.5 * this.scale)
        //pointLight(255, 0, 0, 0, 0, 0)
        //cone(2.5 * this.scale, 10 * this.scale)
        pop()
    }

    Edges(){
        ["x", "y", "z"].map( axis => {
            if(this.position[axis] > boxSize[axis] / 2 )
                this.position[axis] -= boxSize[axis]
            if(this.position[axis] < -boxSize[axis] / 2)
                this.position[axis] += boxSize[axis]
        })
    }
}