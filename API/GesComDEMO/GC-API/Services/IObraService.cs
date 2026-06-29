using APIGesCom.Models;
using GC_API.Models;

namespace APIGesCom.Services
{
    public interface IObraService
    {
        IEnumerable<ObraDTO> ListarTodos();

        long Insertar(Obra obra, int id);

        bool Modificar(Obra obra);

        bool Eliminar(long id);
    }
}