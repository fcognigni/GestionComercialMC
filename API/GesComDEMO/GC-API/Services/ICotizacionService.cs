using APIGesCom.Models;

public interface ICotizacionService
{
    long Insertar(Cotizacion cotizacion);

    Cotizacion? ListarPorId(long id);

    List<Cotizacion> ListarTodos();

    bool Modificar(Cotizacion cotizacion);

    bool Eliminar(long id);
}
