export interface Project {
  slug: string;
  title: string;
  description: string;
  image: string;
  liveUrl?: string; // Optional live URL
  techStack: string[];
  category: "Fullstack" | "Frontend" | "Tool" | "Experiment";
}

export const projects: Project[] = [
  {
    slug: "interview-scheduler",
    image: "/interview-scheduler.png",
    title: "Interview-Scheduler",
    description: "Allows the Employer to schedule interviews with candidates.",
    techStack: [
      "Laravel",
      "Vue.js",
      "Laravel Echo",
      "ShadCN-Vue",

      "TailwindCSS",
    ],
    category: "Fullstack",
    liveUrl: "https://interview-scheduler.heinerdevelops.tech",
  },
  {
    slug: "canva-clone",
    image: "/canva-clone.png",
    title: "Canva Clone",
    description: "Trying to build a fullstack app, which feels like canva.com.",
    techStack: ["Next.js", "TypeScript", "Fabric.js", "Tailwind CSS"],
    category: "Fullstack",
    liveUrl: "https://canva-clone.heinerdevelops.tech",
  },
  {
    slug: "gif-creator",
    image: "/gifmagic.png",
    title: "GIF Editor",
    description:
      "A browser-based tool to turn videos into editable GIFs using FFMPEG.wasm and Fabric.js.",
    techStack: ["React", "FFMPEG.wasm", "Fabric.js", "Vite"],
    category: "Tool",
    liveUrl: "https://gif-creator.heinerdevelops.tech",
  },
  {
    slug: "insta-media-downloader",
    image: "/downloaderInsta.png",
    title: "Instagram Media Downloader",
    description: "Download Instagram images, videos, and reels.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Python/Flask"],
    category: "Fullstack",
    liveUrl: "https://insta.savetube.me/de",
  },
  {
    slug: "threejs-carousel",
    image: "/three-carousel.png",
    title: "ThreeJS Carousel",
    description:
      "A fun experiment to learn more about ThreeJS and Shaders by building an interactive carousel.",
    techStack: ["Three.js", "GSAP", "GLSL", "Vite"],
    category: "Frontend",
    liveUrl: "https://react-three-carousel.vercel.app/",
  },
];
