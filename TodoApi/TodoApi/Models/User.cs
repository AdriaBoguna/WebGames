using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TodoApi.Model
{
    public class User
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int Id_city { get; set; }
        public string Profile { get; set; }
    }

    public class UserId : User
    {
        public int Id_user { get; set; }
    }
}
