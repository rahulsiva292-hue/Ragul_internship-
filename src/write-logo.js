const fs = require('fs');
const path = require('path');
const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAK3RFWHRDcmVhdGlvbiBUaW1lADIwMjYtMDYtMjJUMTc6NDM6MjUrMDA6MDAn6AvuAAAAJXRFWHRpbWVzdGFtcAAyMDI2LTA2LTIyVDE3OjQzOjI1KzAwOjAw0ZrZrQAAAFdJREFUKM9jZKAxYKSxYGB4T8haGhj4T0h+z/YwMDAwMDP4D8R8SYmZmBq9AXUz8T44uLi4uHh4eHgUQe8HkjGT7gGQAACyHAzTgO7ZAAAAAElFTkSuQmCC';
const outPath = path.resolve(__dirname, 'assets', '2206.png');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, Buffer.from(base64, 'base64'));
console.log('CREATED', outPath);
