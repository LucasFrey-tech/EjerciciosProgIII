'use client';
import styles from './Home.module.css';
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

/*
export default function Home() {
  return (
   
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.logo}>Despensa</h1>
        </header>

        <main className={styles.main}>
        <div className={styles.grid}>
          { header de la tabla }
          <div className={`${styles.cell} ${styles.headerCell}`}>ID</div>
          <div className={`${styles.cell} ${styles.headerCell}`}>Nombre</div>
          <div className={`${styles.cell} ${styles.headerCell}`}>Cantidad</div>
          <div className={`${styles.cell} ${styles.headerCell}`}>Fecha de Compra</div>
          <div className={`${styles.cell} ${styles.headerCell}`}>Fecha de Vencimiento</div>
          <div className={`${styles.cell} ${styles.headerCell}`}>Categoria</div>
          <div className={`${styles.cell} ${styles.headerCell}`}>Descripcion</div>

          { Celdas vacias para llenar despues }
          <div className={styles.cell}></div>
          <div className={styles.cell}></div>
          <div className={styles.cell}></div>
          <div className={styles.cell}></div>
          <div className={styles.cell}></div>
          <div className={styles.cell}></div>
          <div className={styles.cell}></div>

        </div>
      </main>
      </div>

   
  );
}
*/

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
    <table className={styles.table}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Cantidad Almacenada</th>
          <th>Fecha Compra</th>
          <th>Fecha Vencimiento</th>
          <th>Categoria</th>
        </tr>
      </thead>
      <tbody className={styles.tbody}>
        {productos.map(p => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.nombre}</td>
            <td>{p.cant_almacenada}</td>
            <td>{new Date(p.fecha_compra).toLocaleDateString()}</td>a
            <td>{new Date(p.fecha_vec).toLocaleDateString()}</td>
            <td>{p.categoria_id}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}