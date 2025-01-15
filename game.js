// Videojuego
const gameSketch = (p) => {
    let carImg;
    let trackImg;
    let grassImg;
    let carX, carY;
    let speed = 0;
    let maxSpeed = 5; // Velocidad máxima
    let isMoving = false;
  
    p.preload = () => {
      carImg = p.loadImage('car.png'); // Carga la imagen del carro
      trackImg = p.loadImage('track.png'); // Carga la imagen de la pista
      grassImg = p.loadImage('grass.png'); // Carga la imagen del césped
    };
  
    p.setup = () => {
      const canvas = p.createCanvas(400, 400);
      canvas.parent("game-view");
  
      // Posición inicial del carro
      carX = p.width / 2;
      carY = p.height - 70; // Ajustado para que no se salga de la pantalla
  
      // Inicializa el control de gestos
      gameControls = new GameControls(p);
    };
  
    p.draw = () => {
      // Dibujar césped
      p.image(grassImg, 0, 0, p.width, p.height);
  
      // Dibujar pista
      p.image(trackImg, 50, 50, p.width - 100, p.height - 100);
  
      // Actualizar la posición del carro según la velocidad
      if (isMoving) {
        carY -= speed; // Mueve el carro hacia arriba
        speed = Math.min(speed + 0.1, maxSpeed); // Aumentar velocidad
      } else {
        speed = Math.max(speed - 0.1, 0); // Reducir velocidad
      }
  
      // Dibujar carro
      drawCar(carX, carY);
    };
  
    // Función para dibujar el carro
    function drawCar(x, y) {
      p.image(carImg, x - 15, y - 30, 30, 60); // Ajustar tamaño del carro
    }
  
    // Control de gestos
    class GameControls {
      constructor(p) {
        this.p = p;
        this.initialPositionY = carY;
      }
  
      checkGestures(hands) {
        if (hands.length > 0) {
          const hand = hands[0];
  
          // Comprobar gestos
          const palmOpen = this.isPalmOpen(hand);
          const fistClosed = this.isFistClosed(hand);
          const leftMovement = this.isLeftMovement(hand);
          const rightMovement = this.isRightMovement(hand);
          const bothHandsRaised = this.areBothHandsRaised(hands);
  
          // Acelerar
          if (palmOpen) {
            isMoving = true;
          }
  
          // Frenar
          if (fistClosed) {
            isMoving = false;
          }
  
          // Girar a la izquierda
          if (leftMovement) {
            carX -= 5; // Girar a la izquierda
          }
  
          // Girar a la derecha
          if (rightMovement) {
            carX += 5; // Girar a la derecha
          }
  
          // Reiniciar
          if (bothHandsRaised) {
            carY = this.initialPositionY; // Reiniciar la posición del carro
            speed = 0; // Detener el carro
          }
        }
      }
  
      isPalmOpen(hand) {
        // Lógica para detectar la palma abierta
        // Puedes ajustar según el modelo de detección
        return hand.annotations.indexFinger[1][1] < hand.annotations.indexFinger[3][1] &&
               hand.annotations.middleFinger[1][1] < hand.annotations.middleFinger[3][1] &&
               hand.annotations.thumb[1][1] < hand.annotations.thumb[3][1];
      }
  
      isFistClosed(hand) {
        // Lógica para detectar puño cerrado
        return hand.annotations.indexFinger[0][1] > hand.annotations.indexFinger[1][1] &&
               hand.annotations.middleFinger[0][1] > hand.annotations.middleFinger[1][1] &&
               hand.annotations.ringFinger[0][1] > hand.annotations.ringFinger[1][1] &&
               hand.annotations.pinky[0][1] > hand.annotations.pinky[1][1];
      }
  
      isLeftMovement(hand) {
        // Lógica para detectar movimiento lateral a la izquierda
        return hand.landmarks[4][0] < hand.landmarks[5][0]; // Comprobar posición de la mano
      }
  
      isRightMovement(hand) {
        // Lógica para detectar movimiento lateral a la derecha
        return hand.landmarks[4][0] > hand.landmarks[5][0]; // Comprobar posición de la mano
      }
  
      areBothHandsRaised(hands) {
        return hands.length > 1 && hands[0].boundingBox[0][1] < 100 && hands[1].boundingBox[0][1] < 100;
      }
    }
  };
  
  new p5(gameSketch);
  