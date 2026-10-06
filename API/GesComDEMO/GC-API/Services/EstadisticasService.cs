using APIGesCom.Services;
using GC_API.Models;
using Microsoft.Data.SqlClient;
using System.Data;

namespace GestionComercialMC.Services
{
    public class EstadisticasService : IEstadisticasService
    {
        private readonly IConfiguration _configuration;

        public EstadisticasService(IConfiguration configuration)
        {
            _configuration = configuration;
        }


        // ============================================================
        // ESTADISTICAS DE COTIZACIONES
        // ============================================================

        public async Task<List<EstadisticaCotizacionDTO>>
            ListarEstadisticasCotizaciones()
        {
            var lista = new List<EstadisticaCotizacionDTO>();

            var connectionString =
                _configuration.GetConnectionString("DefaultConnection");

            using var connection =
                new SqlConnection(connectionString);

            using var command = new SqlCommand(
                @"
                SELECT *
                FROM AppData.VistaEstadisticasCotizaciones
                ORDER BY
                    Anio DESC,
                    Mes DESC,
                    CantidadCotizaciones DESC;
                ",
                connection);

            command.CommandType = CommandType.Text;

            await connection.OpenAsync();

            using var reader =
                await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                var dto = new EstadisticaCotizacionDTO
                {
                    Anio = reader.GetInt32(
                        reader.GetOrdinal("Anio")),

                    Mes = reader.GetInt32(
                        reader.GetOrdinal("Mes")),

                    IdCliente = reader.GetInt64(
                        reader.GetOrdinal("IdCliente")),

                    NombreCliente = reader.GetString(
                        reader.GetOrdinal("NombreCliente")),

                    CantidadCotizaciones = reader.GetInt64(
                        reader.GetOrdinal("CantidadCotizaciones")),

                    MontoCotizadoPesos = reader.GetDecimal(
                        reader.GetOrdinal("MontoCotizadoPesos")),

                    CotizacionesLlevadasAObra = reader.GetInt64(
                        reader.GetOrdinal("CotizacionesLlevadasAObra")),

                    TotalCotizacionesMes = reader.GetInt64(
                        reader.GetOrdinal("TotalCotizacionesMes")),

                    TotalMontoMes = reader.GetDecimal(
                        reader.GetOrdinal("TotalMontoMes")),

                    TotalLlevadasAObraMes = reader.GetInt64(
                        reader.GetOrdinal("TotalLlevadasAObraMes")),

                    TotalCotizacionesAnio = reader.GetInt64(
                        reader.GetOrdinal("TotalCotizacionesAnio")),

                    TotalMontoAnio = reader.GetDecimal(
                        reader.GetOrdinal("TotalMontoAnio")),

                    TotalLlevadasAObraAnio = reader.GetInt64(
                        reader.GetOrdinal("TotalLlevadasAObraAnio")),

                    PorcentajeCotizacionesMes = reader.GetDecimal(
                        reader.GetOrdinal("PorcentajeCotizacionesMes")),

                    PorcentajeCotizacionesAnio = reader.GetDecimal(
                        reader.GetOrdinal("PorcentajeCotizacionesAnio")),

                    PorcentajeMontoMes = reader.GetDecimal(
                        reader.GetOrdinal("PorcentajeMontoMes")),

                    PorcentajeMontoAnio = reader.GetDecimal(
                        reader.GetOrdinal("PorcentajeMontoAnio")),

                    PorcentajeLlevadasAObra = reader.GetDecimal(
                        reader.GetOrdinal("PorcentajeLlevadasAObra")),

                    PorcentajeLlevadasAObraSobreTotalMes =
                        reader.GetDecimal(
                            reader.GetOrdinal(
                                "PorcentajeLlevadasAObraSobreTotalMes")),

                    PorcentajeLlevadasAObraSobreTotalAnio =
                        reader.GetDecimal(
                            reader.GetOrdinal(
                                "PorcentajeLlevadasAObraSobreTotalAnio")),

                    RankingCantidadMes = reader.GetInt64(
                        reader.GetOrdinal("RankingCantidadMes")),

                    RankingMontoMes = reader.GetInt64(
                        reader.GetOrdinal("RankingMontoMes")),

                    EsTop10Cantidad = reader.GetInt32(
                        reader.GetOrdinal("EsTop10Cantidad")),

                    EsTop10Monto = reader.GetInt32(
                        reader.GetOrdinal("EsTop10Monto"))
                };

                lista.Add(dto);
            }

