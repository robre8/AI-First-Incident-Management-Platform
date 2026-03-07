INSERT INTO Incidents (Id, Title, Description, CreatedAt)
VALUES 
(NEWID(), 'Server down', 'The main server is not responding', GETDATE()),
(NEWID(), 'Database error', 'Unable to connect to DB', GETDATE());