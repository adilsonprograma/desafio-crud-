using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Tarefa> Tarefas => Set<Tarefa>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var tarefa = modelBuilder.Entity<Tarefa>();

        tarefa.ToTable("Tarefas");
        tarefa.HasKey(x => x.Id);

        tarefa.Property(x => x.Titulo)
            .HasMaxLength(120)
            .IsRequired();

        tarefa.Property(x => x.Descricao)
            .HasMaxLength(500);

        tarefa.Property(x => x.Status)
            .HasMaxLength(20)
            .IsRequired()
            .HasDefaultValue(TarefaStatus.Pendente);

        tarefa.Property(x => x.DataCriacao)
            .HasDefaultValueSql("GETUTCDATE()");
    }
}
