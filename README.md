# Capture Agent Status Dashboard

The Capture Agent Status Dashboard displays the current status of all the Capture Agents (CA) connected to Opencast. This will indicate if a CA is idle, offline, and/or capturing. 

The UI allows for sorting on the column headings and filtering to a CA using the dropdown.

## Getting Started

Clone the repo:
```
 git clone https://github.com/cilt-uct/CA-status-Dashboard.git
``` 

## Starting up the backend (Django)

### Running in development mode
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

### Running in production mode

Some prerequisites if running on new server:
* Ensure supervisor and nginx are installed on the server.
* Ensure you have a python virtual environment and activate. (https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/).
* Install gunicon for the project: in the project directory `pip install gunicorn`.
* Test run: `gunicorn --bind 0.0.0.0:8888 backend.wsgi`, after test: `deactivate`
* Create a supervisor file: `nano /etc/supervisor/conf.d/gunicorn.conf`

```
[program:backend]
directory=/path/to/backend
command=/path/to/envs/backend/bin/gunicorn backend.wsgi:application --workers 3 --bind 127.0.0.1:8888 --log-level info;
stdout_logfile = /path/to/backend/logs/access.log
stderr_logfile = /path/to/backend/logs/error.log
stdout_logfile_maxbytes=5000000
stderr_logfile_maxbytes=5000000
stdout_logfile_backups=100000
stderr_logfile_backups=100000
autostart=true
autorestart=true
startsecs=10
stopasgroup=true
priority=99
```

* To update supervisor: `sudo supervisorctl reread` and `sudo supervisorctl update`.
* To run `sudo supervisorctl start backend`

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
