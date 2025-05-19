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

/**
 * Componente principal para la gestión de productos en despensa
 * Permite visualizar, agregar y editar productos
 * @returns {JSX.Element} Tabla de productos con formulario para agregar nuevos
 */

export default function TablaProductos() {
  // Estados para almacenar los productos y controlar la visibilidad de detalles
  const [productos, setProductos] = useState<Producto[]>([]); // Lista de productos obtenida de la API
  const [visibleDetails, setVisibleDetails] = useState<{ [key: number]: boolean }>({}); // Control de visibilidad de detalles por ID

  // Estados para el formulario de creación de productos
  const [nombre, setNombre] = useState(''); // Nombre del nuevo producto
  const [cantAlmacenada, setCantAlmacenada] = useState(''); // Cantidad almacenada del nuevo producto
  const [fechaCompra, setFechaCompra] = useState(''); // Fecha de compra del nuevo producto
  const [fechaVencimiento, setFechaVencimiento] = useState(''); // Fecha de vencimiento del nuevo producto
  const [categoria, setCategoria] = useState(''); // Categoría del nuevo producto

  // Estados para la edición de productos existentes
  const [modoEdicion, setModoEdicion] = useState<{ [key: number]: boolean }>({}) // Control de modo edición por ID
  const [productoEditado, setProductoEditado] = useState<{ [key: number]: Partial<Producto> }>({}) // Datos temporales durante edición

  /**
   * Efecto que se ejecuta al montar el componente
   * Obtiene los productos desde el API y los almacena en el estado
   */
  useEffect(() => {
    fetch('http://localhost:3001/api/productos')
      .then(res => res.json())
      .then(data => {
        console.log("Datos recibido:", data);
        setProductos(data.data); 
      })
      .catch(err => console.error('Error al hacer fetch:', err));
  }, []);

   /**
   * Alterna la visibilidad de los detalles de un producto
   * @param {number} id - ID del producto cuyos detalles se mostrarán/ocultarán
   * @utilizado cuando se hace clic en la flecha de un producto para expandir sus detalles
   */
  const toggleDetails = (id: number) => {
    setVisibleDetails(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

   /**
   * Envía un nuevo producto al servidor y actualiza la lista local
   * @async
   * @utilizado cuando se hace clic en el botón "Agregar producto"
   */
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

      // Actualiza la lista de productos con el nuevo producto
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

  /**
   * Activa el modo de edición para un producto específico
   * @param {Producto} p - Producto que se va a editar
   * @utilizado cuando se hace clic en el botón "Editar" de un producto
   */
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

  /**
   * Actualiza un campo específico en el estado de edición de un producto
   * @param {number} id - ID del producto que se está editando
   * @param {keyof Producto} campo - Nombre de la propiedad a actualizar
   * @param {any} valor - Nuevo valor para la propiedad
   * @param {keyof Categoria} [subcampo] - Subcampo en caso de que se esté editando una propiedad de la categoría
   * @utilizado en los campos de entrada (inputs) durante la edición de un producto
   */
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

  /**
   * Guarda los cambios de un producto editado en el servidor y actualiza la lista local
   * @async
   * @param {number} id - ID del producto que se está guardando
   * @utilizado cuando se hace clic en el botón "Guardar" después de editar un producto
   */
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

      // Actualiza el producto en la lista local
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

  /**
   * Formatea una fecha para mostrarla en formato DD/MM/AAAA
   * @param {string} fecha - Fecha en formato string
   * @returns {string} Fecha formateada como DD/MM/AAAA o cadena vacía si la fecha es inválida
   * @utilizado para mostrar las fechas en la tabla de detalles del producto
   */
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
      {/* Formulario para agregar nuevos productos */}
      <div className={styles.addProduct}>
        <input className={styles.Input} type="text" placeholder="Nombre Producto" value={nombre} onChange={(e) => setNombre(e.target.value)}/>
        <input className={styles.Input} type="number" placeholder="Cantidad a almacenar" value={cantAlmacenada} onChange={(e) => setCantAlmacenada(e.target.value)}/>
        <input className={styles.Input} type="text" placeholder="Fecha de Compra" value={fechaCompra} onChange={(e) => setFechaCompra(e.target.value)}/>
        <input className={styles.Input} type="text" placeholder="Fecha de Vencimiento" value={fechaVencimiento} onChange={(e => setFechaVencimiento(e.target.value))}/>
        <input className={styles.Input} type="text" placeholder="Categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)}/>
        <button className={styles.add} type="button" onClick={AgregarProducto}>Agregar producto</button>
      </div>
      {/* Sección de filtros - Actualmente solo muestra UI sin funcionalidad */}
        <div className={styles.filtros}>
          Ordenar por
          <button className={styles.filtrado}>
            <span className={styles.tipoFiltro}>Filtro</span>
            <svg className={`${styles.flechita} ${styles.rotated}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v16.19l6.22-6.22a.75.75 0 1 1 1.06 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 1 1 1.06-1.06l6.22 6.22V3a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      {/* Tabla principal que muestra los productos */}
      <table className={styles.main}>
        <tbody>
          {/* Mapeo de productos para mostrar cada uno como una fila */}
          {productos.map(p => (
            <React.Fragment key={p.id}>
              {/* Fila principal del producto con su nombre y botón para expandir */}
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
              {/* Detalles expandibles del producto - se muestran solo si visibleDetails[p.id] es true */}
              {visibleDetails[p.id] && (
                <tr className={styles.detailRow}>
                  <td colSpan={1}>
                    <div className={styles.detailTableWrapper}>
                      {/* Botones para editar y guardar */}
                      <button className={styles.edit} type="button" onClick={() => activarEdicion(p)}>Editar</button>
                      {modoEdicion[p.id] && (
                        <button className={styles.save} type="button" onClick={() => guardarCambios(p.id)}>Guardar</button>
                      )}
                      {/* Tabla de detalles del producto */}
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
                            {/* Celda de ID (no editable) */}
                            <td className={styles.cellDetails}>{p.id}</td>
                            {/* Celda de Nombre (editable) */}
                            <td className={styles.cellDetails}>
                              {modoEdicion[p.id] ? (
                                <input type="text" value={productoEditado[p.id]?.nombre || ''} onChange={(e) => actualizarCampoEditado(p.id, 'nombre', e.target.value)}/>
                              ) : (
                                p.nombre
                              )}
                            </td>
                            {/* Celda de Cantidad Almacenada (editable) */}
                            <td className={styles.cellDetails}>
                              {modoEdicion[p.id] ? (
                                <input type="text" value={productoEditado[p.id]?.cant_almacenada || ''} onChange={(e) => actualizarCampoEditado(p.id, 'cant_almacenada', e.target.value)}/>
                              ) : (
                                p.cant_almacenada
                              )}
                            </td>
                            {/* Celda de Fecha de Compra (editable) */}
                            <td className={styles.cellDetails}>
                              {modoEdicion[p.id] ? (
                                <input type="date" value={productoEditado[p.id]?.fecha_compra ? new Date(productoEditado[p.id].fecha_compra).toISOString().substring(0, 10) : new Date(p.fecha_compra).toISOString().substring(0, 10)} onChange={(e) => actualizarCampoEditado(p.id, 'fecha_compra', e.target.value)}/>
                              ) : (
                                formatearFecha(p.fecha_compra.toString())
                              )}
                            </td>
                            {/* Celda de Fecha de Vencimiento (editable) */}
                            <td className={styles.cellDetails}>
                              {modoEdicion[p.id] ? (
                                <input type="date" value={productoEditado[p.id]?.fecha_vec ? new Date(productoEditado[p.id].fecha_vec).toISOString().substring(0, 10) : new Date(p.fecha_vec).toISOString().substring(0, 10)} onChange={(e) => actualizarCampoEditado(p.id, 'fecha_vec', e.target.value)}/>
                              ) : (
                                formatearFecha(p.fecha_vec.toString())
                              )} 
                            </td>
                            {/* Celda de Categoría (editable) */}
                            <td className={styles.cellDetails}>
                              <div className={styles.categoryDetails}>
                                {/* Campo nombre de categoría */}
                                {modoEdicion[p.id] ? (
                                <input type="text" value={productoEditado[p.id]?.categoria?.nombre ?? p.categoria.nombre} onChange={(e) => actualizarCampoEditado(p.id, 'categoria', e.target.value, 'nombre')}/>
                              ) : (
                                <span>{p.categoria.nombre}</span>
                              )}
                              {/* Campo descripcion de categoría */}
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