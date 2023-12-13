"use client"
import { ID, Task } from '@/types/types'
import { useSortable } from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import { TrashIcon } from 'lucide-react'
import React, { useState } from 'react'

type Props = Task &  {
  deleteTask : (taskID: ID) => void
  setTaskContent: (taskID: ID, content: ID) => void
}

function TaskCard({ID, columnId, content, deleteTask, setTaskContent}: Props) {
      const [mouseOverCard, setMouseOverCard] = useState(false)
      const [editMode, setEditMode] = useState(false)
      const toggleEditMode = ()=>{
          setMouseOverCard(false)
          setEditMode( editMode => !editMode )
      }

        const {setNodeRef, attributes, listeners, transform, transition, isDragging} = useSortable({
          id: ID,
          data: {
              type: "Task",
              Task : {ID, columnId, content, deleteTask, setTaskContent},
          },
          disabled: editMode
      })

        const style = {
          transition,
          transform : CSS.Transform.toString(transform)
      }



  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style} onDoubleClick={()=> {toggleEditMode()}} onMouseEnter={()=> setMouseOverCard(true)}  onMouseLeave={()=> setMouseOverCard(false)} className={`${isDragging ? 'opacity-10' : ''} cursor-pointer text-center rounded-sm bg-gray-200 border shadow-md p-2 flex items-center`} key={ID}>
         
         
          { editMode && <input className=' w-[100%] resize-none bg-gray-100 p-1 rounded-md border outline-none' onChange={ (e) => {setTaskContent(ID, e.target.value)} } value={content} autoFocus onBlur={()=> setEditMode(false)} onKeyDown={(e)=> {
                if (e.key !== 'Enter'){
                    return
                }
                setEditMode(false)
            }
            }/> }
      

        {!editMode && <p className='text-sm text-left'>{content}</p>}
        
        {mouseOverCard && <TrashIcon onClick={()=> deleteTask(ID)} size={14} color='purple'  className='ml-auto opacity-60 hover:opacity-100 hover:scale-110'/>}
    </div>
  )
}

export default TaskCard