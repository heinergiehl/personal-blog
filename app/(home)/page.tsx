"use client"

import Timeline from "@/components/timline"
import { Socials } from "@/components/landingPage/socials"

import Contact from "@/components/landingPage/contact"
import Avatar from "@/components/landingPage/avatar"
import AboutMe from "@/components/aboutme"
import Skills from "@/components/skills"

import { ProjectsWrapper } from "@/components/projects/ProjectsWrapper"
import React from "react"
import LivingAuraScrollIndicator from "@/components/vertical-scroll-progress"

const Main = () => {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    // we’re now on the client
    setMounted(true)
  }, [])
  if (!mounted) {
    // prevents hydration mismatch
    return null
  }
  return (
    <div className="select-none">
      {/* DEPLOYMENT DEBUG - UNIQUE TIMESTAMP */}
      <div className="bg-red-600 text-white text-center py-6 text-2xl font-bold border-4 border-yellow-400">
        � BUILD TIME: {Date.now()} 🔥
        <br />
        COMMIT: {process.env.NODE_ENV || 'unknown'}
        <br />
        {new Date().toISOString()}
      </div>
      <LivingAuraScrollIndicator />
      <div className=" px-4 w-full flex flex-col">
        <Avatar />
        <AboutMe />
        <Timeline />
        <Skills />
        <ProjectsWrapper />
        <Socials />
        <Contact />
      </div>
    </div>
  )
}

export default Main
