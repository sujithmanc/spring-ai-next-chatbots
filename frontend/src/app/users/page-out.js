import About from '@/features/users/ui/About'
import NavBar from '@/features/users/ui/NavBar'
import Portfolio from '@/features/users/ui/Portfolio'
import Services from '@/features/users/ui/Services'
import Team from '@/features/users/ui/Team'
import React from 'react'
 
export default function UserHomePage() {
  return (
    <div>
      <NavBar />
      <Services />
      <Portfolio />
      <About />
      <Team />
    </div>
  )
}
