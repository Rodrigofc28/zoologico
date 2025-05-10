/*
*
*   Desenvolvido por Rodrigo de Freitas Camargo
*
*/
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReactApp2.Server.Models
{
    public class Cuidado
    {
        public int Id { get; set; }

        [Required]
        public string NomeCuidado { get; set; } = string.Empty;

        public string? Descricao { get; set; }

        [Required]
        public string Frequencia { get; set; } = string.Empty;

        // Chave estrangeira
        public int AnimalId { get; set; }

        [ForeignKey("AnimalId")]
        public Animal? Animal { get; set; }
    }
}
