DROP TABLE IF EXISTS producto;
DROP TABLE IF EXISTS categoria;

CREATE TABLE IF NOT EXISTS categoria (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(100) NOT NULL,
);

CREATE TABLE IF NOT EXISTS producto (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cant_Almacenada INTEGER NOT NULL,
    fecha_Compra DATE NOT NULL,
    fecha_Vec DATE NOT NULL,
    categoria_id INTEGER REFERENCES categoria(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categoria (nombre, descripcion)
VALUES 
    ('Lacteo', 'Producto derivado de la leche'),
    ('Cereal', 'Derivados de la molienda');

INSERT INTO producto (nombre, cant_Almacenada, fecha_Compra, fecha_VeC, categoria_id)
VALUES 
    ('leche',  5, '2025-05-09', '2025-06-10', 1),
    ('manteca', 5, '2025-05-09', '2025-06-12', 1),
    ('harina', 3, '2025-05-09', '2025-07-20', 2);