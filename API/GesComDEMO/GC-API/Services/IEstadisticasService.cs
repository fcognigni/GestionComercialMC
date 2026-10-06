using GC_API.Models;

namespace APIGesCom.Services
{

    public interface IEstadisticasService
    {
        Task<List<EstadisticaCotizacionDTO>> ListarEstadisticasCotizaciones();
        Task<List<EstadisticaObraDTO>> ListarEstadisticasObras();
    }
}
