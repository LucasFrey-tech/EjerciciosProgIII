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
       {/*LOGO*/ }  
      <h1 className={styles.logo}>Despensa</h1>
      </header>
      <table className={styles.main}>
        {productos.map(p => (
           <tr key={p.id}>
          <td className={styles.cell}>
            <span className={styles.nombreProducto}>{p.nombre}</span>
            <button>
            <svg className = {styles.flechita} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v16.19l6.22-6.22a.75.75 0 1 1 1.06 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 1 1 1.06-1.06l6.22 6.22V3a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
            </svg>
            </button>          

        
          </td>
          
           </tr>
        ) )
        }
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