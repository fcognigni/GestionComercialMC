using APIGesCom.Models;

namespace APIGesCom.Services;

public interface IClienteService
{
    List<Cliente> ListarTodos();
    Task<ResultadoOperacion> InsertarAsync(Cliente cliente);
    Task<ResultadoOperacion> ModificarAsync(Cliente cliente);
    Task<ResultadoOperacion> EliminarAsync(long id);
}
