# Movie App

En webapp inspirert av IMDb.

## Funksjonalitet

- Registrering og innlogging (JWT)
- Søke etter filmer 
- Se detaljer om filmer
- Legge til/fjerne favoritter
- Legge til/fjerne watchlist
- Rate filmer

## Stack

Frontend:
- React + TypeScript
- Axios
- Bootstrap

Backend:
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL

### Eksternt API
- TMDB (The Movie Database)

---

## Screenshots

### Home
![Home](https://github.com/user-attachments/assets/a79c2aba-d431-45a4-9709-7e0770236451)

### Search
![Search](https://github.com/user-attachments/assets/dfc57c18-5749-4a4e-8c4c-210e9cd433e9)

### Movie Details
![Movie Details](https://github.com/user-attachments/assets/0570a7cf-b22a-4bf4-bda3-800ece4542b5)

### Favorites
![Favorites](https://github.com/user-attachments/assets/8b56e10d-9a05-4187-9169-339d960f09d1)

### Watchlist
![Watchlist](https://github.com/user-attachments/assets/dcae8a70-84bd-4676-ba8b-32190647760d)

### Ratings
![Ratings](https://github.com/user-attachments/assets/2a14045c-a110-43d7-8c48-79f4d5aaad7a)


## Hvordan kjøre prosjektet

### Backend
- cd MovieAPI
- Kjør:
dotnet run

### Frontend
- cd movie-app
- Kjør:
npm install
npm run dev

## Merk

Prosjektet bruker en lokal PostgreSQL-database. For å kjøre applikasjonen må du opprette en egen database og legge inn riktig connection string i `appsettings.json`.

