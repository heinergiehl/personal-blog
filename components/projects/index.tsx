import { motion } from "framer-motion"
import useMousePosition from "@/utils/useMousePosition"
import { BentoCard } from "../landingPage/bento"
import GridContainer from "../landingPage/bento/grid"
const Projects = () => {
  return (
    <section
      className="min-h-screen flex flex-col justify-center h-full  my-[200px] bg-gradient-to-r from-white via-gray-100 to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-black p-8"
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
          cardCSS="col-span-5 row-span-1 rounded-lg transition-all duration-300 hover:shadow-lg"
        />
        <BentoCard
          techStackList={[
            "NextJS",
            "ReactJs",
            "TailwindCSS",
            "Framer Motion",
            "FabricJS",
            "FFMPEG.wasm",
          ]}
          title="Tech Stack"
          cardCSS="col-span-4 row-span-1 rounded-lg transition-all duration-300 hover:shadow-lg"
        />
        <BentoCard
          link={"https://gif-creator.heinerdevelops.tech"}
          image="/gifmagic.png"
          title="GIF Editor"
          description="I tried to create a tool, which allows to turn videos into GIFs, and edit them frame by frame by mainly using FabricJS. I used FFMPEG.wasm for video-to-GIF conversion, as well as for creating the final GIF. Everything is done in the browser. "
          cardCSS="col-span-8 row-span-1 rounded-lg transition-all duration-300 hover:shadow-lg"
        />

        <BentoCard
          techStackList={[
            "NextJS",
            "ReactJs",
            "TailwindCSS",
            "Shadcn",
            "TRPC",
            "TanstackQuery",
            "Drizzle ORM",
            "PostgreSQL",
            "Clerk",
            "FabricJS",
          ]}
          title="Tech Stack"
          cardCSS="col-span-4 row-span-1 rounded-lg transition-all duration-300 hover:shadow-lg"
        />
        <BentoCard
          link={"https://canva-clone.heinerdevelops.tech/"}
          image={"/canva-clone.png"}
          title="Canva Clone"
          description="Trying to build a fullstack app, which feels like canva.com."
          cardCSS="col-span-8 row-span-1 rounded-lg transition-all duration-300 hover:shadow-lg"
        />
        <BentoCard
          link={"https://react-three-carousel.vercel.app/"}
          image={"/three-carousel.png"}
          title="ThreeJS Carousel"
          description="I tried to build a carousel using ThreeJS and GSAP. For some cool effects, I used Shaders/GLSL. This was a fun experiment to learn more about ThreeJS and Shaders."
          cardCSS="col-span-8  rounded-lg transition-all duration-300 hover:shadow-lg"
        />
        <BentoCard
          techStackList={["ReactJs", "GSAP", "ThreeJS", "Shaders/GLSL"]}
          title="Tech Stack"
          cardCSS="col-span-4 rounded-lg transition-all duration-300 hover:shadow-lg "
        />
      </GridContainer>
    </section>
  )
}
export default Projects
