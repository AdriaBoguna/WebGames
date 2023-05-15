using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Data.Repositories;
using TodoApi.Model;
using TodoApi.Models;

namespace TodoApi.Controllers
{
    /// <summary>
    /// Controlador para Cars
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserRepository userRepository;
        public UsersController(UserRepository userRepository)
        {

            this.userRepository = userRepository;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            return Ok(await userRepository.GetAllUsers());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserDetails(int id)
        {
            return Ok(await userRepository.GetUserDetails(id));
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] User user)
        {
            if (user == null)
            {
                return BadRequest();


            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var created = await userRepository.InsertUser(user);
            return Created("Creado!", created);
        }


        [HttpPut]
        public async Task<IActionResult> UpdateUser([FromBody] UserId user)
        {
            if (user == null)
            {
                return BadRequest();


            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updated = await userRepository.UpdateUser(user);
            return Created("Actualizado!", updated);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {


            var deleted = await userRepository.DeleteUser(new UserId { Id_user = id });
            return Created("Eliminado!", deleted);
        }
    }
}
