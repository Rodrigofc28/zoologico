/*
*
*   Desenvolvido por Rodrigo de Freitas Camargo
*
*/
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp2.Server.Data; // Namespace onde está o AppDbContext
using ReactApp2.Server.Models; // Namespace do modelo Animal


namespace ReactApp2.Server.Controllers
{
[ApiController]
[Route("api/[controller]")]
public class AnimalsController : ControllerBase
{
    private readonly AppDbContext _context;

    public AnimalsController(AppDbContext context)
    {
        _context = context;
    }

    // Método GET para buscar todos os animais
       [HttpGet]
        public async Task<ActionResult<IEnumerable<Animal>>> Get()
        {
            try
            {
                // Obtenha os animais do banco de dados
                var animais = await _context.Animais.ToListAsync();

                // Retorna a lista de animais no formato JSON (o retorno padrão do Ok() já é JSON)
                return Ok(animais); // Retorna status 200 com os dados em JSON
            }
            catch (Exception ex)
            {
                // Caso haja algum erro, retorna status 500 com a mensagem do erro
                return StatusCode(500, $"Erro ao tentar recuperar os dados: {ex.Message}");
            }
        }


            // Método POST para cadastrar um novo animal
  
        [HttpPost]
        public async Task<ActionResult<Animal>> Post(Animal animal)
        {
            try
            {
                _context.Animais.Add(animal);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(Get), new { id = animal.Id }, animal); // Isso retorna JSON do animal salvo
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erro = ex.Message }); // Também retorna JSON de erro
            }
        }
        // DELETE: api/animals/{id}
    // Método DELETE
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var animal = await _context.Animais.FindAsync(id);
        if (animal == null)
        {
            return NotFound(new { erro = "Animal não encontrado" });
        }

        _context.Animais.Remove(animal);
        await _context.SaveChangesAsync();

        return Ok(new { mensagem = "Animal removido com sucesso" });
    }


// PUT: api/animals/{id}
// Método para editar um animal
[HttpPut("{id}")]
public async Task<IActionResult> Put(int id, Animal animal)
{
    if (id != animal.Id)
    {
        return BadRequest(new { erro = "ID do animal não confere com o ID fornecido na URL." });
    }

    var animalExistente = await _context.Animais.FindAsync(id);
    if (animalExistente == null)
    {
        return NotFound(new { erro = "Animal não encontrado." });
    }

    // Atualiza os campos
    animalExistente.Nome = animal.Nome;
    animalExistente.Descricao = animal.Descricao;
    animalExistente.DataNascimento = animal.DataNascimento;
    animalExistente.Especie = animal.Especie;
    animalExistente.Habitat = animal.Habitat;
    animalExistente.PaisOrigem = animal.PaisOrigem;

    try
    {
        await _context.SaveChangesAsync();
        return Ok(new { mensagem = "Animal atualizado com sucesso." });
    }
    catch (DbUpdateException ex)
    {
        return StatusCode(500, new { erro = "Erro ao atualizar animal: " + ex.Message });
    }
}


        }
}



