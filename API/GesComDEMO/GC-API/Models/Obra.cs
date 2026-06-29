namespace APIGesCom.Models
{
    public class Obra
    {
        public long Id { get; set; }
        public string Descripcion {  get; set; }
        public long IdCliente { get; set; }
        public DateTime? FechaAlta { get; set; }
        public float MontoPactado { get; set; }
        public long? IdSolicitante { get; set; }
    }
}
