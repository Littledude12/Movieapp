using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieAPI.Context;
using MovieAPI.Models;
using System.Security.Claims;

namespace MovieAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WantToWatchController : ControllerBase
{
    private readonly MovieDbContext _context;

    public WantToWatchController(MovieDbContext context)
    {
        _context = context;
    }
    

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> AddMovieToWantToWatch([FromBody] AddToWatchList dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        var userId = int.Parse(userIdClaim.Value);

        var alreadyExists = await _context.WantToWatchMovies.AnyAsync(movie =>
            movie.UserId == userId &&
            movie.ExternalMovieId == dto.ExternalMovieId);

        if (alreadyExists)
        {
            return BadRequest(new { message = "Movie already in watchlist" });
        }

        var wantToWatch = new WantToWatch
        {
            UserId = userId,
            ExternalMovieId = dto.ExternalMovieId
        };

        _context.WantToWatchMovies.Add(wantToWatch);
        await _context.SaveChangesAsync();

        return Ok(wantToWatch);
    }



    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetWantToWatch()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        var userId = int.Parse(userIdClaim.Value);

        var list = await _context.WantToWatchMovies
            .Where(movie => movie.UserId == userId)
            .ToListAsync();

        return Ok(list);
    }



    [Authorize]
    [HttpDelete("{externalMovieId}")]
    public async Task<IActionResult> RemoveMovieFromWantToWatch(int externalMovieId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        var userId = int.Parse(userIdClaim.Value);

        var movieToRemove = await _context.WantToWatchMovies.FirstOrDefaultAsync(movie =>
            movie.UserId == userId &&
            movie.ExternalMovieId == externalMovieId);

        if (movieToRemove == null)
        {
            return NotFound("Couldnt find that movie.");
        }

        _context.WantToWatchMovies.Remove(movieToRemove);
        await _context.SaveChangesAsync();

        return NoContent();
    }


}