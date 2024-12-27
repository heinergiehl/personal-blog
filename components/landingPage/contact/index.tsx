import { useEffect, useState } from "react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Copy, Mail } from "lucide-react"

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

export default Contact
