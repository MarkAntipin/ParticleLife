(() => {
    const config = {
        particleMinRad: 6,
        particleMaxRad: 20,
        massFactor: 0.002,
        particleColor: 'rgba(250, 10, 30, 0.9)'
    };

    const THO_PI = 2 * Math.PI;
    const canvas = document.querySelector(`canvas`);
    const context = canvas.getContext(`2d`);

    let mouse;
    let particles;
    let width, height;

    class Particle {
        constructor() {
            this.pos = {x: mouse.x, y: mouse.y};
            this.vel = {x: 0, y: 0};
            this.rad = randomIntFromInterval(config.particleMinRad, config.particleMaxRad);
            this.mass = this.rad * config.massFactor;
            this.color = config.particleColor
        }

        drawParticle() {
            this.pos.x += this.vel.x;
            this.pos.y += this.vel.y;
            createCircle(this.pos.x, this.pos.y, this.rad, true, this.color);
            createCircle(this.pos, this.pos.y, this.rad, false, config.particleColor);
        }
    }
    
    function updateParticles  () {
        for (let i = 1; i < particles.length; i++) {
            let acceleration = {x: 0, y: 0};
            for(let j = 0; j < particles.length; j++) {
                if (i === j) continue;
                let first_particle = particles[i];
                let second_particle = particles[j];

                let delta = {
                    x: second_particle.pos.x - first_particle.pos.x,
                    y: second_particle.pos.y - first_particle.pos.y
                };

                let dist = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2));

                let force = second_particle.mass;

                acceleration.x += delta.x * force;
                acceleration.y += delta.y * force;
            }

            particles[i].vel.x = particles[i].vel.x + acceleration.x * particles[i].mass;
            particles[i].vel.y = particles[i].vel.y + acceleration.y * particles[i].mass;
        }
    }

    function createCircle(x, y, rad, isFill, color) {
        context.fillStyle = context.strokeStyle = color;
        context.beginPath();
        context.arc(x, y, rad, 0, THO_PI);
        context.closePath();
        isFill ? context.fill() : context.stroke();
    }


    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function init() {
        width = canvas.width = innerWidth;
        height = canvas.height = innerHeight;

        mouse = {
            x: width / 2,
            y: height / 2,
            isDown: false
        };

        particles = [];
    }

    function loop() {
        context.clearRect(0, 0, width, height);

        if (mouse.isDown) {
            particles.push(new Particle());
        }
        updateParticles();
        particles.map(particle => particle.drawParticle());

        window.requestAnimationFrame(loop);
    }

    init();
    loop();

    function setPos({layerX, layerY}) {
        mouse.x = layerX;
        mouse.y = layerY;
    }

    function switchIsDown() {
        mouse.isDown = !mouse.isDown
    }

    canvas.addEventListener('mousemove', setPos);
    window.addEventListener(`mousedown`, switchIsDown);
    window.addEventListener(`mouseup`  , switchIsDown);
})();
