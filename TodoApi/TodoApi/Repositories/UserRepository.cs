
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
    
    public class UserRepository
    {
        private PosgreSQLConfig connexionString;
        public UserRepository(PosgreSQLConfig connectionString)
        {
            this.connexionString = connectionString;
        }

        protected NpgsqlConnection dbConnection()
        {
            return new NpgsqlConnection(connexionString.ConnectionString);
        }

        public async Task<IEnumerable<UserId>> GetAllUsers()
        {
            var db = dbConnection();

            var sql = @"
                        SELECT id_user, name, surname, username, email, password, id_city, profile
                            FROM public.users
                            
                        ";

            return await db.QueryAsync<UserId>(sql, new { });

        }

        public async Task<UserId> GetUserDetails(int id)
        {
            var db = dbConnection();

            var sql = @"
                        SELECT id_user, name, surname, username, email, password, id_city, profile
                            FROM public.users
                            WHERE id_user = @Id_user
                        ";

            return await db.QueryFirstOrDefaultAsync<UserId>(sql, new { Id_user = id });
        }

        public async Task<bool> InsertUser(User user)
        {
            var db = dbConnection();

            var sql = @"
                        INSERT INTO public.users (name, surname, username, email, password, id_city, profile )
                        VALUES (@Name, @Surname, @Username, @Email, @Password, @Id_city, @Profile )
                        "
            ;

            var result = await db.ExecuteAsync(sql, new { user.Name, user.Surname, user.Username, user.Email, user.Password, user.Id_city, user.Profile });
            return result > 0;
        }

        public async Task<bool> UpdateUser(UserId user)
        {
            var db = dbConnection();

            var sql = @"
                        UPDATE public.users
                        SET name = @Name,
                            surname  =  @Surname,
                            username = @Username,
                            email = @Email,
                            password = @Password,
                            id_city = @Id_city,
                            profile = @Profile
                        WHERE id_user = @Id_user;
                        ";

            var result = await db.ExecuteAsync(sql, new { Name = user.Name, Surname = user.Surname, Username = user.Username, Email = user.Email, Password = user.Password, Id_city = user.Id_city, Profile = user.Profile, Id_user = user.Id_user });
            return result > 0;
        }

        public async Task<bool> DeleteUser(UserId user)
        {
            var db = dbConnection();

            var sql = @"
                        DELETE FROM public.users
                        WHERE id_user = @Id_user
                            
                        ";

            var result = await db.ExecuteAsync(sql, new { Id_user = user.Id_user });
            return result > 0;
        }


    }
}
