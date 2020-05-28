
class Boid{

    //
    constantSpeed = false
    maxSpeed = 4

    // Force settings
    maxForce = 1

    // Sensors
    perceptionRange = 150


    // Render settings
    scale = 1.5


    constructor(x, y, z){
        this.position = createVector(x, y, z)
        this.velocity = p5.Vector.random3D()
        this.acceleration = createVector()
    }

    Flock(boids, predators){
        this.acceleration.mult(0)

        let align = this.Align(boids)
        let cohesion = this.Cohesion(boids)
        let separation = this.Separation(boids)
        let fear = this.Flee(predators)

        align.mult(alignSlider.value())
        cohesion.mult(cohesionSlider.value())
        separation.mult(separationSlider.value())


        this.acceleration.add(align)
        this.acceleration.add(cohesion)
        this.acceleration.add(separation)
        this.acceleration.add(fear)
    }

    Align(boids){

        let steer = createVector()

        let total = 0
        for (const other of boids) {
            if(other != this)
                if(this.position.dist(other.position) <= this.perceptionRange){
                    steer.add(other.velocity)
                    total++
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

    Cohesion(boids){

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

    Separation(boids){

        let steer = createVector()

        let total = 0
        for (const other of boids) {
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

    Flee(predators){
        let steer = createVector()

        let total = 0
        for (const predator of predators) {
            
            let dist = this.position.dist(predator.position)
            if(dist <= this.perceptionRange){
                let diff = p5.Vector.sub(this.position, predator.position)
                diff.div(dist * dist)
                steer.add(diff)
                total++
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
        push()
        translate(this.position.x, this.position.y, this.position.z)
        if(renderRange){
            push()
            noStroke()
            fill('rgba(255, 0, 0, 0.25)')
            circle(0, 0, this.perceptionRange)
            pop()
        }
        rotateZ( -Math.atan2( this.velocity.x, this.velocity.y ))
        rotateX(  Math.atan2( this.velocity.z, Math.sqrt(Math.pow(this.velocity.y, 2) + Math.pow(this.velocity.x, 2))))
        //rotateY( -Math.atan2(this.velocity.z, this.velocity.x) )

        // push()
        // stroke('green')
        // line(0, 0, 0, 10, 0, 0)
        // stroke('red')
        // line(0, 0, 0, 0, 10, 0)
        // stroke('blue')
        // line(0, 0, 0, 0, 0, 10)
        // pop()

        noStroke()
        //sphere(2.5 * this.scale)
        cone(2.5 * this.scale, 10 * this.scale)
        //stroke('red')
        //line(0, 0, 0, this.velocity.x * this.scale * 5, this.velocity.y * this.scale * 5, this.velocity.z * this.scale * 5)
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