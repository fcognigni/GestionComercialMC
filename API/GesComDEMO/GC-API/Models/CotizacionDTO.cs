namespace GC_API.Models
{
    public class CotizacionDTO
    {
        public long Id { get; set; }
        public int Prefijo { get; set; }
        public int Numero { get; set; }
        public string Referencia { get; set; } = string.Empty;
        public long IdCliente { get; set; }
        public string NombreCliente { get; set; } = string.Empty;
        public long? IdObra { get; set; }
        public long? IdSolicitante { get; set; }
        public string? NombreSolicitante { get; set; }
        public string? Descripcion { get; set; }
        public DateTime Fecha { get; set; }
        public int IdMoneda { get; set; }
        public string Moneda { get; set; } = string.Empty;
        public decimal Monto { get; set; }
        public bool Formal { get; set; }
    }
}