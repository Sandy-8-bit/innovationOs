/**
 * ComponentShowcase
 * Cortexa UI — full component library preview page
 *
 * Mount this at /showcase (or /dev/showcase) for internal reference.
 * Remove from production builds.
 */

import { useState } from 'react'

import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { TextArea } from './ui/TextArea'
import CustomDropdown from './ui/CustomDropdown'
import { MultiSelectDropdown } from './ui/MultiSelectDropdown'
import { TypeSearchDropdown } from './ui/TypeSearchDropdown'
import { Badge } from './ui/Badge'
import { Card, CardHeader } from './ui/Card'
import { Toggle } from './ui/Toggle'
import { ProgressSteps, type Step } from './ui/ProgressSteps'
import { Tabs } from './ui/Tabs'
import { FileDropzone } from './ui/FileDropzone'

import {
  Upload,
  LayoutDashboard,
  Search,
  Cpu,
  Zap,
  Mail,
  Lock,
} from 'lucide-react'

/* ── Demo data ─────────────────────────────────────────────────────────────── */



const AI_MODEL_OPTIONS = [
  { label: 'GPT-4o · Only', value: 'gpt-4o' },
  { label: 'GPT-4o + Claude', value: 'gpt-4o-claude' },
  { label: 'Claude 3.5 Sonnet', value: 'claude-3-5-sonnet' },
  { label: 'Gemini 1.5 Pro', value: 'gemini-1-5-pro' },
]

const iconSrc="/upload.png"

const DOMAIN_OPTIONS = [
  'Machine Learning / AI',
  'Computer Vision',
  'Natural Language Processing',
  'Robotics',
  'Semiconductor Design',
  'Biomedical Engineering',
  'Quantum Computing',
  'Cybersecurity',
]

const PIPELINE_STEPS: Step[] = [
  { id: 'inject',   label: 'Inject',   status: 'completed' },
  { id: 'extract',  label: 'Extract',  status: 'completed' },
  { id: 'evidence', label: 'Evidence', status: 'active'    },
  { id: 'score',    label: 'Score',    status: 'pending'   },
  { id: 'report',   label: 'Report',   status: 'pending'   },
]

const NAV_TABS = [
  { id: 'all',        label: 'All Jobs',   count: 24 },
  { id: 'running',    label: 'Running',    count: 3  },
  { id: 'completed',  label: 'Completed',  count: 18 },
  { id: 'seeding',    label: 'Seeding'                },
  { id: 'harvesting', label: 'Harvesting'             },
]

/* ── Section wrapper ────────────────────────────────────────────────────────── */

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section>
    <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.1em] text-[#A1A1AA]">
      {title}
    </h2>
    {children}
  </section>
)

/* ── Showcase ───────────────────────────────────────────────────────────────── */

