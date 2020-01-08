// @ts-check

/** 
 * @typedef User
 * @type {Object}
 * @property {String} Id
 * @property {String} Name
 * 
 * @typedef Task
 * @type {Object}
 * @property {String} Id
 * @property {String} UserId
 * @property {String} Title
 * @property {String} TaskBody
 * @property {String} CreatedDate
 * @property {String} CompletedDate
 * @property {Boolean} IsComplete
 * **/
let apiHostBase = "http://localhost:18155/api";

$(function () {
    $.ajax(`${apiHostBase}/users`)
        .done(loadUsersUi)
        .fail(function (err) {
            alert(err);
        })
});


/**
 * @param {string} userId
 */
function getAndLoadTasksForUser(userId) {
    $.ajax(`${apiHostBase}/tasks?userId=${userId}`)
        .done(function (tasks) {
            loadTasksUi(userId, tasks);
        });
}

/**
 * @param {User[]} users
 */
function loadUsersUi(users) {
    let userColsDiv = $("#user-cols");
    for (let user of users) {
        // Build the user column and fill in the user's name
        let userHtml = $(`<div class="user-col border m-1" data-user-id="${user.Id}">
            <div class="user-wrapper flex-row">
                <h2 class="text-center flex-grow-1">${user.Name}</h2>
            </div>
        </div>`);

        // Set the minimum width of the column
        userHtml.css("min-width", `${Math.max(100 / users.length, 24)}vw`)

        // Build the new task from, and hide it
        let newTaskButton = $(`<button class="btn btn-block btn-primary">Submit</button>`);
        let newTaskTitle = $(`<div class="form-group">
            <label>Task Title</label>
            <input type="text" name="task-title" class="form-control" />
        </div>`);
        let newTaskBody = $(`<div class="form-group">
            <label>Task Body</label>
            <textarea name="task-body" class="form-control" />
        </div>`)
        let newTaskForm = $(`<form class="new-task-form p-2 bg-dark text-white text-center">`);
        newTaskForm.append(newTaskTitle, newTaskBody, newTaskButton);
        newTaskButton.click(function (e) {
            // Stop the default form actions (so the page doesn't reload)
            e.preventDefault();

            // Send the new task to the api
            $.ajax({
                url: `${apiHostBase}/tasks`,
                method: "POST",
                data: {
                    Title: newTaskTitle.children(".form-control").val(),
                    TaskBody: newTaskBody.children(".form-control").val(),
                    UserId: user.Id
                }

            }).done(function () { // Update the task list once api completes
                getAndLoadTasksForUser(user.Id);
                newTaskTitle.children(".form-control").val("");
                newTaskBody.children(".form-control").val("");
                newTaskForm.toggle();
            })
        });

        let newTaskShowIcon = $(`<i class="far fa-plus fa-2x hover-green pr-5"></i>`);

        newTaskShowIcon.click(function () {
            newTaskForm.toggle(0, function () {
                if (!$(this).is(":hidden")) {
                    newTaskTitle.children(".form-control").focus();
                }
            });
        });
        userHtml.children(".user-wrapper").append(newTaskShowIcon);
        userHtml.append(newTaskForm);
        newTaskForm.hide();

        // Add the new user column to the user cols div
        userColsDiv.append(userHtml);

        // Load that user's tasks
        getAndLoadTasksForUser(user.Id);
    }
}

/**
 * @param {String} userId
 * @param {Task[]} tasks
 * 
 * @description Used to build the task list, and populate it from the api
 */
function loadTasksUi(userId, tasks) {
    // Find the correct column
    let userCol = $(`.user-col[data-user-id=${userId}]`);

    // Clean it up
    userCol.children(".task-list").remove();
    let wrapper = $("<div class='task-list'>");

    // Build the two lists of tasks possible
    let unfinishedTasks = tasks.filter(t => t.IsComplete === false);
    let finishedTasks = tasks.filter(t => t.IsComplete === true);

    // Build the UI for incomplete tasks
    {
        let incompleteDiv = $(`<div>`);

        let incompleteHeader = $(`<div class="flex-row"><hr class='m-2 flex-grow-1'/><p><i class="far fa-sort-down"></i> Incomplete</p></div>`);
        wrapper.append(incompleteHeader);
        incompleteHeader.click(function () {
            incompleteDiv.slideToggle("slow");
        });

        wrapper.append(incompleteDiv);

        for (let task of unfinishedTasks) {
            BuildTask(task, incompleteDiv, false);
        }
    }

    // Build the UI for completed tasks
    {
        let completeDiv = $(`<div>`);

        if (finishedTasks.length > 0) {
            let completeHeader = $(`<div class="flex-row"><hr class='m-2 flex-grow-1'/><p><i class="far fa-sort-down"></i> Complete</p></div>`);
            wrapper.append(completeHeader);
            completeHeader.click(function () {
                completeDiv.slideToggle("slow");
            });
        }

        wrapper.append(completeDiv);

        for (let task of finishedTasks) {
            BuildTask(task, completeDiv, true);
        }
        userCol.append(wrapper);
    }
}

