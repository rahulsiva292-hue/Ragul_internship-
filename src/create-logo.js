const fs = require('fs');
const path = require('path');
const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABmElEQVR4nO2YsQ3CMAxFz7nAxW0+x9G4eYWl+F7G2BCfabnqKXYkY0Qu4OJuqJgFCXUvZz7a8cLBfzVuq2ZEiyZIkSZIkSLJkiRJkiRLkW7zAHMGnd8MQmALmgIvQH38DWgBeYBB4Bj8AvqAh8A+MAHgZ6JkMiN1YBE1tFrTEmD06PFu95nEAzptAi68lHRU6EGBngmoyrmpmQ7Dl7YJ2hj/nzogCiqA50LvFzOtKOueQjeS0A11X+dKgduQcVnB2i9TkjDPAMt6+/brOFtAH+0A/U8S8ALYwfmvLnv8xAsJ7dZ/AE+AM/NZc4BawFvoaWpZ+KYIDp2ZYwIxrMMt6zaZjmP1+Xcg9VMcAKcIhqNfvYSYOF6z4WiQ7SIUC2YzsmUOlwPozBI3D0G9DByQjS3tU+LI0QT/sheOehsZ7qa1I1AFA0Dg5A7mF4aLNd9xUrjo8n+tNfT+u7MQG2WeT7h6enp7hC6RJEiRJkiRJ0ov8AM6D4GoBxGjkAAAAASUVORK5CYII=';
const buffer = Buffer.from(base64, 'base64');
const outPath = path.resolve(__dirname, 'assets', '2206.png');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, buffer);
console.log('created', outPath);
