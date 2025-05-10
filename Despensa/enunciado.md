# Enunciado: Sistema de Gestión de Despensa del Hogar

## Descripción General
Desarrollar una aplicación web para gestionar los productos de la despensa del hogar donde los usuarios puedan registrar, consultar, actualizar y eliminar elementos como alimentos, productos de limpieza y otros artículos del hogar.

## Entidades
El sistema debe manejar principalmente dos entidades relacionadas:
- **Producto**: La entidad principal que almacena la información de cada elemento de la despensa.
- **Categoría**: Permite clasificar los productos (por ejemplo: alimentos, productos de limpieza, etc.).

### Producto
De cada producto se desea registrar su nombre, la cantidad almacenada, su fecha de compra y la fecha de vencimiento en caso de que la tenga.
Todo producto posee una única categoría.

### Categoría
Cada categoría sólo tendrá un nombre y una descripción.

## Requisitos funcionales
El usuario debe poder:

- Visualizar el listado de productos en la despensa
- Ver el detalle de un producto específico.
- Añadir nuevos productos. El nombre del producto no puede repetirse.
- Editar productos existentes. Los productos deben poder ser seleccionados desde un listado.
- Eliminar productos existentes. Los productos deben poder ser seleccionados desde un listado.
- Filtrar productos por nombre, categoría o ambos.
- Ver productos próximos a su fecha de vencimiento. 