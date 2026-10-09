using APIGesCom.Models;
using GC_API.Models;
using Microsoft.AspNetCore.Mvc;

namespace APIGesCom.Services
{
    public interface IObraService
    {
        IEnumerable<ObraDTO> ListarTodos([FromQuery] ObraFiltro filtro);

        long Insertar(Obra obra, int id);

        bool Modificar(Obra obra);

        bool Eliminar(long id);
    }
}