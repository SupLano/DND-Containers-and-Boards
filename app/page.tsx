"use client"
import { PlusSquareIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Column, ID, Task } from '@/types/types'
import ColumnContainer from '@/components/ColumnContainer'
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, arraySwap } from '@dnd-kit/sortable'
import { createPortal } from 'react-dom'
import TaskCard from '@/components/TaskCard'


export default function Home() {


  const [columns, setColumns] = useState<Column[]>([])

  const [activeColumn, setActiveColumn] = useState<Column | null>()
  const columnsID = useMemo(() => columns.map(column => column.Id), [columns])


  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTask, setActiveTask] = useState<Task | null>()


  function deleteTask (id: ID){
    const taskIndex = tasks.findIndex(task => task.ID  === id)
    const newTasks = tasks.filter((item, index) => index !== taskIndex);
    setTasks(newTasks)
  }

  function setTaskContent(id: ID, text: ID){
    const newTasks = tasks.map(
      task => 
       {
         if (task.ID !== id) {return task}
         return {...task, content:text as string }
       } )
       setTasks(newTasks)    
    
  }
  

  function createNewColumn(){

    const columnToAdd : Column = {
      Id: Math.floor(Math.random() * 100001),
      title: `Column ${columns.length + 1}`
    }

    setColumns([...columns, columnToAdd])
    // console.log(columns)

  }

  function updateColumn(id: ID, value: string) {
      const newColumns = columns.map(
        column => 
         {
           if (column.Id !== id) {return column}
           return {...column, title:value}
         } )
         setColumns(newColumns)         
  }

  function deleteColumn(id: ID){
    const newTasks = tasks.filter(task => task.columnId !== id )
    setTasks(newTasks)
    const newColumns = columns.filter(column => column.Id !== id)
    setColumns(newColumns)
    
  }

  function createTask(id: ID){
    const newTask: Task = {
      ID: Math.floor(Math.random() * 100001),
      columnId: id,
      content: 'Task ' + tasks.length
    }
    setTasks([...tasks, newTask])
    // console.log(tasks)
  }

  function Dragging(event: DragStartEvent){
    // console.log(event) 
    if (event.active.data.current?.type === 'Column') {
      setActiveColumn(event.active.data.current.column)
    }
    if (event.active.data.current?.type === 'Task'){
      setActiveTask(event.active.data.current.Task)
    }
    return
  }

  function Dropping(event: DragEndEvent){
    setActiveColumn(null)
    setActiveTask(null)
    const {active, over} = event
    if(!over){
      return
    }
    const activeColumnId = active.id
    const overColumnId = over.id

    if (activeColumnId == overColumnId) return
    setColumns(columns => {
      const activeColumnIndex = columns.findIndex(column => column.Id == activeColumnId)
      const overColumnIndex = columns.findIndex(column => column.Id == overColumnId)
      return arrayMove(columns, activeColumnIndex, overColumnIndex)
    } )
  }

  // function DragOver(event: DragOverEvent){
  //   const {active, over} = event
    
  //   if(!over){
  //     return
  //   }
  //   const activeId = active.id
  //   const overId = over.id

  //   if (activeId == overId) return

  //   const isActiveType =  active.data.current?.type
  //   const isOverType =  over.data.current?.type
  //   console.log({active: active.data})
  //   console.log({over: over.data})

  //   if (isActiveType !== 'Task'){ return }

  //   const activeIndex = tasks.findIndex(task => task.ID == activeId)
  //   const overIndex = tasks.findIndex(task => task.ID == overId)

  //   //task task (same column)
  //   //task task (different column)
  //   //task column (different column)

  //  if  ((isActiveType == 'Task' && isOverType == 'Task') && (tasks[activeIndex].columnId == tasks[overIndex].columnId)){
  //    const newTaskArray = arrayMove(tasks, activeIndex, overIndex)
  //    setTasks(newTaskArray)
  //    return
  //  }

  //  if  ((isActiveType == 'Task' && isOverType == 'Task') && (tasks[activeIndex].columnId !== tasks[overIndex].columnId)){
  //   const newTaskArray = arrayMove(tasks, activeIndex, overIndex)
  //   setTasks(newTaskArray)
  //   return
  // }

  //  if ((isActiveType == 'Task' && isOverType == 'Column') && (tasks[activeIndex].columnId !== overId)){
  //     tasks[activeIndex].columnId = over.data.current?.column.Id
  //     setColumns( columns => columns )
  //     return
  //  }

  // }

  function DragOver (event: DragOverEvent){

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;
    const activeIndex = tasks.findIndex((task) => task.ID  === activeId);

    // Im dropping a Task over another Task
    
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const overIndex = tasks.findIndex((task) => task.ID === overId);
        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          // Fix introduced after video recording
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1); // Add this back Nonye
        }
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        tasks[activeIndex].columnId = overId;
        // console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }



  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      }
    })
  )


 

  return (
   <DndContext onDragOver={DragOver} sensors={sensors} onDragStart={Dragging} onDragEnd={Dropping}>    
      <div className='flex flex-col bg-blue-100 min-h-screen w-full justify-center items-center overflow-hidden '>
      
          <div className='px-4'>
            <div className='flex flex-wrap p-5'>
              <SortableContext items={columnsID}>
                {columns.map(column => <ColumnContainer setTaskContent={setTaskContent} deleteTask={deleteTask} key={column.Id} createTask={createTask} updateColumn={updateColumn} deleteColumn={deleteColumn} column={column} tasks={tasks.filter(task => task.columnId == column.Id)}/> )}
              </SortableContext>
            </div>
          </div>


          <div onClick={ () => createNewColumn() } className='rounded-md drop-shadow-xl bg-blue-500 flex items-center justify-center text-center px-1 h-10'>
            <p className='p-2'>Add Column</p>
            <PlusSquareIcon  size={20}/>            
          </div>
        
      </div>




    {/* {createPortal(
      <DragOverlay>
        {activeColumn && <ColumnContainer tasks={tasks} deleteTask={deleteTask} setTaskContent={setTaskContent} createTask={createTask} updateColumn={updateColumn} column={activeColumn}  deleteColumn={deleteColumn}/>}
      </DragOverlay>, document.body)
    }  */}

     {
      <DragOverlay>
        {activeTask && <TaskCard deleteTask={deleteTask} setTaskContent={setTaskContent} content={activeTask.content} ID={activeTask.ID} columnId={activeTask.columnId}/>}
      </DragOverlay>
    }

   </DndContext>
  )
  }
 