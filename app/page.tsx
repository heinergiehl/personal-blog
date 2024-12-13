"use client"
import { Card } from "@/components/landingPage/card/card"
import {
  Card as BentoCard,
  GridContainer,
} from "@/components/landingPage/bento/grid"
import Spotlight from "@/components/landingPage/card/spotlight"
import { cn } from "@/lib/utils"
import useMousePosition from "@/utils/useMousePosition"
import { motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { FaCode, FaDatabase, FaGithub, FaYoutube } from "react-icons/fa"
import { IoLogoFigma } from "react-icons/io5"
import { Copy, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import ThreeBackground from "@/components/landingPage/3dBackground"
const ScrollIndicatorWithSections = () => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [currentSection, setCurrentSection] = useState<string | null>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  let scrollTimeout: NodeJS.Timeout
  // Calculate scroll progress based on vertical scroll
  const handleScroll = () => {
    setIsScrolling(true)
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop
    const scrollHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight
    const progress = (scrollTop / scrollHeight) * 100
    setScrollProgress(progress)
    // Clear any existing timeout and start a new one
    clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(() => {
      setIsScrolling(false)
    }, 400) // Hide after 1 second of no scrolling
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(scrollTimeout) // Cleanup on unmount
    }
  }, [])
  // Track which section is currently in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSection(entry.target.id)
          }
        })
      },
      { threshold: 0.8 }
    )
    const sections = document.querySelectorAll("section")
    sections.forEach((section) => observer.observe(section))
    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [])
  return (
    <>
      <div
        className="fixed top-0 mt-[70px] left-0 w-1 bg-gray-300 opacity-20 z-40 ml-4 
      "
      />
      {/* Scroll Progress Bar */}
      <motion.div
        className={cn([
          "  drop-shadow-[0px_0px_2px_rgba(79,_170,_229,_1)] fixed mt-[70px] top-0 left-0 w-1 bg-gradient-to-b from-indigo-500/10 via-indigo-500/40 to-indigo-500/100 z-50 ml-4 flex justify-center",
        ])}
        style={{ height: `${scrollProgress}%` }}
        initial={{ height: 0 }}
        animate={{
          height: `${scrollProgress - 10}%`,
          opacity: isScrolling ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          style={{ top: `${scrollProgress > 2 ? scrollProgress - 2 : 0}%` }}
          className={cn([
            "fixed flex w-4 h-4 bg-indigo-600 rounded-full z-50 mt-[70px]",
            scrollProgress > 90 ? "mt-[0px]" : "mt-[70px]",
          ])}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {currentSection && (
            <motion.h2
              className="fixed  text-sm font-semibold ml-4 left-6 transform"
              initial={{ opacity: 0 }}
              animate={{ opacity: isScrolling ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {currentSection}
            </motion.h2>
          )}
        </motion.div>
      </motion.div>
    </>
  )
}

// About Me Component
const AboutMe = () => {
  return (
    <section
      id="about-me"
      className="flex justify-center items-center flex-col p-8 bg-gradient-to-r from-white via-gray-100 to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-black rounded-lg shadow-lg mt-16"
    >
   
        <motion.h2
          className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          About Me
        </motion.h2>
        <motion.p
          className="text-lg text-gray-600 dark:text-gray-300 mb-4 "
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Hi, I’m{" "}
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            Heiner Giehl
          </span>
          , a passionate Full-Stack Developer with a knack for creating modern
          and interactive applications. My journey as a self-taught developer
          has equipped me with deep expertise and enthusiasm for delivering
          impactful projects.
        </motion.p>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Expertise in Backend Development
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              I specialize in backend technologies like Python (Flask), Node.js,
              and Laravel. From Websockets to Task Scheduling, I deliver robust
              server-side solutions.
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Frontend Proficiency
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Creating dynamic, user-friendly interfaces with React, Next.js,
              and Vue.js is my passion. I blend creativity with technical
              expertise to craft modern applications.
            </p>
          </div>
        </motion.div>

    </section>
  )
}

// Avatar Component
const Avatar = () => {
  return (
    <section
      id="Header"
      className="relative flex flex-col items-center p-6   rounded-lg shadow-lg mt-16"
    >
      <motion.div
        className="relative z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <Image
          width={300}
          height={300}
          src="/heiner-profile.jpg"
          alt="Your Avatar"
          className="w-24 h-24 rounded-full border-4 border-gray-300 dark:border-gray-700 shadow-lg object-cover"
        />
        <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        className="flex flex-col space-y-2 mt-4  z-10"
      >
        <div className="flex items-center space-x-3">
          <motion.div
            className="text-4xl  z-10"
            animate={{
              rotate: [0, 25, -25, 20, -20, 15, -15, 10, -10, 0],
              scale: [1.5, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: 2,
              ease: "easeInOut",
              stiffness: 260,
              damping: 20,
            }}
          >
            👋
          </motion.div>
          <motion.h2
            className="text-2xl font-semibold text-gray-800 dark:text-gray-100"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Hello!
          </motion.h2>
        </div>
        <motion.p
          className="text-lg text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          I'm Heiner and available for work!
        </motion.p>
        <motion.p
          className="text-lg text-gray-600 dark:text-gray-300 font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          I am a{" "}
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">
            Full-Stack Developer
          </span>
          .
        </motion.p>
      </motion.div>
      <div className="absolute inset-0" >
        <ThreeBackground />
      </div>
    </section>
  )
}

const Skills = () => {
  return (
    <section
      id="skills"
      className=" p-8 bg-gradient-to-r from-white via-gray-100 to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-black rounded-lg shadow-lg mt-16"
    >
      {/* <motion.h2
        className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Skills
      </motion.h2>
      <motion.p
        className="text-lg text-gray-600 dark:text-gray-300 mb-4"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Hi, I’m{" "}
        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
          Heiner Giehl
        </span>
        , a passionate Full-Stack Developer with a knack for creating modern and
        interactive applications. My journey as a self-taught developer has
        equipped me with deep expertise and enthusiasm for delivering impactful
        projects.
      </motion.p>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Expertise in Backend Development
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            I specialize in backend technologies like Python (Flask), Node.js,
            and Laravel. From Websockets to Task Scheduling, I deliver robust
            server-side solutions.
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Frontend Proficiency
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Creating dynamic, user-friendly interfaces with React, Next.js, and
            Vue.js is my passion. I blend creativity with technical expertise to
            craft modern applications.
          </p>
        </div>
      </motion.div> */}
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">
        Areas Of Expertise
      </h2>
      <Spotlight className="max-w-xl mx-auto grid gap-6 grid-cols-1 lg:grid-cols-3 items-start lg:max-w-none group p-20">
        <Card
          icon={<FaCode size={40} />}
          title="Frontend Proficiency"
          descriptionHeader="Expertise in Frontend Development"
          description="Creating dynamic, user-friendly interfaces with React, Next.js, and Vue.js is my passion. I blend creativity with technical expertise to craft modern applications."
        />
        <Card
          icon={<FaDatabase size={40} />}
          title="Backend Proficiency"
          descriptionHeader="Expertise in Backend Development"
          description="I specialize in backend technologies like Python (Flask), Node.js, and Laravel. From Websockets to Task Scheduling, I deliver robust server-side solutions."
        />
        <Card
          icon={<IoLogoFigma size={40} />}
          title="Some Design Skills"
          descriptionHeader="Design Skills"
          description="Some foundational skills in UI/UX design, Figma. I can create wireframes, prototypes, and design systems."
        />
      </Spotlight>
      {/* Bento grid with examples work using same spotlight cards but different grid layout, meaning cards different rows and columns; 
      each card can take classname to style it differently
      */}
      {/* <div className="mx-auto grid max-w-4xl grid-flow-dense grid-cols-12 gap-4">
        <div className="col-span-8 bg-blue-300 p-4 rounded-lg row-span-4"></div>
        <div className="col-span-4  bg-blue-400 p-4 rounded-lg"></div>
        <div className="col-span-3 row-span-8 bg-gradient-to-r from-[#00ff75] to-[#3700ff] rounded-[20px] transition-all duration-300 hover:shadow-[0px_0px_30px_1px_rgba(0,255,117,0.3)]">
          <div className="h-full w-full bg-[#1a1a1a] rounded transition-all duration-200 hover:scale-[0.98] hover:rounded-[20px]"></div>
        </div>
        <div className="col-span-6 row-span-4 bg-blue-800 p-4 rounded-lg"></div>
        <div className="col-span-6 row-span-4 bg-blue-900 p-4 rounded-lg"></div>
        <div className="col-span-4 bg-blue-500 p-4 rounded-lg"></div>
        <div className="col-span-4 bg-blue-600 p-4 rounded-lg"></div>
      </div> */}
    </section>
  )
}

const Projects = () => {
  return (
    <section
      className="flex flex-col justify-center  my-[200px] bg-gradient-to-r from-white via-gray-100 to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-black "
      id="projects"
    >
      <motion.h2
        className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Projects
      </motion.h2>
      <GridContainer>
        <BentoCard
          link={"https://insta.savetube.me/de"}
          image={"/downloaderInsta.png"}
          title="Instagram Media Downloader"
          description="Download Instagram images, videos, and reels with this tool.
            "
          mousePosition={useMousePosition()}
          cardCSS="col-span-6 row-span-1 rounded-lg transition-all duration-300 hover:shadow-lg relative"
        />
        <BentoCard
          title="Tech Stack"
          techStackList={[
            "Python Flask",
            "ReactJS",
            "NextJS",
            "TailwindCSS",
            "Hetzner VPS",
          ]}
          mousePosition={useMousePosition()}
          cardCSS="col-span-5 row-span-1 rounded-lg transition-all duration-300 hover:shadow-lg"
        />
        <BentoCard
          techStackList={["NextJS", "ReactJs", "TailwindCSS", "Framer Motion"]}
          title="Tech Stack"
          mousePosition={useMousePosition()}
          cardCSS="col-span-4 row-span-1 rounded-lg transition-all duration-300 hover:shadow-lg"
        />
        <BentoCard
          link={"https://www.gifmagic.app/"}
          image="/gifmagic.png"
          title="GIF Editor"
          description="Create and edit GIFs with this tool. Fun experiment using FabricJS for the first time to edit GIFs on a canvas"
          mousePosition={useMousePosition()}
          cardCSS="col-span-8 row-span-1 rounded-lg transition-all duration-300 hover:shadow-lg"
        />
        <BentoCard
          link={"https://filetalky.com/"}
          images={["/filetalky1.png", "/filetalky2.png"]}
          title="Chat with Files"
          description="Chat with files and images with this tool. First time using AI-APIs like OpenAI ChatGPT or Google Gemini in a project. Properly parsing, rendering PDFS was a challenge."
          mousePosition={useMousePosition()}
          cardCSS="col-span-12 row-span-1 rounded-lg transition-all duration-300 hover:shadow-lg"
        />
      </GridContainer>
    </section>
  )
}

export const Socials = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      whileHover={{ height: "150px" }}
      className="z-30 fixed  left-[85%] md:left-[95%] top-[50%] w-[60px] rounded-full flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-all duration-300 group 
        bg-white dark:bg-slate-900  drop-shadow-[0px_0px_5px_rgba(79,_70,_229,_1)] "
    >
      {/* Shiny Blurry Border */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none blur-md 
        bg-gradient-to-br from-pink-500/50 via-purple-500/20 to-transparent dark:from-purple-700/50 dark:via-black/40 dark:to-transparent "
      ></div>
      {/* "Socials" Text */}
      <motion.div
        className="absolute text-black dark:text-white text-sm font-bold transition-all duration-200 group-hover:opacity-0"
        initial={{ scale: 1 }}
        whileHover={{ scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        Socials
      </motion.div>
      {/* Icons */}
      <motion.div className="flex flex-col items-center justify-center gap-3 h-full w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
        {/* Github Icon */}
        <motion.a
          whileHover={{ scale: 1.3, rotate: 10 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="text-black dark:text-white text-xl"
          href={"https://github.com/heinergiehl"}
        >
          <FaGithub size={27} />
        </motion.a>
        {/* YouTube Icon */}
        <motion.a
          href={"https://www.youtube.com/@codingislove3707"}
          whileHover={{ scale: 1.3, rotate: -10 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="text-black dark:text-white text-xl"
        >
          <FaYoutube size={27} />
        </motion.a>
        <motion.a
          href={"https://www.upwork.com/freelancers/~01e359856bc8297a0f"}
          whileHover={{ scale: 1.3, rotate: -10 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="text-black dark:text-white text-xl"
        >
          <Image src="/upwork.svg" width={27} height={27} alt="SVG Logo" />
        </motion.a>
      </motion.div>
    </motion.div>
  )
}

// Contact Component
const Contact = () => {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  const copyEmail = () => {
    navigator.clipboard.writeText("webdevislife2021@gmail.com")
    setCopied(true)
    toast({
      duration: 500,
      title: "Email Copied!",
      description: "You can now paste it anywhere.",
    })
  }

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [copied])
  return (
    <motion.section
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      id="contact"
      className="text-center p-8 bg-gradient-to-r from-white via-gray-100 to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-black rounded-lg shadow-lg mt-16"
    >
      <motion.h2
        className="text-3xl font-bold  mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Contact
      </motion.h2>
      <motion.div
        className="text-lg mb-4"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="flex flex-col items-center justify-center">
          Thanks for your interest. Let's chat!
          <Button variant="ghost" onClick={copyEmail}>
            {!copied ? <Mail /> : <Copy />}
          </Button>
        </div>
      </motion.div>
    </motion.section>
  )
}

// Main Component
const Main = () => {
  return (
    <>
      <ScrollIndicatorWithSections />
      <div className=" px-4 w-full flex flex-col">
        <Avatar />
        <AboutMe />
        <Skills />
        <Projects />
        <Socials />
        <Contact />
      </div>
    </>
  )
}

export default Main
