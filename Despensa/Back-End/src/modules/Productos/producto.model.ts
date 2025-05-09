import { DataTypes, Model, Optional } from 'sequelize';

interface ProductoAttributes {
    id: number;
    nombre?: string;
    cant_almacenada?: number;
    fecha_compra?: Date;
    fecha_vec?: Date;
}

interface ProductoCreacionAttributes extends Optional<ProductoAttributes, 'id'> {}

class Producto extends Model<ProductoAttributes, ProductoCreacionAttributes> implements ProductoAttributes {
    public id!: number;
    public nombre?: string;
    public cant_almacenada?: number;
    public readonly fecha_compra!: Date;
    public readonly fecha_vec!: Date;

}

Producto.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    cant_almacenada: {
        type: DataTypes.INTEGER
    },
    fecha_compra: {
        type: DataTypes.INTEGER
    },
    fecha_vec: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'productos',
    sequelize
});

export default Producto;

