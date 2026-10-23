namespace APIGesCom.Models
{
    public class Obra
    {
        public long Id { get; set; }
        public string Referencia { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public long IdCliente { get; set; }
        public DateTime? FechaAlta { get; set; }
        public int? IdMoneda { get; set; }
        public decimal MontoPactado { get; set; }
        public long? IdSolicitante { get; set; }

        // Solo se usa al crear la obra: la cotización continúa siendo opcional.
        public long? IdCotizacion { get; set; }
        public int IdEstadoComercial { get; set; }
    }
}