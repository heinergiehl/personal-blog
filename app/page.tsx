"use client"

import Timeline from "@/components/timline"
import { Socials } from "@/components/landingPage/socials"
import Projects from "@/components/projects"
import Contact from "@/components/landingPage/contact"
import Avatar from "@/components/landingPage/avatar"
import AboutMe from "@/components/aboutme"
import Skills from "@/components/skills"
import ScrollIndicatorWithSections from "@/components/vertical-scroll-progress"

const Main = () => {
  return (
    <>
      <ScrollIndicatorWithSections />
      <div className=" px-4 w-full flex flex-col">
        <Avatar />
        <AboutMe />
        <Timeline />
        <Skills />
        <Projects />
        <Socials />
        <Contact />
      </div>
    </>
  )
}

export default Main
