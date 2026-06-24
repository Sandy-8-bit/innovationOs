import { Link, useNavigate } from 'react-router-dom'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { EyeOff } from 'lucide-react'

export const LoginForm = () => {

      const navigate = useNavigate()
  return (
    <div className="w-full max-w-[520px]">
      {/* Heading */}
      <h1 className="text-[38px] font-light leading-tight text-[#2B2B2B]">
        Sign In to Cortexa™
      </h1>

      <p className="mt-2 text-sm text-[#92908B]">
        Patent Seeding & Harvesting Platform
      </p>

      {/* Form */}
      <div className="mt-10 space-y-5">
        {/* Email */}
        <Input
          label="Email"
          placeholder="Eg: user@email.com"
        />

        {/* Password */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm text-[#3F3F46]">
              Password
            </label>

            <Link
              to="/forgot-password"
              className="text-xs text-[#2F6FED] hover:underline"
            >
              Forgot Password
            </Link>
          </div>

          <div className="relative">
            <Input
              type="password"
              placeholder="••••••••"
            />

          </div>
        </div>

        {/* Sign In Button */}
        <Button className="mt-2">
          Sign In
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-4 py-2">
          <div className="h-px flex-1 bg-[#E5E7EB]" />
          <span className="text-sm text-[#A1A1AA]">or</span>
          <div className="h-px flex-1 bg-[#E5E7EB]" />
        </div>

        {/* Microsoft Login */}
        <Button
          variant="microsoft"
          className="flex items-center justify-center gap-3"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
            alt="Microsoft"
            className="h-4 w-4"
          />
          Continue with Microsoft
        </Button>

        {/* Register */}
  <div className="pt-2 text-center text-sm">
        <span className="text-[#71717A]">
          No Account?{' '}
        </span>

        <span
          onClick={() => navigate('/signup')}
          className="cursor-pointer font-medium text-[#2F6FED] hover:underline"
        >
          Register
        </span>
      </div>
      </div>
    </div>
  )
}