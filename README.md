# ToDoBer

Greetings! This repository holds the base front-end for our internal ToDoBer application. This application allows us to view all users tasks in list format.

# Getting Started

1. Fork this repository to your own GitHub repository
    - Click the `Fork` button at the top right of this repository page
    - Fork it to your personal GitHub
1. Using GitHub Desktop, clone this repository from your GitHub (not mine!!)
1. This front end uses Typescript type checking. This give VS Code more information about the types we are using, and intellisense becomes much more powerful
    - To install the types for jQuery, type the following command
    > `npm install`
1. In `main.js`, you will need to update the `apiHostBase` variable to use the port that your backend is using.

# Resources

- [jQuery Documentation](https://api.jquery.com/)
- [Bootstrap Documentation (using 4.4.1)](https://getbootstrap.com/docs/4.4/getting-started/introduction/)
- [FontAwesome Icons (only free available)](https://fontawesome.com/icons?d=gallery&m=free)

# Requirements

These new requirements are in priority order, so please complete them in order. If I were you, I would commit and push them up to GitHub between each requirement!

1. Make this frontend and your backend work together
    - All existing functionality needs to work
        - Fetching Users
        - Fetching Tasks based on UserId
        - Updating Task Title's
        - Updating Task TaskBody's
        - Deleting Tasks
        - Posting new Tasks
    - Changes that need to be made can be in the frontend, backend, or both.
1. Add basic comments functionality
    - Users should be able to add a comment to a task
    - Users should be able to open the list of existing comments on a task, but comments should be hidden by default
    - Comments should show the following data:
        - Comment Body (the comment itself)
        - Comment Author (an existing user)
        - Comment Created DateTime
1. Comment and Task Order
    - Comments should show in the list in created time order
    - Incomplete Tasks should show in the list in created time order
    - Complete Tasks should show in the list in completed time order
    - Notes: This can be done in either the frontend or backend
        - `var orderedTasks = tasks.OrderBy(t => t.CreatedDate) //Server Side`
        - `tasks.sort(function(a, b) {return new Date(a.CreatedDate).getTime() - new Date(b.CreatedDate).getTime()}) //Javascript`
1. Add advanced comments functionality
    - Users should be able to edit existing comments
    - Users should be able to delete existing comments
1. Add Users Functionality
    - Users should be able to add new Users
1. Move Tasks to Different User
    - Users should be able to reassign a task to a different user