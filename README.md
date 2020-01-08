# ToDoBer

Greetings! This repository holds the base front-end for our internal ToDoBer application. This application allows us to view all users tasks in list format.

# Instructions

1. Fork this repository to your own GitHub repository
    - Click the `Fork` button at the top right of this repository page
    - Fork it to your personal GitHub
1. Using GitHub Desktop, clone this repository from your GitHub (not mine!!)
1. This front end uses Typescript type checking. This give VS Code more information about the types we are using, and intellisense becomes much more powerful
    - To install the types for jQuery, type the following command
    > `npm install`
1. In `main.js`, you will need to update the `apiHostBase` variable to use the port that your backend is using

# Requirements

These new requirements are in priority order, so please complete them in order. If I were you, I would commit and push them up to GitHub between each requirement!

1. Make this Front-End and your Back-End work together
    - All existing functionality needs to work
        - Fetching Users
        - Fetching Tasks based on UserId
        - Updating Task Titles
        - Updating Task TaskBodys
        - Deleting Tasks
        - Posting new Tasks
    - Changes that need to be made can be in either the Front-End or Back-End.
1. Add basic comments functionality
    - Users should be able to add a comment to a task
    - Users should be able to open the list of existing comments on a task, but comments should be hidden by default
    - Comments should show the following data:
        - Comment Body (the comment itself)
        - Comment Author (an existing user)
        - Comment Created DateTime
1. Comment Order
    - Comments should show in the list in created time order
1. Add advanced comments functionality
    - Users should be able to edit existing comments
    - Users should be able to delete existing comments
1. Add Users Functionality
    - Users should be able to add new Users
1. Move Tasks to Different User
    - Users should be able to reassign a task to a different user