using MongoDB.Driver;
using IncidentPlatform.API.Models;

namespace IncidentPlatform.API.Infrastructure.Data;

public class MongoLogContext
{
    private readonly IMongoDatabase _database;

    public MongoLogContext(string connectionString)
    {
        var client = new MongoClient(connectionString);
        _database = client.GetDatabase("IncidentLogsDB");
    }

    public IMongoCollection<LogEntry> Logs => _database.GetCollection<LogEntry>("Logs");
}
