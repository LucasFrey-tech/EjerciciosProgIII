CREATE TABLE IF NOT EXISTS producto (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cant_Almacenada INTEGER NOT NULL,
    fecha_Compra DATE NOT NULL,
    fecha_Vec DATE NOT NULL,
    categoria_id INTEGER REFERENCES categorias(id) ON DELETE SET NULL
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS producto_categoria (
    producto_id INTEGER REFERENCES productos(id) ON DELETE CASCADE,
    categoria_id INTEGER REFERENCES categorias(id) ON DELETE CASCADE,
    PRIMARY KEY (producto_id, categoria_id)
)

INSERT INTO producto (nombre, cant_Almacenada, fecha_Compra, fecha_VeC)
VALUES 
    ('leche',  5, , ,),
    ('manteca', 5, ,),
    ('harina', 3, ,);

INSERT INTO categorias (nombre, descripcion)
VALUES 
    ("Lacteo", "Producto derivado de la leche"),
    ("Cereal", "Derivados de la molienda");

INSERT INTO producto_categoria (producto_id, categoria_id) VALUES
  (1, 1),
  (2, 2),
  (3, 1);
