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

    public class RankingRepository
    {
        private PosgreSQLConfig connexionString;
        public RankingRepository(PosgreSQLConfig connectionString)
        {
            this.connexionString = connectionString;
        }

        protected NpgsqlConnection dbConnection()
        {
            return new NpgsqlConnection(connexionString.ConnectionString);
        }

        public async Task<IEnumerable<Ranking>> GetAllRankings()
        {
            var db = dbConnection();

            var sql = @"
                        SELECT id_user, id_game, score
                            FROM public.ranking
                        ";

            return await db.QueryAsync<Ranking>(sql, new { });

        }

        //public async Task<Ranking> GetRankingDetails(int id, int id_user)
        //{
        //    var db = dbConnection();

        //    var sql = @"
        //                SELECT id_user, id_game, score
        //                    FROM public.ranking
        //                    WHERE @Id_Game = id_game AND @Id_User = id_user;
        //                ";

        //    return await db.QueryFirstOrDefaultAsync<Ranking>(sql, new { Id_Game = id, Id_User = id_user});
        //}

        public async Task<bool> InsertRanking(Ranking ranking)
        {
            var db = dbConnection();

            var sql = @"
                        INSERT INTO public.ranking (id_user, id_game, score)
                        VALUES (@Id_user, @Id_game, @Score)
                        "
            ;

            var result = await db.ExecuteAsync(sql, new {ranking.Id_user, ranking.Id_game, ranking.Score });
            return result > 0;
        }

        public async Task<bool> UpdateRanking(Ranking ranking)
        {
            var db = dbConnection();

            var sql = @"
                        UPDATE public.ranking
                        SET score = @Score
                        WHERE @Id_user = id_user AND @Id_game = id_game;
                        ";

            var result = await db.ExecuteAsync(sql, new { ranking.Score, ranking.Id_user, ranking.Id_game});
            return result > 0;
        }

        public async Task<bool> DeleteRanking(Ranking ranking)
        {
            var db = dbConnection();

            var sql = @"
                        DELETE FROM public.ranking
                        WHERE id_user = @Id_user AND id_game = @Id_game;
                        ";

            var result = await db.ExecuteAsync(sql, new { Id_Game = ranking.Id_game, Id_User = ranking.Id_user });
            return result > 0;
        }

        public async Task<IEnumerable<RankingGame>> GetRankingInfo(int id_game)
        {
            var db = dbConnection();

            var sql = @$"
                        SELECT * FROM ""game{id_game}"";
                        ";

            return await db.QueryAsync<RankingGame>(sql, new { });

        }
    }
}