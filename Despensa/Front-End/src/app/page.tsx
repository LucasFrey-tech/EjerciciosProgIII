'use client';
import styles from './estilo.module.css';
import { useEffect, useState } from 'react';

interface Producto {
  id: number;
  nombre: string;
  cant_almacenada: number;
  fecha_compra: Date;
  fecha_vec: Date;
  categoria_id: number;
  created_at: Date;
  updated_at: Date;
}
export default function TablaPersonas() {
  const [productos, setProductos] = useState<Producto[]>([]);
  useEffect(() => {
    fetch('http://localhost:3001/api/productos') // ⚠️ Asegurate de usar el puerto correcto
      .then(res => res.json())
      .then(data => {
        console.log("Datos recibido:", data);
        setProductos(data.data);
      })
      .catch(err => console.error('Error al hacer fetch:', err));
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.logo}>Despensa</h1>
      </header>

    
      <table className={styles.main}>
        <thead className={styles.grid}>
          <tr>
            <th className={`${styles.cell} ${styles.headerCell}`}>ID</th>
            <th className={`${styles.cell} ${styles.headerCell}`}>Nombre</th>
            <th className={`${styles.cell} ${styles.headerCell}`}>Cantidad Almacenada</th>
            <th className={`${styles.cell} ${styles.headerCell}`}>Fecha Compra</th>
            <th className={`${styles.cell} ${styles.headerCell}`}>Fecha Vencimiento</th>
            <th className={`${styles.cell} ${styles.headerCell}`}>Categoria</th>
          </tr>
        </thead>
        <tbody className={"--"}>
          {productos.map(p => (
            <tr key={p.id}>
              <td className={styles.cell}>{p.id}</td>
              <td className={styles.cell}>{p.nombre}</td>
              <td className={styles.cell}>{p.cant_almacenada}</td>
              <td className={styles.cell}>{new Date(p.fecha_compra).toLocaleDateString()}</td>
              <td className={styles.cell}>{new Date(p.fecha_vec).toLocaleDateString()}</td>
              <td className={styles.cell}>{p.categoria_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


/*const [loading, setLoading] = useState(true);

useEffect(() => {
  setLoading(true);
  fetch('http://localhost:3001/api/productos')
    .then(res => res.json())
    .then(data => {
      console.log("Datos recibido:", data);
      setProductos(data.data || []);
    })
    .catch(err => console.error('Error al hacer fetch:', err))
    .finally(() => setLoading(false));
}, []);

if (loading) {
  return <div>Loading...</div>;
}*/