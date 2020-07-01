# create database schema in Postgres

from config import db_username
from config import db_password
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
import pandas as pd
import psycopg2
import glob

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
        command = command.strip()
        print(command)
        # print(f"--->{command}<----length: {len(command)}")
        # skip empty lines and comments
        if (len(command) == 0) or (command.startswith("--")):
            continue

        try:
            connection.execute(command)
        except OperationalError as msg:
            print ("Command skipped: ", msg)

# --- Step One: create tables
executeScriptsFromFile('createDatabase.sql')

# load data files into database

# --- Step Two: Load company.xlsx ---
# show database tables
print(engine.table_names())

# read company.xlsx
company_df = pd.read_excel("data/company.xlsx");
print(company_df.head())

# rerange column position to match database table columns
company_df = company_df[["ticker","name", "ranking", "mkt_cap", "pe_ratio", "eps", "dividend_pct", "exchange", "esg_score", "recom_rating", "sector", "industry", "country", "city", "latitude", "longitude"]]
print(company_df.head())

# remove old company data
engine.execute("delete from company")

# load company dataframe into database
company_df.to_sql(name='company', con=engine, if_exists='append', chunksize = 20, index=False)
company_df2 = pd.read_sql("select * from company", con=engine)
print("company data after loading")
print(company_df2.count())


# --- Step Three: Load price csv files ---
priceCSVFiles = glob.glob("data/*.csv")
print(priceCSVFiles)

# remove old price data
engine.execute("delete from price")

# loop through all data/*.csv files and load them into price table
for file in priceCSVFiles:
    file = file.strip()
    
    print(file)
    price_df = pd.read_csv(file)
    # print(price_df.head())
    csv_file = file.split('\\')[1]
    
    # ignore company.csv, we will handle it differetly
    if csv_file == "company.csv":
        continue

    ticker = csv_file.strip('.csv')
    price_df["ticker"] = ticker
   
    
    # rename column heading to match database table columns
    price_df.rename(columns = {"Date":"date", "Open":"open", "High":"high", "Low":"low", "Close":"close", "Adj Close":"adj_close", "Volume":"volume"}, inplace=True)
    # make ticker as the first column
    price_df = price_df[["ticker", "date", "open", "high", "low", "close", "adj_close", "volume"]]
    
    # load dataframe into database
    try:
        print(f"loading {ticker}")
        price_df.to_sql(name='price', con=engine, if_exists='append', chunksize = 20, index=False)
    except Exception as e:
        print(e)

# check out the price table
price_df2 = pd.read_sql("select * from price", con=engine)
print("price table after loading:")
print("column, count")
print(price_df2.count())
