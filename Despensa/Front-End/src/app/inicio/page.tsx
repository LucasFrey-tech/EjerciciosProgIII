'use client';
import styles from '../Home.module.css';
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
  const [visibleDetails, setVisibleDetails] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetch('http://localhost:3001/api/productos') // ⚠️ Asegurate de usar el puerto correcto
      .then(res => res.json())
      .then(data => {
        console.log("Datos recibido:", data);
        setProductos(data.data);
      })
      .catch(err => console.error('Error al hacer fetch:', err));
  }, []);

  const toggleDetails = (id: number) => {
    setVisibleDetails(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        {/*LOGO*/}
        <h1 className={styles.logo}>Despensa</h1>
      </header>
      <table className={styles.main}>
        <thead>
          {productos.map(p => (
            <tr key={p.id}>
              <td className={`${styles.cell} ${styles.flexRow}`}>
                <div className={styles.nombreProducto}>
                  {p.nombre}
                </div>
                <button onClick={() => toggleDetails(p.id)}>
                  <svg className={styles.flechita} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v16.19l6.22-6.22a.75.75 0 1 1 1.06 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 1 1 1.06-1.06l6.22 6.22V3a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </thead>
      </table>
      {productos.map(p => (
        visibleDetails[p.id] && (
          <table key={`${p.id}-details`} className={styles.main}>
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
            <tbody>
              <tr>
                <td className={styles.cell}>{p.id}</td>
                <td className={styles.cell}>{p.nombre}</td>
                <td className={styles.cell}>{p.cant_almacenada}</td>
                <td className={styles.cell}>{new Date(p.fecha_compra).toLocaleDateString()}</td>
                <td className={styles.cell}>{new Date(p.fecha_vec).toLocaleDateString()}</td>
                <td className={styles.cell}>{p.categoria_id}</td>
              </tr>
            </tbody>
          </table>
        )
      ))}
    </div>
  );
}