import Image from "next/image"
import Spotlight, { SpotlightCard } from "./spotlight"
import { FaCode } from "react-icons/fa"
import { cn } from "@/lib/utils"
type CardProps = {
  className?: string
  title: string
  descriptionHeader: string
  description: string
  image?: string
  icon?: React.ReactNode
}

export const Card = ({
  className = "",
  title,
  descriptionHeader,
  description,
  image,
  icon,
}: CardProps) => (
  <>
    {/* Card #1 */}
    <SpotlightCard>
      <div
        className={cn([
          "relative h-full bg-slate-300 dark:bg-slate-900 p-6 pb-8 rounded-[inherit] z-20 overflow-hidden",
          ,
          className,
        ])}
      >
        {/* Radial gradient */}
        <div
          className="absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-none -z-10 w-1/2 aspect-square"
          aria-hidden="true"
        >
          <div className="absolute inset-0 translate-z-0 bg-slate-50 dark:bg-slate-800 rounded-full blur-[80px]"></div>
        </div>
        <div className="flex flex-col h-full items-center text-center justify-center">
          {/* Image */}
          <div className="relative inline-flex">
            <div
              className="w-[40%] h-[40%] absolute inset-0 m-auto -translate-y-[10%] blur-3xl -z-10 rounded-full bg-indigo-600"
              aria-hidden="true"
            ></div>
            <div className="flex justify-center items-center gap-4">
              {" "}
              <div className=" ">{icon}</div> {title}
            </div>
            {image && (
              <Image
                className="inline-flex"
                // random image from api
                src={image}
                width={200}
                height={200}
                alt="Card 01"
              />
            )}
          </div>
          {/* Text */}
          <div className="grow mb-5">
            <h2 className="text-xl  font-bold mb-1 z-[100]">
              {descriptionHeader}
            </h2>
            <p className="text-sm text-slate-500 z-10">{description}</p>
          </div>
        </div>
      </div>
    </SpotlightCard>
  </>
)
