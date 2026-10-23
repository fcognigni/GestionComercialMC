using APIGesCom.Models;

namespace APIGesCom.Services;

public interface ISolicitanteService
{
    List<Solicitante> ListarTodos();
    Solicitante? ListarPorId(long id);
    Task<ResultadoOperacion> InsertarAsync(Solicitante solicitante);
    Task<ResultadoOperacion> ModificarAsync(Solicitante solicitante);
    Task<ResultadoOperacion> EliminarAsync(long id);
}
