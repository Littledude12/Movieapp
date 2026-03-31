using MovieAPI.Models;

public class User
{
    public int Id {get; set;}
    public string Username {get; set;} = string.Empty;
    public string Email {get; set;} = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public List<Rating> Ratings { get; set; } = new();
    public List<Favorite> Favorites { get; set; } = new();
    public List<WatchedMovie> WatchedMovies { get; set; } = new();
    public List<WantToWatch> WantToWatchMovies { get; set; } = new();

}