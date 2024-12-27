import { motion } from "framer-motion"
import { GridContainer, Card as BentoCard } from "../landingPage/bento/grid"
import useMousePosition from "@/utils/useMousePosition"

const Projects = () => {
  return (
    <section
      className="flex flex-col justify-center h-full  my-[200px] bg-gradient-to-r from-white via-gray-100 to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-black p-8"
      id="Projects"
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
          cardCSS="col-span-7 row-span-1 rounded-lg transition-all duration-300 hover:shadow-lg relative"
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

export default Projects
