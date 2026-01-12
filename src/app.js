class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.loadTodos();
        this.setupEventListeners();
        this.updateCounter();
    }

    loadTodos() {
        const container = document.getElementById('todos-container');
        const emptyMsg = document.getElementById('empty-message');
        
        if (this.getFilteredTodos().length === 0) {
            container.innerHTML = '';
            emptyMsg.style.display = 'block';
            return;
        }
        
        emptyMsg.style.display = 'none';
        container.innerHTML = '';
        
        this.getFilteredTodos().forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="todo-text">${todo.text}</span>
                <button class="delete-btn">🗑️</button>
            `;
            container.appendChild(li);
        });
    }

    getFilteredTodos() {
        switch(this.currentFilter) {
            case 'active': return this.todos.filter(t => !t.completed);
            case 'completed': return this.todos.filter(t => t.completed);
            default: return this.todos;
        }
    }

    addTodo(text) {
        if (!text.trim()) return;
        
        this.todos.push({
            id: Date.now(),
            text: text.trim(),
            completed: false,
            createdAt: new Date().toISOString()
        });
        
        this.saveTodos();
        this.loadTodos();
        this.updateCounter();
        document.getElementById('todo-input').value = '';
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.loadTodos();
            this.updateCounter();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.loadTodos();
        this.updateCounter();
    }

    clearCompleted() {
        this.todos = this.todos.filter(t => !t.completed);
        this.saveTodos();
        this.loadTodos();
        this.updateCounter();
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    updateCounter() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        document.getElementById('counter').textContent = 
            `Задач: ${total} (выполнено: ${completed})`;
    }

    setupEventListeners() {
        document.getElementById('todo-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('todo-input');
            this.addTodo(input.value);
        });

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('todo-checkbox')) {
                const id = parseInt(e.target.closest('.todo-item').dataset.id);
                this.toggleTodo(id);
            }
            
            if (e.target.classList.contains('delete-btn')) {
                const id = parseInt(e.target.closest('.todo-item').dataset.id);
                this.deleteTodo(id);
            }
            
            if (e.target.classList.contains('filter-btn')) {
                document.querySelectorAll('.filter-btn').forEach(btn => 
                    btn.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.loadTodos();
            }
            
            if (e.target.id === 'clear-completed') {
                this.clearCompleted();
            }
        });
    }
}
const installBtn = document.getElementById('install-btn');
if (installBtn) {
    installBtn.style.display = 'none';
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        installBtn.style.display = 'block';
        
        installBtn.addEventListener('click', () => {
            e.prompt();
        });
    });
}

const app = new TodoApp();