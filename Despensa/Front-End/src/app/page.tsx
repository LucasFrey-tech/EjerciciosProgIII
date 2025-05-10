import styles from './Home.module.css';

export default function Home() {
  return (
   
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.logo}>Despensa</h1>
        </header>

        <main className={styles.main}>
        <div className={styles.grid}>
          {/* header de la tabla */}
          <div className={`${styles.cell} ${styles.headerCell}`}>ID</div>
          <div className={`${styles.cell} ${styles.headerCell}`}>Nombre</div>
          <div className={`${styles.cell} ${styles.headerCell}`}>Cantidad</div>
          <div className={`${styles.cell} ${styles.headerCell}`}>Fecha de Compra</div>
          <div className={`${styles.cell} ${styles.headerCell}`}>Fecha de Vencimiento</div>
          <div className={`${styles.cell} ${styles.headerCell}`}>Categoria</div>
          <div className={`${styles.cell} ${styles.headerCell}`}>Descripcion</div>

          {/* Celdas vacias para llenar despues */}
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
