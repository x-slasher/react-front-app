import React, { Component } from 'react'
import axios from 'axios'
import update from 'immutability-helper'

class TodosContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      todos: [],
      inputValue: ''
    }
  }

  getTodos() {
    axios.get('/api/todo')
    .then(response => {
      this.setState({todos: response.data.data})
    })
    .catch(error => console.log(error))
  }

  componentDidMount() {
    this.getTodos()
  }

  createTodo = (e) => {
    if (e.key === 'Enter') {
      axios.post('/api/todo', {title: e.target.value})
      .then(response => {
        const todos = update(this.state.todos, {
          $splice: [[0, 0, response.data.data]]
        })
        this.setState({
          todos: todos,
          inputValue: ''
        })
      })
      .catch(error => console.log(error))      
    }    
  }

  handleChange = (e) => {
    this.setState({inputValue: e.target.value});
  }

  updateTodo = (e, id) => {
    axios.put(`/api/todo/${id}`, {completed: e.target.checked})
    .then(response => {
      const todoIndex = this.state.todos.findIndex(x => x.id === response.data.data.id)
      const todos = update(this.state.todos, {
        [todoIndex]: {$set: response.data.data}
      })
      this.setState({
        todos: todos
      })
    })
    .catch(error => console.log(error))      
  }

  deleteTodo = (id) => {
    axios.delete(`/api/todo/${id}`)
    .then(response => {
      const todoIndex = this.state.todos.findIndex(x => x.id === id)
      const todos = update(this.state.todos, {
        $splice: [[todoIndex, 1]]
      })
      this.setState({
        todos: todos
      })
    })
    .catch(error => console.log(error))
  }

  render() {
    return (
      <div>
        <div className="inputContainer">
          <input className="taskInput" type="text" 
            placeholder="Add a task" maxLength="50"
            onKeyPress={this.createTodo}
            value={this.state.inputValue} onChange={this.handleChange} />
        </div>  	    
	<div className="listWrapper">
	   <ul className="taskList">
		  {this.state.todos.map((todo) => {
		    return(
		      <li className="task" todo={todo} key={todo.id}>
			<input className="taskCheckbox" type="checkbox" checked={todo.completed} onChange={(e) => this.updateTodo(e, todo.id)}/>              
			<label className="taskLabel">{todo.title}</label>
			<span className="deleteTaskBtn" onClick={(e) => this.deleteTodo(todo.id)}>x</span>
		      </li>
		    )       
		  })} 	    
	   </ul>
	</div>
     </div>
    )
  }
}

export default TodosContainer