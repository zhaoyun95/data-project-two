# create database schema in Postgres

from config import db_username
from config import db_password
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError

engine = create_engine(f'postgresql://{db_username}:{db_password}@localhost:5432/StocksDataBase')
connection = engine.connect()

# function to execute .sql file
def executeScriptsFromFile(filename):
    # Open and read the file as a single buffer
    fd = open(filename, 'r')
    sqlFile = fd.read()
    fd.close()

    # all SQL commands (split on ';')
    sqlCommands = sqlFile.split(';')

    # Execute every command from the input file
    for command in sqlCommands:
        # This will skip and report errors
        # For example, if the tables do not yet exist, this will skip over
        # the DROP TABLE commands
        command = command.strip()
        print(command)
        # print(f"--->{command}<----length: {len(command)}")
        if (len(command) == 0) or (command.startswith("--")):
            continue

        try:
            connection.execute(command)
        except OperationalError as msg:
            print ("Command skipped: ", msg)


executeScriptsFromFile('createDatabase.sql')