using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieAPI.Context;
using MovieAPI.Models;

namespace MovieAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WatchedController : ControllerBase
{
    private readonly MovieDbContext _context;

    public WatchedController(MovieDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> AddWatched(WatchedMovie watched)
    {
        var exists = await _context.WatchedMovies.AnyAsync(w =>
            watched.UserId == watched.UserId &&
            watched.ExternalMovieId == watched.ExternalMovieId);

        if (exists)
        {
            return BadRequest("Already marked as watched.");
        }

        _context.WatchedMovies.Add(watched);
        await _context.SaveChangesAsync();

        return Ok(watched);
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetWatched(int userId)
    {
        var watched = await _context.WatchedMovies
            .Where(watched => watched.UserId == userId)
            .ToListAsync();

        return Ok(watched);
    }

    [HttpDelete]
    public async Task<IActionResult> RemoveWatched(int userId, int externalMovieId)
    {
        var watched = await _context.WatchedMovies.FirstOrDefaultAsync(watched =>
            watched.UserId == userId &&
            watched.ExternalMovieId == externalMovieId);

        if (watched == null)
        {
            return NotFound("Not found.");
        }

        _context.WatchedMovies.Remove(watched);
        await _context.SaveChangesAsync();

        return Ok("Removed.");
    }
}