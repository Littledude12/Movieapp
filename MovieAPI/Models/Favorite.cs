namespace MovieAPI.Models;

public class Favorite
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int ExternalMovieId { get; set; }
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;

    
}