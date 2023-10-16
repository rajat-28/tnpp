import { useState, useEffect } from "react"
import { Navbar, Nav, Container } from "react-bootstrap"
import * as React from "react";
import logo1 from '../assets/img/logo1.png'

import {
  BrowserRouter as Router
} from "react-router-dom";



export default function NavBar() {
  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, sescrolled] = useState(false);
  useEffect(() => {
    if (window.scrolly > 50) {
      sescrolled(true)
    }
    window.addEventListener("scroll", onscroll);
    return () => window.removeEventListener("scroll", onscroll)
  }, [])

  const onUpdateActiveLink = (value) => {
    setActiveLink(value);
  }
  return (
    <div>
      <div className="navb">
        <Navbar expand="lg" className={scrolled ? "scrolled" : ""}>
          <Container fluid>

            <div className="row">
              <div className="col-2">
                <Navbar.Brand href="#home">
                  <img src={logo1} alt="logo" style={{ width: 50, height: 50 }} />

                </Navbar.Brand>
              </div>
              <div className="col-4 my-2">
                <Navbar.Brand href="#home">Training & Placement Cell</Navbar.Brand>
              </div>
              {/* <SearchBar/> */}
            </div>
            <Nav className="justify-content-end me-5" activeKey="/home">
              <Nav.Link href="#home" className={activeLink === 'home' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('home')}>Home</Nav.Link>
              {/* <Nav.Link href="#skills" className={activeLink === 'skills' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('home')}>Skills</Nav.Link> */}
              <Nav.Link href="#projects" className={activeLink === 'projects' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('home')}>About</Nav.Link>
              <button className="vvd" onClick={() => { document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }) }}>Let’s Connect</button>
              {/* <img src={ellipse} alt=""></img> */}
            </Nav>
          </Container>


        </Navbar>


      </div>






    </div>
  )
}
