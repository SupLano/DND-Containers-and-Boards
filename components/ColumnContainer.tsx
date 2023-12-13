"use client"
import React, { useMemo, useState } from 'react'
import { Column, ID, Task } from '@/types/types'
import { Delete, DeleteIcon, LucideDelete, PlusCircle, PlusIcon, Trash, TrashIcon } from 'lucide-react'
import { SortableContext, useSortable } from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import TaskCard from './TaskCard'

type Props = {
    column: Column
    deleteColumn: (id: ID) => void
    updateColumn: (id: ID, title: string) => void
    createTask: (id:ID) => void
    tasks: Task[]
    deleteTask : (taskID: ID) => void
    setTaskContent: (taskID: ID, content: ID) => void
    
}



function ColumnContainer({column, deleteColumn, updateColumn, createTask, tasks, deleteTask, setTaskContent}: Props) {
    // const [columnTask, setColumnTasks] = useState<Task[]>(() => { 
    //     const newTasks:Task[] = tasks.filter(task => task.columnId === column.Id); 
    //     return newTasks ;
    //     })
    // console.log(columnTask)

    const TasksID = useMemo(() => tasks.map(task => task.ID), [tasks])

    const [editMode, setEditMode] = useState(false)

   

    const {setNodeRef, attributes, listeners, transform, transition, isDragging} = useSortable({
        id: column.Id,
        data: {
            type: "Column",
            column,
        },
        disabled: editMode
    })

    const style = {
        transition,
        transform : CSS.Transform.toString(transform)
    }


  return (
   
    <div ref={setNodeRef} style={style} className={`${isDragging ? 'opacity-30' : ''} relative bg-slate-100 min-w-[170px] min-h-[400px] max-h-[400px] drop-shadow-lg m-2 rounded-md flex flex-col`}>
        <div {...attributes} {...listeners} onClick={ () => setEditMode(true) } className='bg-neutral-200 flex justify-between py-2 px-1 rounded-t'>
            {!editMode && <p className='font-semibold'>{column.title}</p>}
            {editMode && 
            <input value={column.title} autoFocus onBlur={()=> setEditMode(false)} onKeyDown={(e)=> {
                if (e.key !== 'Enter'){
                    return
                }
                setEditMode(false)
            }
            } onChange={(e)=> {updateColumn(column.Id,e.target.value)}} className='w-fit bg-gray-300 p-1 rounded-md border outline-none'/>}
            <LucideDelete className='mt-1' onClick={ ()=> deleteColumn(column.Id) } color='gray' size={16}/>
        </div>
        <div className='px-2 flex flex-col gap-2 py-2 h-full w-full overflow-scroll'>
            <SortableContext items={TasksID}>
                {tasks.map(task => 
                        <TaskCard key={task.ID} setTaskContent={setTaskContent} deleteTask={deleteTask} ID={task.ID} columnId={task.columnId} content={task.content}/>
                )
                }
            </SortableContext>

        </div>
        <div onClick={()=> createTask(column.Id)} className='flex text-sm gap-1 justify-center items-center absolute bottom-0 bg-amber-100 p-1 rounded-t shadow-xl cursor-pointer -translate-x-0.5'>
            <PlusCircle className='font-bold' size={15}/>
            <p>Add Task</p>
        </div>
    </div>
  )
}

export default ColumnContainer