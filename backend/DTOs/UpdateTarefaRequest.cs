using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public class UpdateTarefaRequest
{
    [Required]
    [MinLength(3)]
    [MaxLength(120)]
    public string Titulo { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Descricao { get; set; } = string.Empty;

    [Required]
    public string Status { get; set; } = string.Empty;
}