export const ComponentShowcase = () => {
  /* button */
  const [loading, setLoading] = useState(false)

  /* inputs */
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [note, setNote]         = useState('')

  /* dropdowns */
  const [engine, setEngine]         = useState('')
  const [models, setModels]         = useState<string[]>([])
  const [domain, setDomain]         = useState('')

  /* toggle */
  const [notify, setNotify]     = useState(true)
  const [autoRun, setAutoRun]   = useState(false)

  /* tabs */
  const [activeTab, setActiveTab] = useState('all')

  /* simulate load */
  const handleLoad = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1800)
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* ── header ── */}
      <header className="sticky top-0 z-40 border-b border-[#E4E4E7] bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2F6FED]">
              <Cpu size={15} className="text-white" />
            </div>
            <span className="text-[15px] font-semibold text-[#18181B]">Cortexa UI</span>
            <Badge variant="blue">v1.0</Badge>
          </div>
          <span className="text-[13px] text-[#A1A1AA]">Component Showcase</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-14 px-6 py-12">

        {/* ── BUTTONS ─────────────────────────────────────────────────── */}
        <Section title="Buttons">
          <Card>
            <CardHeader title="Button" description="5 variants · 3 sizes · loading state · icon slots" />

            <div className="space-y-6">
              {/* variants */}
              <div>
                <p className="mb-3 text-[12px] text-[#A1A1AA] uppercase tracking-wide font-bold">Variants</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="microsoft">
                    <svg width="16" height="16" viewBox="0 0 21 21">
                      <path fill="#f25022" d="M0 0h10v10H0z"/>
                      <path fill="#00a4ef" d="M11 0h10v10H11z"/>
                      <path fill="#7fba00" d="M0 11h10v10H0z"/>
                      <path fill="#ffb900" d="M11 11h10v10H11z"/>
                    </svg>
                    Sign in with Microsoft
                  </Button>
                </div>
              </div>

              {/* sizes */}
              <div>
                <p className="mb-3 text-[12px] text-[#A1A1AA] uppercase tracking-wide font-bold">Sizes</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm" variant="primary">Small</Button>
                  <Button size="md" variant="primary">Medium</Button>
                  <Button size="lg" variant="primary">Large</Button>
                </div>
              </div>

              {/* icons + loading */}
              <div>
                <p className="mb-3 text-[12px] text-[#A1A1AA] uppercase tracking-wide font-bold">Icons & Loading</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button icon={<Upload size={15} />}>Upload Documents</Button>
                  <Button variant="secondary" icon={<Search size={15} />}>Search</Button>
                  <Button icon={<Zap size={15} />} iconPosition="right" variant="secondary">
                    Run Analysis
                  </Button>
                  <Button loading={loading} onClick={handleLoad}>
                    {loading ? 'Processing…' : 'Click to Load'}
                  </Button>
                  <Button disabled variant="primary">Disabled</Button>
                </div>
              </div>
            </div>
          </Card>
        </Section>

        {/* ── INPUTS ──────────────────────────────────────────────────── */}
        <Section title="Inputs">
          <Card>
            <CardHeader title="Input" description="Text, password toggle, left icon, error, hint" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input
                label="Email Address"
                placeholder="name@company.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail size={15} />}
                hint="We'll never share your email."
                required
              />
              <Input
                label="Password"
                placeholder="Min. 8 characters"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock size={15} />}
                required
              />
              <Input
                label="Search"
                placeholder="Search documents…"
                leftIcon={<Search size={15} />}
                value=""
                onChange={() => {}}
              />
              <Input
                label="API Key"
                placeholder="sk-..."
                value="bad-key"
                onChange={() => {}}
                error="Invalid API key format"
              />
              <Input
                label="Disabled field"
                placeholder="Not editable"
                value="Locked value"
                onChange={() => {}}
                disabled
              />
            </div>
          </Card>
        </Section>

        {/* ── TEXTAREA ────────────────────────────────────────────────── */}
        <Section title="TextArea">
          <Card>
            <CardHeader title="TextArea" description="Resizable · char counter · error state" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <TextArea
                label="Analysis Notes"
                placeholder="Describe the patent scope or prior art context…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={500}
                hint="Optional. Helps narrow search results."
                rows={4}
              />
              <TextArea
                label="Claim Draft"
                placeholder="A method comprising…"
                value=""
                onChange={() => {}}
                rows={4}
                error="Claim text must be at least 30 characters"
              />
            </div>
          </Card>
        </Section>

        {/* ── DROPDOWNS ───────────────────────────────────────────────── */}
        <Section title="Dropdowns">
          <Card>
            <CardHeader title="CustomDropdown" description="Portal-based · search · scroll-tracked · keyboard close" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <CustomDropdown
                label="Engine"
                options={AI_MODEL_OPTIONS}
                value={engine}
                onChange={setEngine}
                placeholder="Select engine…"
                required
              />
              <CustomDropdown
                label="Seed Corpus Domain"
                options={AI_MODEL_OPTIONS}
                value={domain}
                onChange={setDomain}
                placeholder="Select domain…"
              />
              <CustomDropdown
                label="Disabled"
                options={AI_MODEL_OPTIONS}
                value=""
                onChange={() => {}}
                placeholder="Not available"
                disabled
              />
            </div>
          </Card>

          <div className="mt-5">
            <Card>
              <CardHeader title="MultiSelectDropdown" description="Multi-select chips · search · checkbox list" />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <MultiSelectDropdown
                  label="AI Models"
                  options={AI_MODEL_OPTIONS}
                  value={models}
                  onChange={setModels}
                  placeholder="Select models…"
                  required
                />
                <MultiSelectDropdown
                  label="Single Select Mode"
                  options={AI_MODEL_OPTIONS}
                  value={models.slice(0, 1)}
                  onChange={(v) => setModels(v)}
                  placeholder="Pick one…"
                  multiSelect={false}
                />
              </div>
            </Card>
          </div>

          <div className="mt-5">
            <Card>
              <CardHeader title="TypeSearchDropdown" description="Combobox · keyboard nav · clear button · inline search" />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <TypeSearchDropdown
                  label="Seed Corpus Domain"
                  options={DOMAIN_OPTIONS}
                  value={domain}
                  onChange={setDomain}
                  placeholder="Type to search domains…"
                />
                <TypeSearchDropdown
                  label="Disabled"
                  options={DOMAIN_OPTIONS}
                  value=""
                  onChange={() => {}}
                  placeholder="Not available"
                  disabled
                />
              </div>
            </Card>
          </div>
        </Section>

        {/* ── BADGES ──────────────────────────────────────────────────── */}
        <Section title="Badges">
          <Card>
            <CardHeader title="Badge" description="7 semantic variants · optional leading dot" />
            <div className="flex flex-wrap gap-3">
              <Badge variant="blue" dot>Running</Badge>
              <Badge variant="green" dot>Completed</Badge>
              <Badge variant="orange" dot>Pending</Badge>
              <Badge variant="red" dot>Failed</Badge>
              <Badge variant="purple">Patent Seeding</Badge>
              <Badge variant="gray">Draft</Badge>
              <Badge variant="default">Default</Badge>
              <Badge variant="blue">GPT-4o</Badge>
              <Badge variant="green">Report Generated</Badge>
            </div>
          </Card>
        </Section>

        {/* ── CARDS ───────────────────────────────────────────────────── */}
        <Section title="Cards">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card hoverable>
              <div className="flex flex-col items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E4E4E7] bg-[#F9FAFB]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#52525B]">
                    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#18181B]">Connect Git Repository</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-[#A1A1AA]">
                    Public or private GitHub / Azure DevOps — clone and extract code-level patent candidates.
                  </p>
                </div>
              </div>
            </Card>

            <Card hoverable>
              <div className="flex flex-col items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E4E4E7] bg-[#F9FAFB]">
                  <LayoutDashboard size={18} className="text-[#52525B]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#18181B]">Batch Upload Folder</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-[#A1A1AA]">
                    Select an entire folder — up to 100 documents queued and processed automatically via the pipeline.
                  </p>
                </div>
              </div>
            </Card>

            <Card padding="sm">
              <CardHeader title="With Header" description="Composable card header" />
              <p className="text-[13px] text-[#A1A1AA]">Card body content goes here. Mix and match padding and header variants.</p>
            </Card>
          </div>
        </Section>

        {/* ── TOGGLE ──────────────────────────────────────────────────── */}
        <Section title="Toggle">
          <Card>
            <CardHeader title="Toggle" description="Accessible checkbox-driven switch · sm and md sizes" />
            <div className="flex flex-col gap-5">
              <Toggle
                checked={notify}
                onChange={setNotify}
                label="Email Notifications"
                description="Receive an email when your analysis job completes."
              />
              <Toggle
                checked={autoRun}
                onChange={setAutoRun}
                label="Auto-run on upload"
                description="Start processing immediately after documents are uploaded."
                size="sm"
              />
              <Toggle
                checked={false}
                onChange={() => {}}
                label="Disabled toggle"
                disabled
              />
            </div>
          </Card>
        </Section>

        {/* ── PROGRESS STEPS ──────────────────────────────────────────── */}
        <Section title="Progress Steps">
          <Card>
            <CardHeader title="ProgressSteps" description="Pipeline stepper matching Job History view" />
            <div className="space-y-8">
              <div>
                <p className="mb-4 text-[12px] text-[#A1A1AA] font-medium">In progress (Evidence active)</p>
                <ProgressSteps steps={PIPELINE_STEPS} />
              </div>
              <div>
                <p className="mb-4 text-[12px] text-[#A1A1AA] font-medium">All completed</p>
                <ProgressSteps steps={PIPELINE_STEPS.map((s) => ({ ...s, status: 'completed' as const }))} />
              </div>
              <div>
                <p className="mb-4 text-[12px] text-[#A1A1AA] font-medium">Not started</p>
                <ProgressSteps steps={PIPELINE_STEPS.map((s, i) => ({ ...s, status: i === 0 ? 'active' as const : 'pending' as const }))} />
              </div>
            </div>
          </Card>
        </Section>

        {/* ── TABS ────────────────────────────────────────────────────── */}
        <Section title="Tabs">
          <Card>
            <CardHeader title="Tabs" description="Pill-style filter tabs with optional count chips" />
            <Tabs tabs={NAV_TABS} activeTab={activeTab} onChange={setActiveTab} />
            <p className="mt-4 text-[13px] text-[#A1A1AA]">
              Active: <span className="font-medium text-[#18181B]">{activeTab}</span>
            </p>
          </Card>
        </Section>

        {/* ── FILE DROPZONE ────────────────────────────────────────────── */}
        <Section title="File Dropzone">
          <Card>
            <CardHeader title="FileDropzone" description="Drag-and-drop + click upload · file list with remove" />
            <FileDropzone
              accept=".pdf,.docx,.txt"
              multiple
              maxFiles={10}
              iconSrc={iconSrc}
              onFilesChange={(files) => console.log('Files:', files)}
            />
          </Card>
        </Section>

      </main>
    </div>
  )
}

export default ComponentShowcase
