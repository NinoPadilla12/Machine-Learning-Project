let video;
let poseNet;
let noseX = 0;
let noseY = 0;
let stars = [];
let score = 0;
let poses = []; // Variable global para almacenar las poses
let hueValue = 0; // Valor de matiz inicial para el arcoíris
let celebrate = false; // Bandera para la celebración
let celebrateDuration = 60; // Duración de la celebración en cuadros
let celebrateCounter = 0; // Contador para la duración de la celebración

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide();

    poseNet = ml5.poseNet(video, modelReady);
    poseNet.on('pose', gotPoses);

    // Genera estrellas al azar
    for (let i = 0; i < 10; i++) {
        stars.push(new Star());
    }
}

function modelReady() {
    console.log("PoseNet está listo");
}

function gotPoses(newPoses) {
    poses = newPoses; // Actualiza la variable global poses
}

function draw() {
    // Cambia el fondo temporalmente durante la celebración
    if (celebrate) {
        background(120, 100, 50); // Fondo colorido para la celebración
        fill(255);
        textSize(48);
        textAlign(CENTER, CENTER);
        text("¡Felicidades!", width / 2, height / 2); // Mensaje de celebración
        celebrateCounter++;

        if (celebrateCounter > celebrateDuration) {
            celebrate = false; // Finaliza la celebración
            celebrateCounter = 0; // Resetea el contador
        }
        return; // No dibuja el video ni las estrellas
    }

    image(video, 0, 0, width, height);

    // Configura el color de relleno utilizando HSL
    fill(hue(hueValue), 255, 255); // Cambia el color basado en el valor de matiz
    textSize(24);
    text(`Puntos: ${score}`, 10, 30);

    // Aumenta el valor de matiz para crear el efecto arcoíris
    hueValue += 1; // Incrementa el valor para el efecto arcoíris
    if (hueValue > 360) {
        hueValue = 0; // Resetea el valor si excede 360
    }

    // Dibuja y mueve las estrellas
    for (let star of stars) {
        star.move();
        star.show();

        // Detecta colisión con la nariz
        if (dist(star.x, star.y, noseX, noseY) < 20) {
            score++;
            star.reset();

            // Activar celebración al llegar a 5 puntos
            if (score === 5) {
                celebrate = true; // Inicia la celebración
            }
        }
    }

    // Dibuja un círculo sobre la nariz
    fill(255, 0, 0);
    noStroke();
    ellipse(noseX, noseY, 20);

    // Dibuja la malla de detección
    drawKeypoints(poses);
}

// Dibuja los puntos clave
function drawKeypoints(poses) {
    if (poses.length > 0) {
        for (let i = 0; i < poses[0].pose.keypoints.length; i++) {
            let keypoint = poses[0].pose.keypoints[i];
            if (keypoint.score > 0.2) {
                fill(0, 255, 0);
                noStroke();
                ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
            }
        }
        // Actualiza la posición de la nariz
        noseX = poses[0].pose.nose.x;
        noseY = poses[0].pose.nose.y;
    }
}

// Clase Star
class Star {
    constructor() {
        this.x = random(width);
        this.y = random(-500, -50);
        this.speed = random(2, 5);
    }

    move() {
        this.y += this.speed;
        if (this.y > height) {
            this.reset();
        }
    }

    show() {
        fill(255, 255, 0);
        noStroke();
        ellipse(this.x, this.y, 20);
    }

    reset() {
        this.x = random(width);
        this.y = random(-500, -50);
        this.speed = random(2, 5);
    }
}
