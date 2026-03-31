using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieAPI.Context;
using MovieAPI.Models;
using System.Security.Claims;



namespace MovieAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FavoriteMovieController : ControllerBase
{
    private readonly MovieDbContext _context;

    public FavoriteMovieController(MovieDbContext context)
    {
        _context = context;
    }


    [Authorize]
    [HttpPost]
    public async Task<IActionResult> AddFavorite([FromBody] CreateFavoriteDto dto)
    {
    var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
    
    var exits = await _context.Favorites.AnyAsync(fav =>
        fav.UserId == userId &&
        fav.ExternalMovieId == dto.ExternalMovieId);

    if (exits)    {
        return BadRequest(new { message = "Movie already in favorites" }); 
    }

    var favorite = new Favorite
    {
        UserId = userId, 
        ExternalMovieId = dto.ExternalMovieId
    };

    

    _context.Favorites.Add(favorite);
    await _context.SaveChangesAsync();

    return Ok(favorite);
    }


    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetFavorites()
    {
        var userIdValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdValue == null)
            {
                return Unauthorized("Invalid user ID.");
            }

           var userId = int.Parse(userIdValue);

           var favorites = await _context.Favorites
               .Where(fav => fav.UserId == userId)
               .ToListAsync();

        return Ok(favorites);
    }
    

    [Authorize]
    [HttpDelete("{externalMovieId}")]
    public async Task<IActionResult> RemoveFavorite(int externalMovieId)
    {
    var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

    var favorite = await _context.Favorites.FirstOrDefaultAsync(fav =>
        fav.UserId == userId &&
        fav.ExternalMovieId == externalMovieId);

    if (favorite == null)
    {
        return NotFound("Movie not found.");
    }

    _context.Favorites.Remove(favorite);
    await _context.SaveChangesAsync();

    return NoContent();
    }
}