namespace APIGesCom.Models
{
    public class ResultadoPaginado<T>
    {
        public List<T> Items { get; set; } = new();

        public int TotalRegistros { get; set; }

        public int Page { get; set; }

        public int PageSize { get; set; }

        public int TotalPages =>
            (int)Math.Ceiling(
                (double)TotalRegistros / PageSize
            );
    }
}