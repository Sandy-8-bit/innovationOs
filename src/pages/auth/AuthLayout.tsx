import { LoginForm } from './LoginForm'
import { SignupForm } from './SignupForm'

interface AuthPageProps {
  type: 'login' | 'signup'
}

export default function AuthPage({ type }: AuthPageProps) {
  return (
<div className="h-screen w-screen overflow-hidden p-2 bg-gradient-to-b from-[#E9F2FF] to-[#F6F6F6]">
  <div className="grid h-full w-full grid-cols-[40%_60%] gap-5">
    
    {/* Left */}
    <div className="h-full overflow-hidden rounded-2xl">
      <img
        src="/auth.png"
        alt="Cortexa"
        className="h-full w-full object-cover"
      />
    </div>

    {/* Right */}
    <div className="flex h-full items-center justify-center">
      <div className="w-full max-w-md">
        {type === 'login' ? <LoginForm /> : <SignupForm />}
      </div>
    </div>

  </div>
</div>
  )
}