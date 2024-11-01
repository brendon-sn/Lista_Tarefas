const addTaskButton = document.getElementById('addTaskButton')
const taskModal = document.getElementById('taskModal')
const closeModal = document.getElementById('closeModal')
const taskForm = document.getElementById('taskForm')
const taskList = document.getElementById('taskList')
const deleteModal = document.getElementById('deleteModal')
const closeDeleteModal = document.getElementById('closeDeleteModal')
const confirmDeleteButton = document.getElementById('confirmDeleteButton')
const cancelDeleteButton = document.getElementById('cancelDeleteButton')
const errorMessageDiv = document.getElementById('errorMessage')

let nextOrder = 1
let tasks = []
let draggedItem = null
let taskToDeleteIndex = null
let taskToEditIndex = null

function generateUniqueId() {
    return Date.now() + Math.floor(Math.random());
}

addTaskButton.addEventListener('click', () => {
    taskModal.style.display = 'block'
    taskForm.reset()
    taskToEditIndex = null
    errorMessageDiv.style.display = 'none'
})

closeModal.addEventListener('click', () => {
    taskModal.style.display = 'none'
})

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const taskName = document.getElementById('taskName').value
    const taskCost = parseFloat(document.getElementById('taskCost').value)
    const taskDeadline = document.getElementById('taskDeadline').value

    const taskExists = tasks.some((task, index) => task.name === taskName && index !== taskToEditIndex)

    if (taskExists) {
        errorMessageDiv.textContent = 'Esse nome de tarefa já existe. Por favor, escolha outro nome.'
        errorMessageDiv.style.display = 'block'
        return; 
    }
    errorMessageDiv.style.display = 'none'

    if (taskToEditIndex !== null) {
        tasks[taskToEditIndex] = {
            id: tasks[taskToEditIndex].id,
            name: taskName,
            cost: taskCost,
            deadline: taskDeadline,
            order: tasks[taskToEditIndex].order 
        }
    } else {
        const newTask = {
            id: generateUniqueId(),
            name: taskName,
            cost: taskCost,
            deadline: taskDeadline,
            order: nextOrder
        }
        tasks.push(newTask)
        nextOrder++
    }
    updateTaskList()
    taskForm.reset()
    taskModal.style.display = 'none'
})

function updateTaskList() {
    taskList.innerHTML = ''
    tasks.sort((a, b) => a.order - b.order)

    tasks.forEach((task, index) => {
        const newRow = document.createElement('tr')
        newRow.setAttribute('draggable', true)
        newRow.dataset.index = index

        if (task.cost >= 1000) {
            newRow.classList.add('high-cost')
        }

        newRow.innerHTML = 
        `
            <td>${task.id}</td>
            <td>${task.name}</td>
            <td>${task.cost.toFixed(2)}</td>
            <td>${task.deadline}</td>
            <td>
                <button class="editButton" onclick="editTask(${index})">✏️ Editar</button>
                <button class="deleteButton" onclick="openDeleteModal(${index})">🗑️ Excluir</button>
            </td>
        `

        newRow.addEventListener('dragstart', (e) => {
            draggedItem = newRow
            setTimeout(() => {
                newRow.style.display = 'none'
            }, 0)
        })

        newRow.addEventListener('dragend', () => {
            draggedItem = null
            newRow.style.display = 'table-row'
        })

        newRow.addEventListener('dragover', (e) => {
            e.preventDefault()
        })

        newRow.addEventListener('drop', (e) => {
            e.preventDefault()
            if (draggedItem && draggedItem !== newRow) {
                const draggedIndex = parseInt(draggedItem.dataset.index)
                const targetIndex = index
                const draggedTask = tasks[draggedIndex]
                tasks.splice(draggedIndex, 1)
                tasks.splice(targetIndex, 0, draggedTask)
                tasks.forEach((task, i) => task.order = i + 1)
                updateTaskList()
            }
        })
        taskList.appendChild(newRow)
    })
}

function editTask(index) {
    const task = tasks[index]
    document.getElementById('taskName').value = task.name
    document.getElementById('taskCost').value = task.cost
    document.getElementById('taskDeadline').value = task.deadline

    taskToEditIndex = index
    taskModal.style.display = 'block'
    errorMessageDiv.style.display = 'none'
}

function openDeleteModal(index) {
    taskToDeleteIndex = index
    deleteModal.style.display = 'block'
}

closeDeleteModal.addEventListener('click', () => {
    deleteModal.style.display = 'none'
});

confirmDeleteButton.addEventListener('click', () => {
    if (taskToDeleteIndex !== null) {
        tasks.splice(taskToDeleteIndex, 1)
        updateTaskList()
        deleteModal.style.display = 'none'
    }
})
cancelDeleteButton.addEventListener('click', () => {
    deleteModal.style.display = 'none'
})

async function loadTasks() {
    try {
        const response = await fetch('tasks.json')
        tasks = await response.json()

        if (tasks.length > 0) {
            nextOrder = Math.max(...tasks.map(task => task.order)) + 1
        }

        updateTaskList()
    } catch (error) {
        console.error('Erro ao carregar as tarefas:', error)
    }
}

loadTasks()