using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TodoApi.Model
{
    public class Ranking
    {
        public int Id_user { get; set; }
        public int Id_game { get; set; }
        public int Score { get; set; }
    }

    public class RankingGame
    {

        public int Id_user { get; set; }
        public string Username { get; set; }
        public string name { get; set; }
        public int Score { get; set; }
    }
}
