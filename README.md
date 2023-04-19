# README #

This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for? ###

* Quick summary
* Version
* [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

### How do I get set up? ###

* Summary of set up
* Configuration
* Dependencies
* Database configuration
* How to run tests
* Deployment instructions

### How to start up the app? ###
* Add the .env credentials
* Install App Dependencies: yarn run install
* Run App Migrations as elaborated on ### How to run migration? ###
* Start up the app: yarn run start:dev

### How to run migration? ###
* Build the Aplication first:  yarn run build
* Create Migration file: sequelize-cli migration:create  --name activity
* Move the created migration file from /dist/migrations to /src/migrations
* Rename the moved file and add .ts extension
* Edit the file to suite your planned updates
* Update the model instance on the file
* Re-Build the app again: yarn run build
* Run Migrations: migrate:run
* Done, confirm the addition

### How to run Test? ###
yarn run test

### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Who do I talk to? ###

* Repo owner or admin
* Other community or team contact