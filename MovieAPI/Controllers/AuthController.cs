using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MovieAPI.Context;
using MovieAPI.DTOs;
using MovieAPI.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MovieAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly MovieDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(MovieDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }



    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var userAlreadyExists = await _context.Users.AnyAsync(user => user.Email == dto.Email);

        if (userAlreadyExists)
        {
            return BadRequest("User with this email already exists.");
        }

        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            user.Id,
            user.Username,
            user.Email
        });
    }


    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {   
        // Finner bruker basert på email
        var user = await _context.Users.FirstOrDefaultAsync(user => user.Email == dto.Email);

        if (user == null)
        {
            return BadRequest("Invalid email or password.");
        }

        // Sjekker om passord matcher det som er lagret i databasen
        var passwordIsCorrect = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

        if (!passwordIsCorrect)
        {
            return BadRequest("Invalid email or password.");
        }

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email)
        };
        
        // Henter secret key fra appsettings.json
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)
        );

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Lager selve JWT tokenet
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: creds
        );


        var jwt = new JwtSecurityTokenHandler().WriteToken(token);
        
        // Returnerer token og brukerinfo til frontend
        return Ok(new
        {
            token = jwt,
            userId = user.Id,
            username = user.Username,
            email = user.Email
        });

    }
}