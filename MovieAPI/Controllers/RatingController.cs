using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieAPI.Context;
using MovieAPI.DTOs;
using MovieAPI.Models;
using System.Security.Claims;

namespace MovieAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RatingController : ControllerBase
{
    private readonly MovieDbContext _context;

    public RatingController(MovieDbContext context)
    {
        _context = context;
    }


    [Authorize]
    [HttpPost]
    public async Task<IActionResult> AddRating([FromBody] CreateOrUpdateRatingDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        var userId = int.Parse(userIdClaim.Value);

        if (dto.Score < 1 || dto.Score > 10)
        {
            return BadRequest("Score must be between 1 and 10.");
        }

        var ratingAlreadyExists = await _context.Ratings.AnyAsync(r =>
            r.UserId == userId &&
            r.ExternalMovieId == dto.ExternalMovieId);

        if (ratingAlreadyExists)
        {
            return BadRequest("You have already rated this movie.");
        }

        var rating = new Rating
        {
            UserId = userId,
            ExternalMovieId = dto.ExternalMovieId,
            Score = dto.Score
        };

        _context.Ratings.Add(rating);
        await _context.SaveChangesAsync();

        return Ok(rating);
    }


    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetRatings()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        var userId = int.Parse(userIdClaim.Value);

        var ratings = await _context.Ratings
            .Where(r => r.UserId == userId)
            .ToListAsync();

        return Ok(ratings);
    }


    [Authorize]
    [HttpPut]
    public async Task<IActionResult> UpdateRating([FromBody] CreateOrUpdateRatingDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        var userId = int.Parse(userIdClaim.Value);

        if (dto.Score < 1 || dto.Score > 10)
        {
            return BadRequest("Score must be between 1 and 10.");
        }

        var ratingToUpdate = await _context.Ratings.FirstOrDefaultAsync(r =>
            r.UserId == userId &&
            r.ExternalMovieId == dto.ExternalMovieId);

        if (ratingToUpdate == null)
        {
            return NotFound("Rating not found.");
        }

        ratingToUpdate.Score = dto.Score;
        await _context.SaveChangesAsync();

        return Ok(ratingToUpdate);
    }


    [Authorize]
    [HttpDelete("{externalMovieId}")]
    public async Task<IActionResult> RemoveRating(int externalMovieId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        var userId = int.Parse(userIdClaim.Value);

        var ratingToRemove = await _context.Ratings.FirstOrDefaultAsync(r =>
            r.UserId == userId &&
            r.ExternalMovieId == externalMovieId);

        if (ratingToRemove == null)
        {
            return NotFound("Rating not found.");
        }

        _context.Ratings.Remove(ratingToRemove);
        await _context.SaveChangesAsync();

        return NoContent();
    }
    
}