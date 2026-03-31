namespace MovieAPI.DTOs;

public class CreateOrUpdateRatingDto
{
    public int ExternalMovieId { get; set; }
    public int Score { get; set; }
}