class Anuncio 
{
    constructor(id,titulo, transaccion,descripcion,precio)
    {
        this.id = id;
        this.titulo = titulo;
        this.transaccion = transaccion;
        this.descripcion = descripcion;
        this.precio = precio;
    }
}
export class Anuncio_Auto extends Anuncio 
{
    
    constructor(id, titulo, transaccion, descripcion, precio, num_puertas, num_KMs, potencia)
    {
        super(id, titulo, transaccion, descripcion, precio);
        this.num_puertas = num_puertas;
        this.num_KMs = num_KMs;
        this.potencia = potencia;
    }
}
