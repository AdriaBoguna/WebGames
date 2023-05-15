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
    public class RankingsController : ControllerBase
    {
        private readonly RankingRepository rankingRepository;
        public RankingsController(RankingRepository rankingRepository)
        {

            this.rankingRepository = rankingRepository;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllRankings()
        {
            return Ok(await rankingRepository.GetAllRankings());
        }

        [HttpGet("{id_game}")]
        public async Task<IActionResult> GetRankingInfo(int id_game)
        {
            return Ok(await rankingRepository.GetRankingInfo(id_game));
        }

        [HttpPost]
        public async Task<IActionResult> CreateRanking([FromBody] Ranking ranking)
        {
            if (ranking == null)
            {
                return BadRequest();


            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var created = await rankingRepository.InsertRanking(ranking);
            return Created("Creado!", created);
        }


        [HttpPut]
        public async Task<IActionResult> UpdateRanking([FromBody] Ranking ranking)
        {
            if (ranking == null)
            {
                return BadRequest();


            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updated = await rankingRepository.UpdateRanking(ranking);
            return Created("Actualizado!", updated);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRanking(int id_game, int id_user)
        {


            var deleted = await rankingRepository.DeleteRanking(new Ranking { Id_game = id_game, Id_user = id_user });
            return Created("Eliminado!", deleted);
        }


    }
}
