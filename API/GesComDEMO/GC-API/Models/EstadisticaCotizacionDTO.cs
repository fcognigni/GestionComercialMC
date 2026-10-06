namespace GC_API.Models
{
    public class EstadisticaCotizacionDTO
    {
        public int Anio { get; set; }
        public int Mes { get; set; }

        public long IdCliente { get; set; }
        public string NombreCliente { get; set; } = string.Empty;

        public long CantidadCotizaciones { get; set; }
        public decimal MontoCotizadoPesos { get; set; }

        public long CotizacionesLlevadasAObra { get; set; }

        // Totales del mes
        public long TotalCotizacionesMes { get; set; }
        public decimal TotalMontoMes { get; set; }
        public long TotalLlevadasAObraMes { get; set; }

        // Totales del año
        public long TotalCotizacionesAnio { get; set; }
        public decimal TotalMontoAnio { get; set; }
        public long TotalLlevadasAObraAnio { get; set; }

        // Porcentajes
        public decimal PorcentajeCotizacionesMes { get; set; }
        public decimal PorcentajeCotizacionesAnio { get; set; }

        public decimal PorcentajeMontoMes { get; set; }
        public decimal PorcentajeMontoAnio { get; set; }

        public decimal PorcentajeLlevadasAObra { get; set; }

        public decimal PorcentajeLlevadasAObraSobreTotalMes { get; set; }
        public decimal PorcentajeLlevadasAObraSobreTotalAnio { get; set; }

        // Rankings mensuales
        public long RankingCantidadMes { get; set; }
        public long RankingMontoMes { get; set; }

        public int EsTop10Cantidad { get; set; }
        public int EsTop10Monto { get; set; }
    }
}

