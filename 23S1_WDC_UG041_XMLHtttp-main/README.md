# Group Repository for COMP SCI 2207/7207 Web & Database Computing Web Application Project (2023 Semester 1)

Your group's shared repository for the WDC 2023 Web App Project.

Auto commit/push/sync to Github is disabled by default in this repository.
- Enable the GitDoc extension to use this fucntionality (either in your VSCode settings, or in the Dev Container settings)

See [HERE](https://myuni.adelaide.edu.au/courses/85266/pages/2023-web-application-group-project-specification) for the project specification.

We recommend using the 'Shared Repository Model (Branch & Pull)' to collaborate on your work in this single repostory.
- You can read more about collaborating on GitHub repositories [HERE](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests)
- When working on the same file at the same time, the 'Live Share' feature in VSCode can also help.


//Set up environment

1. Use command: npm install
2. Use command: npm install mysql

//Set up database

3. Use command to install mysql: service mysql start

//In order to log in to the database conveniently, we set the password of the database to an empty string.

4. Use command go into database: mysql
5. Use command to set password to empty string: ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';

//start the server

6. To start the server, Use command: npm start

To login as Admin-

Admin EmailId- JashS99@gmail.com
Admin Password- Jash@1008
