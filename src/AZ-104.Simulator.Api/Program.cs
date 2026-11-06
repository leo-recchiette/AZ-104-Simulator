using Dapper;
using Microsoft.AspNetCore.Mvc;
using Simulator.Api.Repositories;
using Simulator.Api.Services;
using Simulator.Api.Services.Interfaces;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers().ConfigureApiBehaviorOptions(options =>
{
    // Come gli altri errori dell'API, testo semplice e non ProblemDetails: anche un campo required mancante
    // o un JSON che non si legge.
    options.InvalidModelStateResponseFactory = context => new BadRequestObjectResult(
        "richiesta non valida: " + string.Join(" ", context.ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));
});
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    // Nessuna auth e frontend su un'altra origine in sviluppo: da restringere con un dominio reale.
    options.AddDefaultPolicy(policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

// Le colonne snake_case si legano alle proprieta' PascalCase senza alias nell'SQL.
DefaultTypeMap.MatchNamesWithUnderscores = true;

var connectionString = builder.Configuration.GetConnectionString("Default")
    ?? throw new InvalidOperationException("Connection string 'Default' non configurata.");
// Factory e non istanza: cosi' e' il container a chiudere il pool alla fine dell'host.
builder.Services.AddSingleton(_ => NpgsqlDataSource.Create(connectionString));

builder.Services.AddScoped<IQuestionRepository, QuestionRepository>();
builder.Services.AddScoped<ICertificationRepository, CertificationRepository>();
builder.Services.AddScoped<ICertificationService, CertificationService>();
builder.Services.AddScoped<IQuestionService, QuestionService>();
builder.Services.AddScoped<IExamResultService, ExamResultService>();
builder.Services.AddScoped<IExamAttemptRepository, ExamAttemptRepository>();
builder.Services.AddScoped<IExamAttemptService, ExamAttemptService>();
builder.Services.AddScoped<IActiveSessionRepository, ActiveSessionRepository>();
builder.Services.AddScoped<IActiveSessionService, ActiveSessionService>();
builder.Services.AddSingleton<IScoreService, ScoreService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapGet("/", () => Results.Redirect("/swagger")).ExcludeFromDescription();
}

app.UseStaticFiles();
app.UseCors();
app.MapControllers();

app.Run();
