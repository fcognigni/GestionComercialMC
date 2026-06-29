namespace APIGesCom.Models
{
    public class Cotizacion
    {
        public long Id { get; set; }

        public int Numero { get; set; }

        public long IdCliente { get; set; }

        public long? IdObra { get; set; }

        public long? IdSolicitante { get; set; }

        public string Referencia { get; set; } = string.Empty;

        public string? Descripcion { get; set; }

        public DateTime? Fecha { get; set; }

        public decimal Monto { get; set; }

        public bool Formal { get; set; }
    }
}
