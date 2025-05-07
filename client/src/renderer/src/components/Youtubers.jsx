import React, { useEffect, useState } from 'react'
import axios from 'axios';
import YoutuberCard from './YoutuberCard';

export default function Youtubers() {

  const [users, setUsers] = useState([])
  const numbers = [1, 2, 3, 4, 5];

  async function getUsers(){
      const response = await axios.get('http://localhost:8080/users');
      console.log('data is')
      console.log(response.data);
      setUsers(response.data)
  }

  useEffect(()=> {
    getUsers();
  }, []);
    
  return (
    <div>
      <h1 >Youtubers</h1>
      <ul>
      {users.map((user) =>
        <YoutuberCard 
        name={user.name} 
        thumbnailUrl={user.userURL} 
        key={user.id}/>
        
        )}
      </ul>


    </div>
  )
}
