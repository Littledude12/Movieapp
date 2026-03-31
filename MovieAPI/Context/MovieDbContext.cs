using Microsoft.EntityFrameworkCore;
using MovieAPI.Models;

namespace MovieAPI.Context;

public class MovieDbContext(DbContextOptions<MovieDbContext> options) : DbContext (options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<Favorite> Favorites { get; set; }
    public DbSet<Rating> Ratings { get; set; }
    public DbSet<WatchedMovie> WatchedMovies { get; set; }
    public DbSet<WantToWatch> WantToWatchMovies { get; set; }

}