# project-2 Stocker Picker App
# Tanvir Khan, Nicky Pant, Paul Pineda, James Ye, Fabienne Zumbuehl

import os
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import Flask, jsonify
import datetime as dt
from flask import Flask, render_template, redirect

#################################################
# Database Setup
#################################################
db_uri = ""
try:
    from .config import db_username
    from .config import db_password
    db_uri = f'postgresql://{db_username}:{db_password}@localhost:5432/StocksDataBase'
except ImportError:
    print("config not found!")
    db_uri = "sqlite:///db.sqlite"

final_db_uri = os.environ.get('DATABASE_URL', '') or db_uri
print(final_db_uri)

engine = create_engine(final_db_uri)

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(engine, reflect=True)

# Save references to each table
Company = Base.classes.company
Price = Base.classes.price

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/")
def home():
    return render_template('landingpage.html')

@app.route("/fundamental")
def fundamental():
    return render_template('fundamental.html')

@app.route("/technical")
def technical():
    return render_template("technical.html")

@app.route("/environmental")
def environmental():
    return render_template("environmental.html")

@app.route("/api/v1.0/company")
def getAllCompanies():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    # results is a list of tuples
    results = session.query(Company).all()
    session.close()
    companies = []
    for row in results:
        company = {}
        company['ticker'] = row.ticker
        company['name'] = row.name
        company['ranking'] = row.ranking
        company['mkt_cap'] = row.mkt_cap
        company['pe_ratio'] = row.pe_ratio
        company['eps'] = row.eps
        company['dividend_pct'] = row.dividend_pct
        company['exchange'] = row.exchange
        company['esg_score'] = row.esg_score
        company['recom_rating'] = row.recom_rating
        company['sector'] = row.sector
        company['industry'] = row.industry
        company['country'] = row.country
        company['city'] = row.city
        company['latitude'] = row.latitude
        company['longitude'] = row.longitude
        companies.append(company)

    return jsonify(companies)

@app.route("/api/v1.0/company/<ticker>")
def getOneCompany(ticker):
    # Create our session (link) from Python to the DB
    session = Session(engine)
    ticker = ticker.upper()

    # return a company by ticker 
    results = session.query(Company).filter_by(ticker=ticker).first()
    session.close()
    print(results)

    company = {}

    company['ticker'] = results.ticker
    company['name'] = results.name
    company['ranking'] = results.ranking
    company['mkt_cap'] = results.mkt_cap
    company['pe_ratio'] = results.pe_ratio
    company['eps'] = results.eps
    company['dividend_pct'] = results.dividend_pct
    company['exchange'] = results.exchange
    company['esg_score'] = results.esg_score
    company['recom_rating'] = results.recom_rating
    company['sector'] = results.sector
    company['industry'] = results.industry
    company['country'] = results.country
    company['city'] = results.city
    company['latitude'] = results.latitude
    company['longitude'] = results.longitude

    return jsonify(company)

# don't want to return all prices, it takes forever to load!!!! it will crash the server!
# @app.route("/api/v1.0/price")
# def getAllPrices():
#     # Create our session (link) from Python to the DB
#     session = Session(engine)

#     # return all Price data
#     results = session.query(Price)
#     session.close()

#     prices = []

#     for row in results:
#         price = {}
#         price['ticker'] = row.ticker
#         price['date'] = row.date
#         price['open'] = row.open
#         price['high'] = row.high
#         price['low'] = row.low
#         price['close'] = row.close
#         price['adj_close'] = row.adj_close
#         price['volume'] = row.volume
#         prices.append(price)

#     return jsonify(prices)


@app.route("/api/v1.0/price/<ticker>")
def getPrice(ticker):
    # Create our session (link) from Python to the DB
    session = Session(engine)
    ticker = ticker.upper()

    # return a company's price data
    results = session.query(Price).filter_by(ticker=ticker)
    session.close()

    prices = []

    for row in results:
        price = {}
        price['ticker'] = row.ticker
        price['date'] = row.date
        price['open'] = row.open
        price['high'] = row.high
        price['low'] = row.low
        price['close'] = row.close
        price['adj_close'] = row.adj_close
        price['volume'] = row.volume
        prices.append(price)

    return jsonify(prices)

@app.route("/api/v1.0/price/<ticker>/<startDate>")
def getPriceStart(ticker, startDate):
    # Create our session (link) from Python to the DB
    session = Session(engine)
    ticker = ticker.upper()

    # return a company's price data with start Date
    results = session.query(Price).filter_by(ticker=ticker).filter(Price.date>=startDate).all()
    session.close()

    prices = []

    for row in results:
        price = {}
        price['ticker'] = row.ticker
        price['date'] = row.date
        price['open'] = row.open
        price['high'] = row.high
        price['low'] = row.low
        price['close'] = row.close
        price['adj_close'] = row.adj_close
        price['volume'] = row.volume
        prices.append(price)

    return jsonify(prices)

@app.route("/api/v1.0/price/<ticker>/<startDate>/<endDate>")
def getPriceStartEnd(ticker, startDate, endDate):
    # Create our session (link) from Python to the DB
    session = Session(engine)
    ticker = ticker.upper()

    # return Price data with start date and end date
    results = session.query(Price).filter_by(ticker = ticker)\
        .filter(Price.date >= startDate)\
        .filter(Price.date <= endDate)\
        .all()
    session.close()

    prices = []

    for row in results:
        price = {}
        price['ticker'] = row.ticker
        price['date'] = row.date
        price['open'] = row.open
        price['high'] = row.high
        price['low'] = row.low
        price['close'] = row.close
        price['adj_close'] = row.adj_close
        price['volume'] = row.volume
        prices.append(price)

    return jsonify(prices)

@app.route("/api/v1.0/table")
def getCompaniesForTable():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    # results is a list of tuples
    results = session.query(Company).all()
    session.close()
    companies = []
    for row in results:
        company = {}
        company['name'] = row.name
        company['ticker'] = row.ticker
        company['mkt_cap'] = row.mkt_cap
        company['exchange'] = row.exchange
        company['sector'] = row.sector
        company['country'] = row.country
        company['city'] = row.city
        companies.append(company)
    return jsonify(companies)


# this part must be placed at the end of the file!!	
if __name__ == '__main__':
    app.run(debug=True)