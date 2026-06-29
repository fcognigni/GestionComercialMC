using System.Numerics;

namespace APIGesCom.Models
{
    public class Solicitante
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public long IdCliente { get; set; }
        public string? Telefono { get; set; }
        public string? Email { get; set; }
        public bool Activo { get; set; } = true;
    }
}
