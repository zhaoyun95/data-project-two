# An App to help investors pick stocks
#### Developers:  
- Tanvir Khan
- Nicky Arohi Pant
- Paul Pineda
- James Ye
- Fabienne Zumbühl
## We have downloaded 171 company data from yahoo finance and loaded into our database
## instructions to setup this app in your local environment
1. clone this repo to your computer
2. change directory to the folder which contains requirements.txt and run
    pip install -r requirements.txt
3. manually create a schema named "StocksDataBase"
4. rename config-example.py to config.py and add your username and password to connect to the StocksDataBase
5. load the database by runing:
   python database-setup.py
6. run the app by going to the terminal and type:  ./run.sh
7. visit the app at http://127.0.0.1:5000/
## a live app is hosted in Heroku: https://stock-inspector.herokuapp.com/
