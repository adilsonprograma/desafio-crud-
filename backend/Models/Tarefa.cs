using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class Tarefa
{
    public int Id { get; set; }

    [Required]
    [MinLength(3)]
    [MaxLength(120)]
    public string Titulo { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Descricao { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = TarefaStatus.Pendente;

    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
}
