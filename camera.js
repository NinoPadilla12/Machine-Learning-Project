// Cámara
const cameraSketch = (p) => {
  let video;

  p.setup = () => {
    const canvas = p.createCanvas(640, 480); // Cámara más grande
    canvas.parent("camera-view");

    // Activar la cámara
    video = p.createCapture(p.VIDEO);
    video.size(640, 480); // Ajustar tamaño del video
    video.hide();
  };

  p.draw = () => {
    p.background(220);
    p.image(video, 0, 0, p.width, p.height);
  };
};

new p5(cameraSketch);
