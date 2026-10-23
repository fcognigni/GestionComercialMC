using APIGesCom.Models;
using GC_API.Models;
using Microsoft.AspNetCore.Mvc;

namespace APIGesCom.Services
{
    public interface IObraService
    {
        IEnumerable<ObraDTO> ListarTodos([FromQuery] ObraFiltro filtro);
        Task<ResultadoOperacion> InsertarAsync(Obra obra);
        Task<ResultadoOperacion> ModificarAsync(Obra obra);
        Task<ResultadoOperacion> EliminarAsync(long id);
    }
}