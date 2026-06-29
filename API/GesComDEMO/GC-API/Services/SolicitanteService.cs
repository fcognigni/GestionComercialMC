using APIGesCom.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using System.Data;

namespace APIGesCom.Services

{
    public class SolicitanteService : ISolicitanteService
    {

        private readonly IConfiguration _config;

        public SolicitanteService(IConfiguration config)
        {
            _config = config;
        }

        public List<Solicitante> ListarTodos()
        {

            List<Solicitante> lista = new List<Solicitante>();

            string connString =
                _config.GetConnectionString("GesComDemo");

            using SqlConnection conn =
                    new SqlConnection(connString);

            using SqlCommand cmd =
                    new SqlCommand("AppData.spListarSolicitante", conn);

            cmd.CommandType = CommandType.StoredProcedure;

            conn.Open();

            using SqlDataReader reader = cmd.ExecuteReader();

            while (reader.Read())
            {

                Solicitante solicitante = new Solicitante();

                solicitante.Id = Convert.ToInt32(reader["ID"]);
                solicitante.Nombre = reader["Nombre"].ToString();
                solicitante.IdCliente = Convert.ToInt64(reader["IdCliente"]);
                solicitante.Telefono = reader["Telefono"].ToString();
                solicitante.Email = reader["Email"].ToString();


                lista.Add(solicitante);

            }

            return lista;
        }

        public Solicitante? ListarPorId(long id)
        {
            string connString =
                _config.GetConnectionString("GesComDemo");

            using SqlConnection conn =
                new SqlConnection(connString);

            using SqlCommand cmd =
                new SqlCommand("AppData.spListarSolicitanteId", conn);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Id", id);

            conn.Open();

            using SqlDataReader reader =
                cmd.ExecuteReader();

            if (reader.Read()) {

                Solicitante S = new Solicitante();

                S.Id = Convert.ToInt32(reader["ID"]);
                S.Nombre = reader["Nombre"].ToString();
                S.IdCliente = Convert.ToInt64(reader["IdCliente"]);
                S.Telefono = reader["Telefono"].ToString();
                S.Email = reader["Email"].ToString();

                return S;
            }

            return null;
        }

        public bool Insertar(Solicitante solicitante)
        {
            string connString =
                _config.GetConnectionString("GesComDemo");

            using SqlConnection conn =
                    new SqlConnection(connString);

            using SqlCommand cmd =
                    new SqlCommand("AppData.spInsertarSolicitante", conn);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Nombre", solicitante.Nombre);
            cmd.Parameters.AddWithValue("@Email", solicitante.Email ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@Telefono", solicitante.Telefono ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@IdCliente", solicitante.IdCliente);

            conn.Open();

            object resultado = cmd.ExecuteScalar();

            return true;
        


        }

        public async Task<ActionResult> ModificarSolicitante(Solicitante solicitante)
        {
            try
            {
                string connString =
                _config.GetConnectionString("GesComDemo");

                using SqlConnection conn =
                    new SqlConnection(connString);
                {
                    await conn.OpenAsync();

                    using (SqlCommand command = new SqlCommand(
                        "AppData.spModificarSolicitante",
                        conn))
                    {
                        command.CommandType = CommandType.StoredProcedure;


                        command.Parameters.AddWithValue("@Id", solicitante.Id);
                        command.Parameters.AddWithValue("@Nombre", solicitante.Nombre);
                        command.Parameters.AddWithValue("@IdCliente", solicitante.IdCliente);
                        command.Parameters.AddWithValue("@Telefono",
                            (object?)solicitante.Telefono ?? DBNull.Value);

                        command.Parameters.AddWithValue("@Email",
                            (object?)solicitante.Email ?? DBNull.Value);


                        command.ExecuteNonQueryAsync();
                        
                            }

                    
                        }
                    
                
        return new OkResult();
    }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(ex.Message);
}
        }

        public async Task<ActionResult> EliminarSolicitante(long id)
        {
            try
            {
                string connString =
                _config.GetConnectionString("GesComDemo");

                using SqlConnection conn =
                    new SqlConnection(connString);
                {
                    await conn.OpenAsync();

                    using (SqlCommand command = new SqlCommand(
                        "AppData.spEliminarSolicitante",
                        conn))
                    {
                        command.CommandType = CommandType.StoredProcedure;


                        command.Parameters.AddWithValue("@Id", id);



                        using (SqlDataReader reader =
                            await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                bool ok = reader.GetBoolean(
                                    reader.GetOrdinal("OK")
                                );

                                string mensaje = reader.GetString(
                                    reader.GetOrdinal("MENSAJE")
                                );


                                if (ok)
                                {
                                    return new OkObjectResult(new
                                    {
                                        ok = true,
                                        mensaje
                                    });
                                }


                                return new BadRequestObjectResult(new
                                {
                                    ok = false,
                                    mensaje
                                });
                            }
                        }
                    }
                }


                return new BadRequestObjectResult(
                    "No se pudo eliminar el solicitante"
                );
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(ex.Message);
            }
        }
    }
}
