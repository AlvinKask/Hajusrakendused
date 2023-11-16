// Checkbox katki. Staatus muutub aga visuaal puudub

// Hetkel aktiivsete ülesannete nimekiri
var tasks = [];

let lastTaskId = 0;
let taskList;
let addTask;
let loginButton;
let logoutButton;
let usernameInput;
let passwordInput;

// Lehe laadimisel lisatakse esimesed ülesanded
window.addEventListener('load', async () => {
    taskList = document.querySelector('#task-list');
    addTask = document.querySelector('#add-task');
    loginButton = document.querySelector('#login-submit');
    logoutButton = document.querySelector('#logout-submit');
    usernameInput = document.querySelector('#username');
    passwordInput = document.querySelector('#password');

    loginButton.addEventListener('click', async (event) => {
        // Keela vormi sumbit nupu vaikimisi toiming, mis muidu lehte värskendab
        event.preventDefault();
        console.log('login clicked');
        await login(usernameInput.value, passwordInput.value);
        refreshTasks();
    });

    logoutButton.addEventListener('click', async (event) => {
        // Keela vormi sumbit nupu vaikimisi toiming, mis muidu lehte värskendab
        event.preventDefault();
        console.log('logout clicked');
        logout();
        refreshTasks();
    });

    await loadInExistingTasks();

    tasks.forEach(renderTask);

    // Kui nuppu vajutatakse, lisatakse uus ülesanne
    addTask.addEventListener('click', async () => {
        const task = await createTask(); // Lokaalselt luuakse uus ülesanne
        const taskRow = createTaskRow(task); // Luuakse uus HTML-i ülesande element, mille saab lehele lisada
        taskList.appendChild(taskRow); // Lisatakse ülesanne lehele
    });
});

// Järgmine rida kontrollib hetkel olemasolevat tokenit, kui pole sisse logitud, siis on null, kui sisse logitud, siis kuvatakse token konsoolis
console.log(localStorage.getItem('token'));

async function login(username, password) {
    console.log('this');
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "username": username,
        "password": password
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    await fetch("https://demo2.z-bit.ee/users/get-token", requestOptions)
        .then(response => response.json())
        .then(result => {
            localStorage.setItem('token', result.access_token);
        })
        .catch(error => console.log('error', error));
}

async function loadInExistingTasks() {
    try {
        const result = await sendAPIRequest('read', 'tasks', null, null, null, true);
        tasks = result.map(task => ({
            id: task.id,
            name: task.title,
            completed: task.marked_as_done
        }));
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

function renderTask(task) {
    const taskRow = createTaskRow(task);
    taskList.appendChild(taskRow);
}

function createTask() {
    lastTaskId++;
    const task = {
        // id: lastTaskId,
        name: 'Task ' + lastTaskId,
        completed: false
    };
    sendAPIRequest('create', 'tasks', null, task.name);
    return task;
}

async function sendAPIRequest(operation, requestPath, taskId, taskTitle, taskIsCompleted, returnFetchResponseResult) {
    let URL = `https://demo2.z-bit.ee`;

    // Vastavalt ette antule liidan URLile õige id ja path VÕI ainult pathi
    if (requestPath != null && taskId != null) {
        URL = [URL, requestPath, taskId].join('/');
        console.log(URL);
    } else if (requestPath != null && taskId == null) {
        URL = [URL, requestPath].join('/');
        console.log(URL);
    }

    const token = localStorage.getItem('token');

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    if (token) {
        myHeaders.append("Authorization", `Bearer ${token}`);
    }

    const result = await fetch(URL, createRequestOptions(operation, taskTitle, taskIsCompleted))
        .then(response => response.json())
        .catch(error => console.log('error', error));

    if (returnFetchResponseResult) {
        return result;
    }
}

function createRequestOptions(operation, title, isCompleted) {
    var myHeaders = new Headers();

    // Sea autoriseerimise token
    const token = localStorage.getItem('token');
    if (token) {
        myHeaders.append("Authorization", `Bearer ${token}`);
    }
    console.log(`Bearer ${localStorage.getItem('token')}`);

    switch (operation) {
        case 'create':
            myHeaders.append("Content-Type", "application/json");
            var callBody = JSON.stringify({
                "title": title,
                "desc": ""
            });
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: callBody,
                redirect: 'follow' // konstant (selle rakenduse jaoks)
            };
            return requestOptions;
        case 'read':
            var callBody;
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                body: callBody,
                redirect: 'follow' // konstant (selle rakenduse jaoks)
            };
            return requestOptions;
        case 'update':
            myHeaders.append("Content-Type", "application/json");
            var callBody = JSON.stringify({
                "title": title,
                "marked_as_done": isCompleted
            });
            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: callBody,
                redirect: 'follow'
            };
            return requestOptions;
        case 'delete':
            var raw;
            var requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            return requestOptions;
        default:
            console.log("VIGA! Ühtegi sobivat päist pole leitud!")
            break;
    }
}

function createTaskRow(task) {
    let taskRow = document.querySelector('[data-template="task-row"]').cloneNode(true);
    taskRow.removeAttribute('data-template');

    const name = taskRow.querySelector("[name='name']");
    name.value = task.name;
    name.addEventListener('blur', () => {
        sendAPIRequest('update', 'tasks', task.id, name.value);
    });

    const checkbox = taskRow.querySelector("[name='completed']");
    checkbox.checked = task.completed;

	checkbox.addEventListener('change', async (event) => {
		console.log('Checkbox state changed:', event.target.checked);
		task.completed = event.target.checked;
		await sendAPIRequest('update', 'tasks', task.id, name.value, task.completed);

		// Lisage siia kood, mis muudab checkboxi olekut vastavalt muudetud ülesande olekule
		checkbox.checked = task.completed;
	});

    const deleteButton = taskRow.querySelector('.delete-task');
    deleteButton.addEventListener('click', async () => {
        taskList.removeChild(taskRow);
        tasks.splice(tasks.indexOf(task), 1);
        await sendAPIRequest('delete', 'tasks', task.id);
    });

    return taskRow;
}

function logout() {
    localStorage.removeItem('token');
}

// Uus funktsioon ülesannete värskendamiseks
async function refreshTasks() {
    // Kui kasutaja on sisse logitud, siis uuenda ülesandeid
    if (isLoggedIn()) {
        // Eemalda kõik olemasolevad ülesanded
        while (taskList.firstChild) {
            taskList.removeChild(taskList.firstChild);
        }

        // Lae uuesti ülesanded
        await loadInExistingTasks();

        // Renderda iga ülesanne
        tasks.forEach(renderTask);
    } else {
        // Kui kasutaja pole sisse logitud, siis peida ülesanded
        taskList.innerHTML = '';
    }
}

// Uus funktsioon, mis kontrollib, kas kasutaja on sisse logitud
function isLoggedIn() {
    const token = localStorage.getItem('token');
    // Lisage siia veel lisatingimusi vastavalt teie autentimise süsteemile
    return token !== null && token !== 'undefined';
}
