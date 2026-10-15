namespace Simulator.Api.Models.Domains;

public enum DrawMode
{
    /// <summary>Sorteggio puro, indipendente dalle sessioni precedenti.</summary>
    Random,

    /// <summary>Prima le unita' proposte meno volte nelle sessioni salvate.</summary>
    LeastSeen,
}
