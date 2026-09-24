using APIGesCom.Models;
using GC_API.Models;

public interface ICotizacionService
{
    long Insertar(Cotizacion cotizacion);

    CotizacionDTO? ListarPorId(long id);

    Task<ResultadoPaginado<CotizacionDTO>>
            ListarAsync(
            CotizacionFiltro filtro);

    bool Modificar(Cotizacion cotizacion);

    bool Eliminar(long id);
}
