import React, {useState, useEffect} from 'react'
import "./app.scss"
import { FaCheck, FaPlus, FaTimes } from "react-icons/fa";
import { GrUpdate } from "react-icons/gr";
import { IoPencilOutline } from "react-icons/io5";
import { FaRegTrashCan } from "react-icons/fa6";
import axios from 'axios'
import { FaHourglass } from "react-icons/fa6";


const App = () => {
    const [taskList, setTaskList] = useState([])
    const [newTask, setNewTask] = useState({
        'description' : "",
        'completed' : false
    })
    const [selectedTask, setSelectedTask] = useState(null)

    axios.defaults.baseURL = "http://127.0.0.1:8000/api"

    // Fetch all data
    const fetchData = async () => {
        try {
            const response = await axios.get('/todos/');
            setTaskList(response.data)
            // console.log(response)
        } catch (error) {
            console.error('Error Encountered: ', error)
        }
    }

    useEffect( () => {
        fetchData();
    },[])

    // Fetch Filtered Data
    const fetchFilteredData = async (value) => {
        try {
            const response = await axios.get(`/todos/${value}/filter`);
            setTaskList(response.data)
            // console.log(response)
        } catch (error) {
            console.error('Error Encountered: ', error)
        }
    }

    const handleInputChange = (e) => {
        setNewTask({... newTask, [e.target.name]: e.target.value})
    }

    const handleInputSelectChange = (e) => {
        setSelectedTask({... selectedTask, [e.target.name]: e.target.value})
    }

    // add new item
    const addNewItem = async () => {
        if (newTask.description === ''){
            console.log("Empty Description")
            return;
        }

        try {
            await axios.post('/todos/', newTask);
            fetchData();
            setNewTask({
                    'description' : "",
                    'completed' : false
                })
                
        } catch (error) {
            console.error('Error Encountered: ', error)
        }
    }

    const updateItem = async () => {
        try {
            await axios.put(`/todos/${selectedTask.id}/`, selectedTask)
            fetchData();
            setSelectedTask(null)
        } catch (error) {
            console.error('Error Encountered: ', error)
        }
    }

    const toggleCompleted = async (id) => {
        try {
            await axios.patch(`/todos/${id}/toggle/`)
            fetchData();
        } catch (error) {
            console.error('Error Encountered: ', error)
        }
    }

    const deleteItem = async (id) => {
        try {
            await axios.delete(`/todos/${id}`);
            fetchData();
        } catch (error) {
            console.error('Error Encountered: ', error)
        }
    }

  return (
    <div className='outer-container'>
        <div className='inner-container'>
            <div className='header'>Todo App</div>
            <div className='inner-box'>
                {selectedTask ? 
                        <div className='selected-task'>
                            <input type="text" name="description" value={selectedTask.description} onChange={handleInputSelectChange} />
                            <div className='btn-container' onClick={() => setSelectedTask(null)} >
                                <FaTimes />
                            </div>

                            <div className='btn-container' onClick={updateItem}>
                                <GrUpdate />
                            </div>
                        </div>
                    :
                        <div className='new-task'>
                            <input type="text" name="description" value={newTask.description} onChange={handleInputChange} />
                            <div className='btn-container' onClick={addNewItem}>
                                <FaPlus />
                            </div>
                        </div>    
                    }
                

                

                <div className='filters'>
                    <div className='inner'>
                        <span onClick={fetchData}>All</span>
                        <span onClick={() => fetchFilteredData(0)}>Pending</span>
                        <span onClick={() => fetchFilteredData(1)}>Completed</span>
                    </div>
                </div>

                <div className='tasks'>
                    {taskList.length ? (
                        taskList.map((task,index) => (
                            <div className={`single-task ${task.completed ? 'completed' : 'pending'}`}>
                                <p>{task.description}</p>
                                <div className='actions'>
                                    <div className='btn-container btn edit' onClick={() => setSelectedTask(task)}>
                                        <IoPencilOutline />
                                    </div>

                                    {
                                        task.completed ?
                                        <div className='btn-container btn' onClick={() => toggleCompleted(task.id)}>
                                            <FaHourglass />
                                        </div>
                                        :
                                        <div className='btn-container btn completed' onClick={() => toggleCompleted(task.id)}>
                                            <FaCheck />
                                        </div>
                                    }

                                    

                                    <div className='btn-container btn delete' onClick={() => deleteItem(task.id)}>
                                        <FaRegTrashCan />
                                    </div>
                                </div>
                            </div>
                            
                        ))
                    ) : 
                        <span>No Tasks Found</span>
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default App