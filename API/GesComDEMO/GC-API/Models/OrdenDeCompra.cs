public class OrdenDeCompra
{
    public long Id { get; set; }

    public string Numero { get; set; }

    public long IdCliente { get; set; }

    public long? IdSolicitante { get; set; }

    public long? IdObra { get; set; }

    public long? IdCotizacion { get; set; }

    public DateTime? Fecha { get; set; }

    public decimal? Monto { get; set; }

    public decimal? IVA { get; set; }
}
