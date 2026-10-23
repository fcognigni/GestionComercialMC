using APIGesCom.Models;
using GC_API.Models;

public interface ICotizacionService
{
    Task<ResultadoOperacion> InsertarAsync(Cotizacion cotizacion);

    CotizacionDTO? ListarPorId(long id);

    Task<ResultadoPaginado<CotizacionDTO>>
            ListarAsync(
            CotizacionFiltro filtro);

    Task<ResultadoOperacion> ModificarAsync(Cotizacion cotizacion);

    Task<ResultadoOperacion> EliminarAsync(long id);
}
