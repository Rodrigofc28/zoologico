/*
*
*   Desenvolvido por Rodrigo de Freitas Camargo
*
*/
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp2.Server.Data; // Namespace onde está o AppDbContext
using ReactApp2.Server.Dtos;

using ReactApp2.Server.Models; // Namespace do modelo Animal


namespace ReactApp2.Server.Controllers
{
[ApiController]
[Route("api/[controller]")]
public class AnimalsController : ControllerBase
{
    private readonly AppDbContext _context;
    
    private readonly string _uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");//salva a imagem no diretorio raiz
    
    public AnimalsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
public async Task<ActionResult<IEnumerable<object>>> Get()
{
    try
    {
        var baseUrl = $"{Request.Scheme}://{Request.Host}/uploads/";

        var animais = await _context.Animais
            .Select(a => new
            {
                a.Id,
                a.Nome,
                a.Descricao,
                a.DataNascimento,
                a.Especie,
                a.Habitat,
                a.PaisOrigem,
                imagem = string.IsNullOrEmpty(a.Imagem) ? null : baseUrl + a.Imagem
            })
            .ToListAsync();

        return Ok(animais);
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Erro ao tentar recuperar os dados: {ex.Message}");
    }
}



            // Método POST para cadastrar um novo animal
  
       [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Post([FromForm] AnimalDto dto, [FromForm] IFormFile imagem, [FromForm] Animal animal)
        {
            try
            {
                if (imagem != null && imagem.Length > 0)
                {
                    // Garante que a pasta de upload existe
                    if (!Directory.Exists(_uploadFolder))
                        Directory.CreateDirectory(_uploadFolder);

                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(imagem.FileName);
                    var filePath = Path.Combine(_uploadFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await imagem.CopyToAsync(stream);
                    }

                    // Salva apenas o nome do arquivo ou caminho relativo
                    animal.Imagem = fileName;
                }

                _context.Animais.Add(animal);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(Get), new { id = animal.Id }, animal);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { erro = ex.Message });
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
[Consumes("multipart/form-data")]
public async Task<IActionResult> Put(int id,[FromForm] AnimalDto dto, [FromForm] Animal animal, [FromForm] IFormFile? imagem)
{
    if (id != animal.Id)
        return BadRequest(new { erro = "ID do animal não confere com o ID fornecido na URL." });

    var animalExistente = await _context.Animais.FindAsync(id);
    if (animalExistente == null)
        return NotFound(new { erro = "Animal não encontrado." });

    // Atualiza os campos básicos
    animalExistente.Nome = animal.Nome;
    animalExistente.Descricao = animal.Descricao;
    animalExistente.DataNascimento = animal.DataNascimento;
    animalExistente.Especie = animal.Especie;
    animalExistente.Habitat = animal.Habitat;
    animalExistente.PaisOrigem = animal.PaisOrigem;

    // Atualiza a imagem se for enviada uma nova
    if (imagem != null && imagem.Length > 0)
    {
        if (!Directory.Exists(_uploadFolder))
            Directory.CreateDirectory(_uploadFolder);

        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(imagem.FileName);
        var filePath = Path.Combine(_uploadFolder, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await imagem.CopyToAsync(stream);
        }

        animalExistente.Imagem = fileName;
    }

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



