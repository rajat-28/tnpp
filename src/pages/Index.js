import React from 'react'
import Navbar2 from '../Components/NavBar2'
import SearchBar from '../Components/Search';
import Container from '../Components/container'
export default function Index() {
  return (
    <div>
        <div className='row'>
          <Navbar2/>
        </div>
        <div className='row' >
          <SearchBar/>
          
        </div>
        <div className='row' style={{backgroundColor:'rgb(239, 239, 260)'}}>
          <Container/>
        </div>
    </div>
  )
}
