# Capture agent status dashboard

## Getting Started

Clone the repo:
```
 git clone https://github.com/cilt-uct/CA-status-Dashboard.git
``` 

## Starting up the backend (Django)

```
cd CA-status-Dashboard/backend
pip install -r requirements.txt
cp config-dist.py config.py
```

Update all the appropriate configuration settings in `config.py`.

Start the server:
```
python3 manage.py runserver
```

## Starting up the frontend (Django)

``` 
cd CA-status-Dashboard/frontend
npm install
cp config-dist.json config.json
```

Chage the URL's in `config.json` to point to where the backend is running (DNS name).

### Running in development mode
```
cd CA-status-Dashboard/frontend
npm start
```

This starts-up the in the development mode (backend must be running).\
To view open [http://localhost:3000](http://localhost:3000) in a browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### Running in production mode
```
cd CA-status-Dashboard/frontend
npm run build
```
Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