/**
 * @param {Task} task
 * @param {JQuery<HTMLElement>} appendToElem
 * @param {Boolean} isComplete
 */
function BuildTask(task, appendToElem, isComplete) {
    let completeCheckbox = $(`<i class="far ${isComplete ? "fa-undo" : "fa-check-square"} fa-2x hover-white"></i>`);
    completeCheckbox.click(function () {
        $.ajax({
            url: `${apiHostBase}/tasks`,
            method: "PUT",
            data: {
                Id: task.Id,
                IsComplete: !isComplete
            }
        }).done(function () {
            getAndLoadTasksForUser(task.UserId);
        });
    });
    let deleteX = $(`<i class="far fa-times-square fa-2x hover-red"></i>`);
    deleteX.click(function () {
        $.ajax({
            url: `${apiHostBase}/tasks/${task.Id}`,
            method: "DELETE"
        })
            .done(function () {
                getAndLoadTasksForUser(task.UserId);
            });
    });
    // Uncompleted task template HTML
    let taskHtml = $(`<div class="card m-2 ${isComplete ? "border-danger" : "border-success"}">
            <div class="card-header ${isComplete ? "bg-danger" : "bg-success"} flex-row">
                <h5 class="card-title text-center flex-grow-1">${task.Title}</h3>
            </div>
            <div class="card-body">
                <p class="card-text">${task.TaskBody}</p>
            </div>
            <div class="card-footer text-muted">
            ${isComplete
            ? `<p class="text-right m-0">Finished: ${new Date(task.CompletedDate).toDateString()}</p>`
            : `<p class="text-right m-0">Started: ${new Date(task.CreatedDate).toDateString()}</p>`
        }
            </div>
        </div>`);
    taskHtml.children(".card-header").prepend(deleteX);
    taskHtml.children(".card-header").append(completeCheckbox);

    // Add the ability to change the title
    taskHtml.find(".card-title").click(function () {
        let previousCardHeader = taskHtml.children(".card-header").detach();
        let newTitleInput = $(`<div class="card-header flex-row"><input class="form-control p-2 flex-grow-1" type="text" /></div>`);
        newTitleInput.children("input").val(task.Title);
        // let newTitleBtn = $(`<button class="btn btn-primary">Submit</button>`);
        newTitleInput.keypress(function (e) {
            if (e.which == 13) {
                $.ajax({
                    url: `${apiHostBase}/tasks`,
                    method: "PUT",
                    data: {
                        Id: task.Id,
                        Title: newTitleInput.children("input").val()
                    }
                }).done(function () {
                    getAndLoadTasksForUser(task.UserId);
                })
            }
        })
        // newTitleInput.append(newTitleBtn);
        taskHtml.prepend(newTitleInput);

        newTitleInput.children("input").focus();

        newTitleInput.focusout(function () {
            newTitleInput.replaceWith(previousCardHeader);
        })
    });

    // Add the ability to change the Task Body
    taskHtml.children(".card-body").click(function () {
        let previousHeight = taskHtml.children(".card-body").height();
        let previousCardBody = taskHtml.children(".card-body").detach();
        let newCardBody = $(`<div class="card-body">`);
        let newTextArea = $(`<textarea class="form-control">${task.TaskBody}</textarea>`);
        newTextArea.width("100%");
        newTextArea.height(previousHeight * 1.8);
        previousCardBody.detach();
        newCardBody.append(newTextArea);

        let btnRow = $(`<div class="flex-row">`);
        let cancelBtn = $(`<button class="btn btn-info flex-grow-1 mt-1 mr-1">Cancel</button>`)
        cancelBtn.click(function () {
            taskHtml.children(".card-body").replaceWith(previousCardBody);
        })
        let submitBtn = $(`<button class="btn btn-primary flex-grow-1 mt-1 ml-1">Update</button>`);
        submitBtn.click(function () {
            $.ajax({
                url: `${apiHostBase}/tasks`,
                method: "PUT",
                data: {
                    Id: task.Id,
                    TaskBody: newTextArea.val()
                }
            }).done(function () {
                getAndLoadTasksForUser(task.UserId);
            })
        })
        btnRow.append(cancelBtn);
        btnRow.append(submitBtn);

        newCardBody.append(btnRow);
        taskHtml.children(".card-header").after(newCardBody);
        newTextArea.focus();
    })
    appendToElem.append(taskHtml);
}
