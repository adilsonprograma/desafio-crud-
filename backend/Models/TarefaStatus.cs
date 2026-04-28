namespace Backend.Models;

public static class TarefaStatus
{
    public const string Pendente = "Pendente";
    public const string Concluida = "Concluida";

    public static bool TryNormalize(string? rawStatus, out string normalizedStatus)
    {
        if (string.IsNullOrWhiteSpace(rawStatus))
        {
            normalizedStatus = Pendente;
            return true;
        }

        var value = rawStatus.Trim();

        if (value.Equals(Pendente, StringComparison.OrdinalIgnoreCase))
        {
            normalizedStatus = Pendente;
            return true;
        }

        if (value.Equals(Concluida, StringComparison.OrdinalIgnoreCase) ||
            value.Equals("Conclu\u00EDda", StringComparison.OrdinalIgnoreCase))
        {
            normalizedStatus = Concluida;
            return true;
        }

        normalizedStatus = string.Empty;
        return false;
    }
}
