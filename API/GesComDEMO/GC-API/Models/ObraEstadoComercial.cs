namespace APIGesCom.Models
{
    public class ObraEstadoComercial
    {
        public long Id { get; set; }

        public long IdObra { get; set; }

        public int IdEstadoComercial { get; set; }

        public DateTime? Fecha { get; set; }

        public string? Observaciones { get; set; }
    }
}