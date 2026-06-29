using APIGesCom.Models;
using GC_API.Models;


namespace APIGesCom.Services
{
    public interface IObraEstadoComercialService
    {
        Task<IEnumerable<ObraEstadoComercialDTO>>
            ListarTodosAsync();

        Task<IEnumerable<ObraEstadoComercialDTO>>
            ListarPorObraAsync(long idObra);

        Task<IEnumerable<ObraEstadoComercial>>
            ListarPorEstadoComercialAsync(long idEstado);

        Task<bool>
            InsertarAsync(ObraEstadoComercial estado);

        Task<bool>
            EliminarAsync(long id);
    }
}
