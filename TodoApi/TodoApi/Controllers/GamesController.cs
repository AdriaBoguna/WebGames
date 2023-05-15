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
    /// Controlador para Games
    /// </summary>
    /// 
    [Route("api/[controller]")]
    [ApiController]
    public class GamesController : ControllerBase
    {
        private readonly GameRepository gameRepository;
        public GamesController(GameRepository gameRepository)
        {

            this.gameRepository = gameRepository;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllGames()
        {
            return Ok(await gameRepository.GetAllGames());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetGameDetails(int id)
        {
            return Ok(await gameRepository.GetGameDetails(id));
        }

        [HttpPost]
        public async Task<IActionResult> CreateGame([FromBody] Game game)
        {
            if (game == null)
            {
                return BadRequest();


            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var created = await gameRepository.InsertGame(game);
            return Created("Creado!", created);
        }


        [HttpPut]
        public async Task<IActionResult> UpdateGame([FromBody] Game game)
        {
            if (game == null)
            {
                return BadRequest();


            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updated = await gameRepository.UpdateGame(game);
            return Created("Actualizado!", updated);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGame(int id)
        {
            var deleted = await gameRepository.DeleteGame(new Game { Id_game = id });
            return Created("Eliminado!", deleted);
        }
    }
}