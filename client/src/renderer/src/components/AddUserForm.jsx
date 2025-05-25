import React, { useState, useRef } from 'react'

import '../assets/addUserForm.css'

export default function AddUserForm() {
    const inputRef = useRef();
    const buttonRef = useRef();

    async function test1(e, user) {
        e.preventDefault(); // prevents page from instantly reloading
        buttonRef.current.disabled = true; 

        const res = await fetch('http://localhost:8080/newUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ytLink: user })
        });

        if (res.ok) {
            window.location.reload();
        }
       
    
    }

  return (
    <div>
        <br/> 
        <form className='user-form' >
            <label>
                Enter a youtuber you would like to add:
                <br/>
                <input type='text' name="user" ref={inputRef}/>
            </label>
            <button 
                type="submit" 
                onClick={(e)=>test1(e, inputRef.current.value)} 
                ref={buttonRef}

                method="POST" >Submit</button>
        </form>
    </div>
    
  )
}
