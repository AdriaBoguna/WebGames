using Dapper;
using Npgsql;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Xml.Linq;
using TodoApi.Model;
using TodoApi.Models;


namespace TodoApi.Data.Repositories
{
    /// <summary>
    /// Clase Car que contiene todos los métodos SQL querys
    /// </summary>

    public class CityRepository
    {
        private PosgreSQLConfig connexionString;
        public CityRepository(PosgreSQLConfig connectionString)
        {
            this.connexionString = connectionString;
        }

        protected NpgsqlConnection dbConnection()
        {
            return new NpgsqlConnection(connexionString.ConnectionString);
        }

        public async Task<IEnumerable<City>> GetAllCities()
        {
            var db = dbConnection();

            var sql = @"
                        SELECT id_city, name, latitude, longitude
                            FROM public.cities
                            
                        ";

            return await db.QueryAsync<City>(sql, new { });

        }

        public async Task<City> GetCityDetails(int id)
        {
            var db = dbConnection();

            var sql = @"
                        SELECT id_city, name, latitude, longitude
                            FROM public.cities
                            WHERE id_city = @Id_city
                        ";

            return await db.QueryFirstOrDefaultAsync<City>(sql, new { Id_city = id });
        }

        public async Task<bool> InsertCity(City city)
        {
            var db = dbConnection();

            var sql = @"
                        INSERT INTO public.cities (name, latitude, longitude)
                        VALUES (@Name, @Latitude, @Longitude)
                        "
            ;

            var result = await db.ExecuteAsync(sql, new {city.Name, city.Latitude, city.Longitude });
            return result > 0;
        }

        public async Task<bool> UpdateCity(City city)
        {
            var db = dbConnection();

            var sql = @"
                        UPDATE public.cities
                        SET name = @Name,
                            latitude  =  @Latitude,
                            longitude = @Longitude,
                        WHERE id_city = @Id_city;
                        ";

            var result = await db.ExecuteAsync(sql, new { city.Id_city, city.Name, city.Latitude, city.Longitude });
            return result > 0;
        }

        public async Task<bool> DeleteCity(City city)
        {
            var db = dbConnection();

            var sql = @"
                        DELETE FROM public.cities
                        WHERE id_city = @Id_city
                            
                        ";

            var result = await db.ExecuteAsync(sql, new { Id_city = city.Id_city });
            return result > 0;
        }


    }
}

