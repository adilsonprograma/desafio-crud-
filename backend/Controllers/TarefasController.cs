using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TarefasController : ControllerBase
{
    private readonly AppDbContext _context;

    public TarefasController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Tarefa>>> GetTarefas()
    {
        var tarefas = await _context.Tarefas
            .AsNoTracking()
            .OrderByDescending(t => t.DataCriacao)
            .ToListAsync();

        return Ok(tarefas);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Tarefa>> GetTarefa(int id)
    {
        var tarefa = await _context.Tarefas
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == id);

        if (tarefa is null)
        {
            return NotFound(new { mensagem = "Tarefa nao encontrada." });
        }

        return Ok(tarefa);
    }

    [HttpPost]
    public async Task<ActionResult<Tarefa>> PostTarefa([FromBody] CreateTarefaRequest request)
    {
        var tarefa = new Tarefa
        {
            Titulo = request.Titulo.Trim(),
            Descricao = (request.Descricao ?? string.Empty).Trim(),
            Status = TarefaStatus.Pendente,
            DataCriacao = DateTime.UtcNow
        };

        _context.Tarefas.Add(tarefa);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTarefa), new { id = tarefa.Id }, tarefa);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<Tarefa>> PutTarefa(int id, [FromBody] UpdateTarefaRequest request)
    {
        var tarefa = await _context.Tarefas.FirstOrDefaultAsync(t => t.Id == id);

        if (tarefa is null)
        {
            return NotFound(new { mensagem = "Tarefa nao encontrada." });
        }

        if (!TarefaStatus.TryNormalize(request.Status, out var statusNormalizado))
        {
            return BadRequest(new { mensagem = "Status invalido. Use Pendente ou Concluida." });
        }

        tarefa.Titulo = request.Titulo.Trim();
        tarefa.Descricao = (request.Descricao ?? string.Empty).Trim();
        tarefa.Status = statusNormalizado;

        await _context.SaveChangesAsync();

        return Ok(tarefa);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTarefa(int id)
    {
        var tarefa = await _context.Tarefas.FirstOrDefaultAsync(t => t.Id == id);

        if (tarefa is null)
        {
            return NotFound(new { mensagem = "Tarefa nao encontrada." });
        }

        _context.Tarefas.Remove(tarefa);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
