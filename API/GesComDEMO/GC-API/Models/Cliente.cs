using System.Numerics;

namespace APIGesCom.Models
{
    public class Cliente
    {
        public long Id { get; set; }
        public string Nombre { get; set; }
        public string CUIT {  get; set; }
        public string? Localidad { get; set; }
        public string? Calle {  get; set; }
        public string? Numero { get; set; }
        public bool Activo { get; set; } = true;
    }

}
