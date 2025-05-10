/*
*
*   Desenvolvido por Rodrigo de Freitas Camargo
*
*/


using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp2.Server.Data; // Contexto do banco de dados
using ReactApp2.Server.Models; // Modelo Cuidado

namespace ReactApp2.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CuidadoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CuidadoController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cuidado>>> Get()
        {
            try
            {
                var cuidados = await _context.Cuidados.ToListAsync();
                return Ok(cuidados);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao tentar recuperar os dados: {ex.Message}");
            }
        }

        [HttpGet("lista/{animalId}")]
        public async Task<IActionResult> GetCuidadosPorAnimal(int animalId)
        {
            var cuidados = await _context.Cuidados
                .Where(c => c.AnimalId == animalId)
                .ToListAsync();

            if (cuidados == null || !cuidados.Any())
            {
                return NotFound();
            }

            return Ok(cuidados);
        }


        [HttpPost]
        public async Task<ActionResult<Cuidado>> Post([FromBody] Cuidado cuidado)
        {
            try
            {
                _context.Cuidados.Add(cuidado);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(Get), new { id = cuidado.Id }, cuidado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erro = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Cuidado cuidado)
        {
            if (id != cuidado.Id)
            {
                return BadRequest(new { erro = "ID do cuidado não confere com o ID fornecido na URL." });
            }

            var cuidadoExistente = await _context.Cuidados.FindAsync(id);

            if (cuidadoExistente == null)
            {
                return NotFound(new { erro = "Cuidado de  animal não encontrado." });
            }

            cuidadoExistente.NomeCuidado = cuidado.NomeCuidado;
            cuidadoExistente.Descricao = cuidado.Descricao;
            cuidadoExistente.Frequencia = cuidado.Frequencia;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { mensagem = "Cuidado de animal atualizado com sucesso." });
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, new { erro = "Erro ao atualizar cuidado de animal: " + ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var cuidado = await _context.Cuidados.FindAsync(id);
            if (cuidado == null)
            {
                return NotFound(new { erro = "Cuidado de animal não encontrado." });
            }

            _context.Cuidados.Remove(cuidado);
            await _context.SaveChangesAsync();

            return Ok(new { mensagem = "Cuidado de animal removido com sucesso." });
        }
    }
}


