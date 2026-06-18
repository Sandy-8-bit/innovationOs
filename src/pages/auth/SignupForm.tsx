    import { Link } from 'react-router-dom'
    import { Input } from '../../components/ui/input'
    import { Button } from '../../components/ui/Button'
    import { EyeOff } from 'lucide-react'

    export const SignupForm = () => {
    return (
        <div className="w-full max-w-[520px]">
        {/* Heading */}
        <h1 className="text-[38px] font-light leading-tight text-[#2B2B2B]">
            Get Started with Cortexa™
        </h1>

        {/* Form */}
        <div className="mt-10 space-y-5">

            {/* Email */}
            <Input
            label="Email"
            placeholder="Enter your email"
            />

            {/* Password */}
            <div>
            <label className="mb-2 block text-sm text-[#3F3F46]">
                Password
            </label>

            <div className="relative">
                <Input
                type="password"
                placeholder="Create password"
                />
            </div>
            </div>

            {/* Confirm Password */}
            <div>
            <label className="mb-2 block text-sm text-[#3F3F46]">
                Confirm Password
            </label>

            <div className="relative">
                <Input
                type="password"
                placeholder="Confirm password"
                />

    
            </div>
            </div>

            {/* Terms */}
            <label className="flex items-center gap-3 text-sm text-[#71717A]">
            <input
                type="checkbox"
                className="h-4 w-4 rounded border-[#D4D4D8]"
            />

            <span>
                I Agree to{' '}
                <Link
                to="/terms"
                className="underline hover:text-[#2F6FED]"
                >
                Terms & Policy
                </Link>
            </span>
            </label>

            {/* Sign Up Button */}
            <Button>
            Sign Up
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-4 py-2">
            <div className="h-px flex-1 bg-[#E5E7EB]" />
            <span className="text-sm text-[#A1A1AA]">
                or
            </span>
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

            {/* Sign In */}
            <div className="pt-2 text-center text-sm">
            <span className="text-[#71717A]">
                Already have an account?{' '}
            </span>

            <Link
                to="/login"
                className="font-medium text-[#2F6FED] hover:underline"
            >
                Sign In
            </Link>
            </div>
        </div>
        </div>
    )
    }