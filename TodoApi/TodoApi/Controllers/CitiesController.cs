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
    public class CitiesController : ControllerBase
    {
        private readonly CityRepository cityRepository;
        public CitiesController(CityRepository cityRepository)
        {

            this.cityRepository = cityRepository;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllCities()
        {
            return Ok(await cityRepository.GetAllCities());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCityDetails(int id)
        {
            return Ok(await cityRepository.GetCityDetails(id));
        }

        [HttpPost]
        public async Task<IActionResult> CreateCity([FromBody] City city)
        {
            if (city == null)
            {
                return BadRequest();


            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var created = await cityRepository.InsertCity(city);
            return Created("Creado!", created);
        }


        [HttpPut]
        public async Task<IActionResult> UpdateCity([FromBody] City city)
        {
            if (city == null)
            {
                return BadRequest();


            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updated = await cityRepository.UpdateCity(city);
            return Created("Actualizado!", updated);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCity(int id)
        {


            var deleted = await cityRepository.DeleteCity(new City { Id_city = id });
            return Created("Eliminado!", deleted);
        }
    }
}