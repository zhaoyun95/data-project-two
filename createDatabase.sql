
-- You need manually create schema StocksDataBase in PgAdmin;
-- comment lines must starts with "--" and ends with semicolon, otherwise you will get an error;

-- company table with  various data;
drop table if exists company cascade;
CREATE TABLE company (
    ticker VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100),
    ranking smallint,
    mkt_cap smallint,
    pe_ratio float,
    eps float,
    dividend_pct float,
    exchange VARCHAR(20),
    esg_score smallint,
    recom_rating float,
    sector VARCHAR(50),
    industry VARCHAR(50),
    country VARCHAR(100),
    city VARCHAR(100),
    latitude float,
    longitude float
);

-- historical price data downloaded from finance.yahoo.com;
drop table if exists price;
CREATE TABLE price (
    ticker VARCHAR(20),
    date date,
    open float,
    high float,
    low float,
    close float,
    adj_close float,
    volume bigint,
    PRIMARY KEY (ticker, date)
);