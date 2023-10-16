import React from 'react'
import Navbar2 from '../Components/NavBar2'
import Container from '../Components/container'
export default function Post() {
  return (
    <div>
        <div className='row'>
          <Navbar2/>
        </div>
        
        <div className='row' style={{backgroundColor:'rgb(239, 239, 260)'}}>
          <Container/>
        </div>
    </div>
  )
}

