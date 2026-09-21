namespace GC_API.Models
{
    public class CotizacionFiltro
    {
        public long? IdObra { get; set; }

        public DateTime? FechaDesde { get; set; }

        public DateTime? FechaHasta { get; set; }

        public long? idCliente { get; set; }

        private int _page = 1;

        public int Page
        {
            get => _page;
            set => _page = value < 1 ? 1 : value;
        }

        private int _pageSize = 50;

        public int PageSize
        {
            get => _pageSize;

            set => _pageSize =
                value < 1
                    ? 50
                    : Math.Min(value, 100);
        }
    }
}
