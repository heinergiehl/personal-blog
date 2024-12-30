import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Copy, Mail } from "lucide-react"

interface CopyEmailButtonProps {
  email: string // The email to copy
}

const CopyEmailButton = ({ email }: CopyEmailButtonProps) => {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const copyEmail = () => {
    navigator.clipboard.writeText(email)
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
    <Button variant="ghost" onClick={copyEmail}>
      {!copied ? <Mail /> : <Copy />}
    </Button>
  )
}

export default CopyEmailButton
