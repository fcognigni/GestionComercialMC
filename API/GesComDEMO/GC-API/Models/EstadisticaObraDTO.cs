namespace GC_API.Models
{
    public class EstadisticaObraDTO
    {
        public int Anio { get; set; }
        public int Mes { get; set; }

        public long IdCliente { get; set; }
        public string NombreCliente { get; set; } = string.Empty;

        // Obras
        public long CantidadObras { get; set; }
        public decimal MontoObrasPesos { get; set; }

        public long TotalObrasMes { get; set; }
        public decimal TotalMontoObrasMes { get; set; }

        public long TotalObrasAnio { get; set; }
        public decimal TotalMontoObrasAnio { get; set; }

        // Participación de obras
        public decimal PorcentajeObrasMes { get; set; }
        public decimal PorcentajeObrasAnio { get; set; }

        // Facturación
        public int CantidadFacturadas { get; set; }
        public int CantidadPendientesFacturar { get; set; }

        public decimal PorcentajeFacturadas { get; set; }
        public decimal PorcentajePendientesFacturar { get; set; }

        public decimal ParticipacionFacturadasMes { get; set; }
        public decimal ParticipacionPendientesMes { get; set; }

        // Órdenes de compra históricas del cliente
        public long TotalObrasCliente { get; set; }
        public int TotalObrasConOCCliente { get; set; }

        public decimal PorcentajeObrasConOrdenCompra { get; set; }

        // Ranking mensual
        public long RankingObrasMes { get; set; }
        public int EsTop10Obras { get; set; }
    }
}

