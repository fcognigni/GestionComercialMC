using APIGesCom.Models;
using GC_API.Models;


namespace APIGesCom.Services
{
    public interface IObraEstadoComercialService
    {
        Task<
        ResultadoPaginado<ObraEstadoComercialDTO>
        > ListarAsync(
            ObraEstadoComercialFiltro filtro
            );

        Task<ResultadoOperacion>
            InsertarAsync(ObraEstadoComercial estado);

        Task<ResultadoOperacion>
            EliminarAsync(long id);
    }
}
