namespace GC_API.Models
{
    public class CotizacionDTO
    {
        public long Id { get; set; }

        public int Prefijo { get; set; }

        public int Numero { get; set; }

        public string Referencia { get; set; }

        public long IdCliente { get; set; }

        public string NombreCliente { get; set; }

        public long? IdObra { get; set; }

        public string? NombreSolicitante { get; set; }

        public DateTime Fecha { get; set; }

        public decimal Monto { get; set; }
    }
}
