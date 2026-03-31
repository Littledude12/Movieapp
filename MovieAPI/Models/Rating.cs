namespace MovieAPI.Models;
public class Rating
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int ExternalMovieId { get; set; }
    public int Score { get; set; }

    
}