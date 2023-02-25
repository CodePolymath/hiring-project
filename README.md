Hiring Project Exercise
=======================

The project is a super simple API done in [phalcon](https://phalcon.io/en-us)
and an [ember.js](https://emberjs.com/) frontend app.

The model is just one table of `candidates` with name and age.
The API has implemented the GET /api/applicants.

On the client side there is only one route, /candidates
that uses the API to show a list of candidates.

## Requirements
```
docker
docker-compose
node 12
npm 7
```
## Running the projects

### Server

This will run the php app and a mariadb database, the php app runs in port 8080
```
cd server
docker-compose up -d
docker-compose exec php php composer.phar install
docker-compose exec php vendor/bin/phinx migrate
docker-compose exec php vendor/bin/phinx seed:run
```

You will be able to see a couple of records in the db and in this url http://localhost:8080/api/applicants

### Client

This will run the ember app, the front end run in port 4200, and proxy the api requests
```
cd client
npm install
npm start
```

You will be able to see the app running in the browser with http://localhost:4200/

# Chris' Updates

- implemented php POST function
- removed misc .gitkeep files
- added Roboto Google font
- added **ember-modal-dialog** for input form
- added **render-modifiers** for did-insert functionality
- implemented **createRecord** and **.save()** to the **applicant** model via **ember-data**
- implemented a11y enhancements
  - return focus to previous button on modal close
  - tab trapping in modal
  - ESC closes modal
  - ENTER in text inputs saves modal
  - click outside modal closes modal
- limited age input to numbers; 3 chars max
- required name and age
- added basic styling
- added missing semicolon to candidates route; applicant model
- added missing this. context to candidates template
- update action addNew to **this.addNew** in candidates template