            return lista;
        }


        // ============================================================
        // ESTADISTICAS DE OBRAS
        // ============================================================

        public async Task<List<EstadisticaObraDTO>>
            ListarEstadisticasObras()
        {
            var lista = new List<EstadisticaObraDTO>();

            var connectionString =
                _configuration.GetConnectionString("DefaultConnection");

            using var connection =
                new SqlConnection(connectionString);

            using var command = new SqlCommand(
                @"
                SELECT *
                FROM AppData.VistaEstadisticasObras
                ORDER BY
                    Anio DESC,
                    Mes DESC,
                    CantidadObras DESC;
                ",
                connection);

            command.CommandType = CommandType.Text;

            await connection.OpenAsync();

            using var reader =
                await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                var dto = new EstadisticaObraDTO
                {
                    Anio = reader.GetInt32(
                        reader.GetOrdinal("Anio")),

                    Mes = reader.GetInt32(
                        reader.GetOrdinal("Mes")),

                    IdCliente = reader.GetInt64(
                        reader.GetOrdinal("IdCliente")),

                    NombreCliente = reader.GetString(
                        reader.GetOrdinal("NombreCliente")),

                    CantidadObras = reader.GetInt64(
                        reader.GetOrdinal("CantidadObras")),

                    MontoObrasPesos = reader.GetDecimal(
                        reader.GetOrdinal("MontoObrasPesos")),

                    TotalObrasMes = reader.GetInt64(
                        reader.GetOrdinal("TotalObrasMes")),

                    TotalMontoObrasMes = reader.GetDecimal(
                        reader.GetOrdinal("TotalMontoObrasMes")),

                    TotalObrasAnio = reader.GetInt64(
                        reader.GetOrdinal("TotalObrasAnio")),

                    TotalMontoObrasAnio = reader.GetDecimal(
                        reader.GetOrdinal("TotalMontoObrasAnio")),

                    PorcentajeObrasMes = reader.GetDecimal(
                        reader.GetOrdinal("PorcentajeObrasMes")),

                    PorcentajeObrasAnio = reader.GetDecimal(
                        reader.GetOrdinal("PorcentajeObrasAnio")),

                    CantidadFacturadas = reader.GetInt32(
                        reader.GetOrdinal("CantidadFacturadas")),

                    CantidadPendientesFacturar = reader.GetInt32(
                        reader.GetOrdinal(
                            "CantidadPendientesFacturar")),

                    PorcentajeFacturadas = reader.GetDecimal(
                        reader.GetOrdinal("PorcentajeFacturadas")),

                    PorcentajePendientesFacturar =
                        reader.GetDecimal(
                            reader.GetOrdinal(
                                "PorcentajePendientesFacturar")),

                    ParticipacionFacturadasMes =
                        reader.GetDecimal(
                            reader.GetOrdinal(
                                "ParticipacionFacturadasMes")),

                    ParticipacionPendientesMes =
                        reader.GetDecimal(
                            reader.GetOrdinal(
                                "ParticipacionPendientesMes")),

                    TotalObrasCliente = reader.GetInt64(
                        reader.GetOrdinal("TotalObrasCliente")),

                    TotalObrasConOCCliente = reader.GetInt32(
                        reader.GetOrdinal(
                            "TotalObrasConOCCliente")),

                    PorcentajeObrasConOrdenCompra =
                        reader.GetDecimal(
                            reader.GetOrdinal(
                                "PorcentajeObrasConOrdenCompra")),

                    RankingObrasMes = reader.GetInt64(
                        reader.GetOrdinal("RankingObrasMes")),

                    EsTop10Obras = reader.GetInt32(
                        reader.GetOrdinal("EsTop10Obras"))
                };

                lista.Add(dto);
            }

            return lista;
        }
    }
}

