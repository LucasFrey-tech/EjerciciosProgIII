import app from './modules/Productos/app';

const PORT = process.env.PORT || 3000; // Usa el mismo puerto que en app.ts
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
