'use client';
import styles from './Home.module.css';
import { useEffect, useState } from 'react';
import React from 'react';


interface Categoria {
  id: number,
  nombre: string;
  descripcion: string;
}

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
  const [categoriaId, setCategoriaId] = useState<number | ''>(''); // ID de la categoría seleccionada
  const [categoriasDisponibles, setCategoriasDisponibles] = useState<Categoria[]>([]);
  // Estados para visibilidad del menu filtros y filtros seleccionados
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [productosOriginales, setProductosOriginales] = useState<Producto[]>([]);
  const [ordenarPorVencimiento, setOrdenarPorVencimiento] = useState(false); // true para ordenar por vencimiento

  // Estados para la edición de productos existentes
  const [modoEdicion, setModoEdicion] = useState<{ [key: number]: boolean }>({}) // Control de modo edición por ID
  const [productoEditado, setProductoEditado] = useState<{ [key: number]: Partial<Producto> }>({}) // Datos temporales durante edición

  
  const toggleFilters = () => setMostrarFiltros(!mostrarFiltros);
  
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
          categoriaId: categoriaId,
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
      setCategoriaId('');
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
       categoria_id: p.categoria_id
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
 const actualizarCampoEditado = (id: number, campo: keyof Producto, valor: any) => {
   setProductoEditado(prev => {
     const producto = prev[id] || {};
     return {
       ...prev,
       [id]: {
         ...producto,
         [campo]: valor,
        },
      };
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
          categoriaId: datos.categoria_id
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
  
  /**
   * Ordena los productos por fecha de vencimiento (de más cercana a más lejana)
   * y restaura el orden original según el estado actual
   * 
   * @function handleOrdenarPorVencimiento
   * @description Alterna entre mostrar productos ordenados por fecha de vencimiento 
   * y mostrarlos en su orden original. Cuando se activa, ordena los productos 
   * de manera que se muestren los productos mas cercanos a vencer.
   * 
   * @requires {state} ordenarPorVencimiento - Estado booleano que indica si el filtro está activo
   * @requires {state} productosOriginales - Estado que guarda la lista original de productos
   * @requires {state} productos - Estado actual de productos mostrados
   * 
   * @modifies {state} ordenarPorVencimiento - Cambia el estado del filtro
   * @modifies {state} productos - Actualiza la lista de productos mostrados
  */
 const handleOrdenarPorVencimiento = () => {
   // Invierte el valor actual del estado
   const nuevoEstado = !ordenarPorVencimiento;
   setOrdenarPorVencimiento(nuevoEstado);
   
   if (nuevoEstado) {
     // Si se activa el filtro, ordena los productos por fecha de vencimiento
     // (de más cercana a más lejana)
     const productosOrdenados = [...productos].sort((a, b) => {
       const fechaA = new Date(a.fecha_vec).getTime();
       const fechaB = new Date(b.fecha_vec).getTime();
       return fechaA - fechaB; // Orden ascendente (más cercano primero)
      });
      setProductos(productosOrdenados);
    } else {
      // Si se desactiva el filtro, restaura la lista original de productos
      setProductos(productosOriginales);
    }
  };
  
  const obtenerDatosCategoria = (id:number) => {
    console.log("Buscando categoría con ID:", id); // ✅ ¿Es un número? ¿Coincide con alguna categoría?
    console.log("categoriasDisponibles actuales:", categoriasDisponibles); // ✅ ¿Ya está cargado el array?
    const categoria = categoriasDisponibles.find(cat => cat.id === id);
    console.log("Resultado encontrado:", categoria); // ✅ ¿La encontró o es undefined?
    return categoria ? (
      <>
      <span>{categoria.nombre}</span>
      <span>{categoria.descripcion}</span>
    </>
    ) : (
      <span>Categoria no encontrada</span>
    );
  };
  
  const eliminarProducto = async (id:number) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar el producto con ID ${id}?`)) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:3001/api/productos/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        alert(`Error al eliminar: ${result.message}`);
        return;
      }

      // Actualiza los estados productos y productosOriginales
      setProductos(prev => prev.filter(p => p.id !== id));
      setProductosOriginales(prev => prev.filter(p => p.id !== id));
      setVisibleDetails(prev => {
        const newDetails = { ...prev };
        delete newDetails[id];
        return newDetails;
      });
      setModoEdicion(prev => {
        const newModo = { ...prev };
        delete newModo[id];
        return newModo;
      });
      setProductoEditado(prev => {
        const newEditado = { ...prev };
        delete newEditado[id];
        return newEditado;
      });

      alert('Producto eliminado exitosamente');
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      alert('Error de red al eliminar el producto');
    }
  }

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
        setProductosOriginales(data.data); 
      })
      .catch(err => console.error('Error al hacer fetch:', err));
  }, []);
  
  /**
   * Efecto que se ejecuta al montar el componente
   * Obtiene los categorias desde el API y los almacena en el estado
   */
  useEffect(() => {
    fetch('http://localhost:3001/api/categorias')
      .then(res => res.json())
      .then(data => {
        console.log("Categorías recibidas:", data);
        setCategoriasDisponibles(data.data); // o data, según cómo venga el JSON
      })
      .catch(err => console.error('Error al hacer fetch de categorías:', err));
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
        {/*<input className={styles.Input} type="text" placeholder="Categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)}/>*/}
        <select className={styles.selectCategory} value={categoriaId} onChange={(e) => setCategoriaId(Number(e.target.value))}><option value="">Seleccionar categoría</option> {categoriasDisponibles.map((cat) => (<option key={cat.id} value={cat.id}>{cat.nombre}</option>))}</select>
        <button className={styles.add} type="button" onClick={AgregarProducto}>Agregar producto</button>
      </div>
      {/* Sección de filtros - Actualmente solo aplicamos ordenar por fecha de vencimiento*/}
        <div className={styles.filtros}>
          Ordenar por
          <button className={styles.filtrado} onClick={toggleFilters}>
            {/*<span className={styles.tipoFiltro}>Filtro</span>*/}
            <svg className={`${styles.flechita} ${mostrarFiltros ? styles.rotated : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v16.19l6.22-6.22a.75.75 0 1 1 1.06 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 1 1 1.06-1.06l6.22 6.22V3a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
            </svg>
          </button> 
        </div>
        {/* Boton ordenar y muestra de filtros */}
          {mostrarFiltros && (
            <div className={styles.menuFiltros}>
              <label>
                <input type="checkbox" checked={ordenarPorVencimiento} onChange={() => handleOrdenarPorVencimiento()}/>
                  Ordenar por fecha de vencimiento
              </label>
            </div>
         )}
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
                    <svg className={`${styles.flechita} ${visibleDetails[p.id] ? styles.rotated : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v16.19l6.22-6.22a.75.75 0 1 1 1.06 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 1 1 1.06-1.06l6.22 6.22V3a.75.75 0 0 1 .75-.75Z"  clipRule="evenodd"/>
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
                      <button className={styles.delete} type="button" onClick={() => eliminarProducto(p.id)}>Eliminar</button>
                      {/*Nos falta implementar el boton eliminar producto*/}
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
                                {modoEdicion[p.id] ? (
                                  <select className={styles.selectCategory} value={categoriaId} onChange={(e) => actualizarCampoEditado(p.id, 'categoria_id', Number(e.target.value))}><option value="">Seleccionar categoría</option> {categoriasDisponibles.map((cat) => (<option key={cat.id} value={cat.id}>{cat.nombre}</option>))}</select>
                                ) : (
                                  obtenerDatosCategoria(p.categoria_id)
                                )} 
                              </div>
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