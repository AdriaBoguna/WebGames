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

    public class GameRepository
    {
        private PosgreSQLConfig connexionString;
        public GameRepository(PosgreSQLConfig connectionString)
        {
            this.connexionString = connectionString;
        }

        protected NpgsqlConnection dbConnection()
        {
            return new NpgsqlConnection(connexionString.ConnectionString);
        }

        public async Task<IEnumerable<Game>> GetAllGames()
        {
            var db = dbConnection();

            var sql = @"
                        SELECT id_game, game_name
                            FROM public.games
                        ";

            return await db.QueryAsync<Game>(sql, new { });

        }

        public async Task<Game> GetGameDetails(int id)
        {
            var db = dbConnection();

            var sql = @"
                        SELECT id_game, game_name
                            FROM public.games
                            WHERE id_game = @Id_game
                        ";

            return await db.QueryFirstOrDefaultAsync<Game>(sql, new { Id_game = id });
        }

        public async Task<bool> InsertGame(Game game)
        {
            var db = dbConnection();

            var sql = @"
                        INSERT INTO public.games ( id_game, game_name )
                        VALUES (@Id_game, @Game_name)
                        "
            ;

            var result = await db.ExecuteAsync(sql, new { game.Id_game, game.Game_name });
            return result > 0;
        }

        public async Task<bool> UpdateGame(Game game)
        {
            var db = dbConnection();

            var sql = @"
                        UPDATE CASCADE public.games
                        SET game_name = @Game_name
                        WHERE id_game = @Id_game;
                        ";

            var result = await db.ExecuteAsync(sql, new { game.Game_name, game.Id_game });
            return result > 0;
        }

        public async Task<bool> DeleteGame(Game game)
        {
            var db = dbConnection();

            var sql = @"
                        DELETE FROM public.games
                        WHERE id_game = @Id_game
                        ";

            var result = await db.ExecuteAsync(sql, new { Id_game = game.Id_game });
            return result > 0;
        }
    }
}