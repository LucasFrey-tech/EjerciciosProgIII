'use client';
import styles from './Home.module.css';
import { useEffect, useState } from 'react';
import React from 'react';


interface Categoria {
  nombre: string;
  descripcion: string;
}

interface Producto {
  id: number;
  nombre: string;
  cant_almacenada: number;
  fecha_compra: Date;
  fecha_vec: Date;
  categoria: Categoria;
  created_at: Date;
  updated_at: Date;
}

export default function TablaPersonas() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [visibleDetails, setVisibleDetails] = useState<{ [key: number]: boolean }>({});

  const [nombre, setNombre] = useState('');
  const [cantAlmacenada, setCantAlmacenada] = useState('');
  const [fechaCompra, setFechaCompra] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [categoria, setCategoria] = useState('');

  const [modoEdicion, setModoEdicion] = useState<{ [key: number]: boolean }>({})
  const [productoEditado, setProductoEditado] = useState<{ [key: number]: Partial<Producto> }>({})


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

  const AgregarProducto = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          cant_almacenada: Number(cantAlmacenada),
          fecha_compra: fechaCompra,
          fecha_vec: fechaVencimiento,
          categoria_nombre: categoria,
        }),
      });
      const data = await response.json();
      console.log('Respuesta del servidor:', JSON.stringify(data, null, 2));

      if (!response.ok) {
        alert(`Error: ${data.message}`);
        return;
      }

      alert('Producto agregado exitosamente');

      setProductos(prev => [...prev, data.data]);

      // Limpiar inputs
      setNombre('');
      setCantAlmacenada('');
      setFechaCompra('');
      setFechaVencimiento('');
      setCategoria('');
    } catch (err) {
      console.error('Error al agregar producto:', err);
      alert('Error de red al agregar el producto');
    }
  };

  const activarEdicion = (p: Producto) => {
    setModoEdicion(prev => ({...prev, [p.id]: true }));
    setProductoEditado(prev => ({
      ...prev,
      [p.id]: {
        nombre: p.nombre,
        cant_almacenada: p.cant_almacenada,
        fecha_compra: p.fecha_compra,
        fecha_vec: p.fecha_vec,
        categoria: {
          nombre: p.categoria?.nombre,
          descripcion: p.categoria?.descripcion
        }
      },
    }));
  };

  const actualizarCampoEditado = (id: number, campo: keyof Producto, valor: any, subcampo?: keyof Categoria) => {
    setProductoEditado(prev => {
      const producto = prev[id] || {};
    
      if (campo === 'categoria' && subcampo) {
        const categoria = { ...(producto.categoria || {}) };
        categoria[subcampo] = valor;

        return {
          ...prev,
          [id]: {
            ...producto,
            categoria,
          },
        };
      } else {
        return {
          ...prev,
          [id]: {
            ...producto,
            [campo]: valor,
          },
        };
      }
    });
  };

  const guardarCambios = async (id: number) => {
    const datos = productoEditado[id]
    try {
      const response = await fetch(`http://localhost:3001/api/productos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: datos.nombre,
          cant_almacenada: Number(datos.cant_almacenada),
          fecha_compra: datos.fecha_compra,
          fecha_vec: datos.fecha_vec,
          categoria: datos.categoria,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        alert(`Error al guardar: ${result.message}`)
        return
      }

      setProductos(prev =>
        prev.map(p => (p.id === id ? { ...p, ...datos } as Producto : p))
      )
      setModoEdicion(prev => ({ ...prev, [id]: false }))
      alert('Producto actualizado exitosamente')
    } catch (err) {
      console.error('Error al guardar producto:', err)
      alert('Error de red al guardar el producto')
    }
  };

  const formatearFecha = (fecha: string): string => {
    if (!fecha) return '';
    const [anio, mes, dia] = fecha.split('-');
    return `${dia}/${mes}/${anio}`;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>   
        {/*LOGO*/ }  
        <h1 className={styles.logo}>Despensa</h1>
      </header>
      <div className={styles.addProduct}>
        <input className={styles.Input} type="text" placeholder="Nombre Producto" value={nombre} onChange={(e) => setNombre(e.target.value)}/>
        <input className={styles.Input} type="number" placeholder="Cantidad a almacenar" value={cantAlmacenada} onChange={(e) => setCantAlmacenada(e.target.value)}/>
        <input className={styles.Input} type="text" placeholder="Fecha de Compra" value={fechaCompra} onChange={(e) => setFechaCompra(e.target.value)}/>
        <input className={styles.Input} type="text" placeholder="Fecha de Vencimiento" value={fechaVencimiento} onChange={(e => setFechaVencimiento(e.target.value))}/>
        <input className={styles.Input} type="text" placeholder="Categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)}/>
        <button className={styles.add} type="button" onClick={AgregarProducto}>Agregar producto</button>
      </div>
        <div className={styles.filtros}>
          Ordenar por
          <button className={styles.filtrado}>
            <span className={styles.tipoFiltro}>Filtro</span>
            <svg className={`${styles.flechita} ${styles.rotated}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v16.19l6.22-6.22a.75.75 0 1 1 1.06 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 1 1 1.06-1.06l6.22 6.22V3a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      <table className={styles.main}>
        <tbody>
          {productos.map(p => (
            <React.Fragment key={p.id}>
              <tr>
                <td className={`${styles.cell} ${styles.flexRow}`}>
                  <div className={styles.nombreProducto}>
                    {p.nombre}
                  </div>
                  <button onClick={() => toggleDetails(p.id)}>
                    <svg 
                      className={`${styles.flechita} ${visibleDetails[p.id] ? styles.rotated : ''}`} 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd" 
                        d="M12 2.25a.75.75 0 0 1 .75.75v16.19l6.22-6.22a.75.75 0 1 1 1.06 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 1 1 1.06-1.06l6.22 6.22V3a.75.75 0 0 1 .75-.75Z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </button>          
                </td>
              </tr>
                {visibleDetails[p.id] && (
                  <tr className={styles.detailRow}>
                    <td colSpan={1}>
                      <div className={styles.detailTableWrapper}>
                        <button className={styles.edit} type="button" onClick={() => activarEdicion(p)}>Editar</button>
                        {modoEdicion[p.id] && (
                          <button className={styles.save} type="button" onClick={() => guardarCambios(p.id)}>Guardar</button>
                        )}
                        <table className={styles.main}>
                          <thead>
                            <tr>
                              <th className={styles.cellDetails}>ID</th>
                              <th className={styles.cellDetails}>Nombre</th>
                              <th className={styles.cellDetails}>Cantidad Almacenada</th>
                              <th className={styles.cellDetails}>Fecha Compra</th>
                              <th className={styles.cellDetails}>Fecha Vencimiento</th>
                              <th className={styles.cellDetails}>Categoria</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className={styles.cellDetails}>{p.id}</td>
                              <td className={styles.cellDetails}>
                                {modoEdicion[p.id] ? (
                                  <input type="text" value={productoEditado[p.id]?.nombre || ''} onChange={(e) => actualizarCampoEditado(p.id, 'nombre', e.target.value)}/>
                                ) : (
                                  p.nombre
                                )}
                              </td>
                              <td className={styles.cellDetails}>
                                {modoEdicion[p.id] ? (
                                  <input type="text" value={productoEditado[p.id]?.cant_almacenada || ''} onChange={(e) => actualizarCampoEditado(p.id, 'cant_almacenada', e.target.value)}/>
                                ) : (
                                  p.cant_almacenada
                                )}
                              </td>
                              <td className={styles.cellDetails}>
                                {modoEdicion[p.id] ? (
                                  <input type="date" value={productoEditado[p.id]?.fecha_compra ? new Date(productoEditado[p.id].fecha_compra).toISOString().substring(0, 10) : new Date(p.fecha_compra).toISOString().substring(0, 10)} onChange={(e) => actualizarCampoEditado(p.id, 'fecha_compra', e.target.value)}/>
                                ) : (
                                  formatearFecha(p.fecha_compra.toString())
                                )}
                             </td>
                              <td className={styles.cellDetails}>
                                {modoEdicion[p.id] ? (
                                  <input type="date" value={productoEditado[p.id]?.fecha_vec ? new Date(productoEditado[p.id].fecha_vec).toISOString().substring(0, 10) : new Date(p.fecha_vec).toISOString().substring(0, 10)} onChange={(e) => actualizarCampoEditado(p.id, 'fecha_vec', e.target.value)}/>
                                ) : (
                                  formatearFecha(p.fecha_vec.toString())
                                )} 
                              </td>
                              <td className={styles.cellDetails}>
                                <div className={styles.categoryDetails}>
                                  {modoEdicion[p.id] ? (
                                  <input type="text" value={productoEditado[p.id]?.categoria?.nombre ?? p.categoria.nombre} onChange={(e) => actualizarCampoEditado(p.id, 'categoria', e.target.value, 'nombre')}/>
                                ) : (
                                  <span>{p.categoria.nombre}</span>
                                )}
    
                                {modoEdicion[p.id] ? (
                                  <input type="text" value={productoEditado[p.id]?.categoria?.descripcion ?? p.categoria.descripcion} onChange={(e) => actualizarCampoEditado(p.id, 'categoria', e.target.value, 'descripcion')}/>
                                ) : (
                                  <span>{p.categoria.descripcion}</span>
                                )}
                                </div>
                              </td>
                              <td className={styles.editar}>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}


/*<React.Fragment key={p.id}>
              <tr>
                <td className={`${styles.cell} ${styles.flexRow}`}>
                  <div className={styles.nombreProducto}>
                    {p.nombre}
                  </div>
                  <button onClick={() => toggleDetails(p.id)}>
                    <svg 
                      className={`${styles.flechita} ${visibleDetails[p.id] ? styles.rotated : ''}`} 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd" 
                        d="M12 2.25a.75.75 0 0 1 .75.75v16.19l6.22-6.22a.75.75 0 1 1 1.06 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 1 1 1.06-1.06l6.22 6.22V3a.75.75 0 0 1 .75-.75Z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </button>          
                </td>
              </tr>
              {visibleDetails[p.id] && (
                <tr className={styles.detailRow}>
                  <td colSpan={1}>
                    <div className={styles.detailTableWrapper}>
                      <button className={styles.edit} type="button" >Editar</button>
                      <table className={styles.main}>
                        <thead className={styles.grid}>
                          <tr>
                            <th className={styles.cellDetails}>ID</th>
                            <th className={styles.cellDetails}>Nombre</th>
                            <th className={styles.cellDetails}>Cantidad Almacenada</th>
                            <th className={styles.cellDetails}>Fecha Compra</th>
                            <th className={styles.cellDetails}>Fecha Vencimiento</th>
                            <th className={styles.cellDetails}>Categoria</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className={styles.cellDetails}>{p.id}</td>
                            <td className={styles.cellDetails}>{p.nombre}</td>
                            <td className={styles.cellDetails}>{p.cant_almacenada}</td>
                            <td className={styles.cellDetails}>{new Date(p.fecha_compra).toLocaleDateString()}</td>
                            <td className={styles.cellDetails}>{new Date(p.fecha_vec).toLocaleDateString()}</td>
                            <td className={styles.cellDetails}>
                              <div className={styles.categoryDetails}>
                                <span>{p.categoria.nombre}</span>
                                <span>{p.categoria.descripcion}</span>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>*/


/*
{productos.map(p => (
            <tr key={p.id}>
              <td className={styles.cellDetails}>
                {modoEdicion[p.id] ? (
                  <input type="text" value={productoEditado[p.id]?.nombre || ''} onChange={(e) => actualizarCampoEditado(p.id, 'nombre', e.target.value)}/>) : (p.nombre
                )}
              </td>
              <td className={styles.cellDetails}>
                {modoEdicion[p.id] ? (
                  <input type="number" value={productoEditado[p.id]?.cant_almacenada ?? ''} onChange={(e) => actualizarCampoEditado(p.id, 'cant_almacenada', e.target.value)}/>) : (p.cant_almacenada
                )}
              </td>
              <td className={styles.cellDetails}>{p.id}</td>
                <td className={styles.cellDetails}>{p.nombre}</td>
                <td className={styles.cellDetails}>{p.cant_almacenada}</td>
                <td className={styles.cellDetails}>{new Date(p.fecha_compra).toLocaleDateString()}</td>
                <td className={styles.cellDetails}>{new Date(p.fecha_vec).toLocaleDateString()}</td>
                <td className={styles.cellDetails}>
                <div className={styles.categoryDetails}>
                  <span>{p.categoria.nombre}</span>
                  <span>{p.categoria.descripcion}</span>
                </div>
              </td>
              <td className={styles.editar}>
                <button className={styles.edit} type="button" onClick={() => activarEdicion(p)}>Editar</button>
                {modoEdicion[p.id] && (
                  <button className={styles.save} type="button" onClick={() => guardarCambios(p.id)}>Guardar</button>
                )}
              </td>
            </tr>
          ))}
*/