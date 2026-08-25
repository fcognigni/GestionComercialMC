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

        Task<int>
            InsertarAsync(ObraEstadoComercial estado);

        Task<bool>
            EliminarAsync(long id);
    }
}
