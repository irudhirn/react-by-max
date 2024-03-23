import React, { useRef } from 'react';
import Input from './Input'
import Modal from './Modal';

export default function NewProject(props) {
  const modal = useRef();

  const title = useRef();
  const description = useRef();
  const dueDate = useRef();

  function handleSave(){
    const enteredTitle = title.current.value;
    const enteredDescription = description.current.value;
    const enteredDueDate = dueDate.current.value;

    // validation
    if(enteredTitle.trim === "" || enteredDescription.trim() === "" || enteredDueDate.trim() === ""){
      modal.current.open();
      return;
    }

    props.onAdd({
      title: enteredTitle,
      description: enteredDescription,
      dueDate: enteredDueDate
    })
  }

  return (
    <>
      <Modal ref={modal} buttonCaption={"Okay"}>
        <h2 className="text-ul font-bold text-stone-700 my-4">Invalid inputs</h2>
        <p className="text-stone-600 mb-4">Please fill out all mandatory fields.</p>
      </Modal>
      <div className="w-[35rem] mt-16">
        <menu className="flex items-center justify-end gap-4 my-4">
          <li>
            <button className="text-stone-800 hover:text-stone-950" onClick={props.onCancel}>
              Cancel
            </button>
          </li>
          <li>
            <button onClick={handleSave} className="px-6 py-2 rounded-md bg-stone-800 text-stone-50 hover:bg-stone-950">
              Save
            </button>
          </li>
        </menu>
        <div>
          <Input type="text" ref={title} label="Title" />
          <Input ref={description} label="Description" textarea />
          <Input type="date" ref={dueDate} label="Due Date" />
        </div>
      </div>
    </>
  )
}
