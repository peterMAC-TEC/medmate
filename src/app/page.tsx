import Link from "next/link";
import { ArrowRight, Mic, HeartHandshake, Users, Languages, Sparkles } from "lucide-react";
import { Logo } from "@/components/Logo";
import { PhoneFrame } from "@/components/PhoneFrame";
import { MedicationCard } from "@/components/MedicationCard";
import { MedicationTimeline } from "@/components/Timeline";
import { medications, medicationTimeline } from "@/lib/mock-data";
import { PrimaryAction } from "@/components/PrimaryAction";

const languages = ["English", "हिन्दी", "தமிழ்", "తెలుగు", "ಕನ್ನಡ", "മലയാളം"];

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-cream">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <Logo size={34} />
        <Link
          href="/app"
          className="hidden rounded-xl bg-teal px-5 py-2.5 text-sm font-semibold text-warm-white sm:block"
        >
          Try MedMate
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-5 pb-16 pt-6 sm:px-8 lg:flex-row lg:items-center lg:gap-16 lg:pb-24 lg:pt-10">
        <div className="max-w-xl text-center lg:text-left">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-sage px-4 py-1.5 text-sm font-semibold text-teal-dark">
            <Sparkles size={16} /> Your everyday health companion
          </p>
          <h1 className="text-4xl font-bold leading-tight text-ink sm:text-5xl">Meet MedMate.</h1>
          <p className="mt-3 text-2xl font-semibold text-teal-dark">Your everyday health companion.</p>
          <p className="mt-5 text-lg text-muted">
            Medicine reminders, health tracking and a companion that remembers your journey — all in one
            simple place.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:justify-start">
            <Link href="/app">
              <PrimaryAction size="lg" icon={<ArrowRight size={20} />}>
                Try MedMate
              </PrimaryAction>
            </Link>
            <a href="#how-it-works">
              <PrimaryAction size="lg" variant="ghost">
                See how it works
              </PrimaryAction>
            </a>
          </div>
        </div>

        <PhoneFrame>
          <div className="flex flex-col gap-5 p-5 pt-8">
            <p className="text-2xl font-bold text-ink">Good morning, Sharma ji</p>
            <p className="text-base text-muted -mt-3">How are you feeling today?</p>
            <div className="grid grid-cols-4 gap-2">
              {["🙂", "😐", "🙁", "💬"].map((e) => (
                <div key={e} className="flex items-center justify-center rounded-xl bg-warm-white py-3 text-xl border border-ink/5">
                  {e}
                </div>
              ))}
            </div>
            <MedicationCard medication={medications[0]} compact />
            <div className="rounded-2xl bg-teal py-3.5 text-center font-semibold text-warm-white">
              I&apos;ve taken it
            </div>
            <div className="mt-1 flex flex-col items-center gap-2">
              <p className="text-sm font-semibold text-ink">Talk to MedMate</p>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal text-warm-white">
                <Mic size={26} />
              </div>
            </div>
          </div>
        </PhoneFrame>
      </section>

      {/* The problem / solution */}
      <section id="how-it-works" className="bg-warm-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-ink">The problem</h2>
              <p className="mt-3 text-lg text-muted">
                Managing medicines gets harder when there are multiple medications, changing doses, different
                doctors, long medical histories, and symptoms to remember.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-ink">The solution</h2>
              <p className="mt-3 text-lg text-muted">MedMate connects the dots.</p>
              <p className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-lg font-semibold text-teal-dark">
                <span>Prescribed</span>
                <span>→</span>
                <span>Taken</span>
                <span>→</span>
                <span>Felt</span>
                <span>→</span>
                <span>Changed</span>
                <span>→</span>
                <span>Remembered</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Voice companion */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <div className="flex items-center gap-2 text-teal-dark">
              <Mic size={22} />
              <p className="text-sm font-bold uppercase tracking-wide">Voice companion</p>
            </div>
            <h2 className="mt-3 text-3xl font-bold text-ink">Speak naturally. MedMate listens.</h2>
            <p className="mt-4 text-lg text-muted">
              Voice is a core part of MedMate, not an afterthought. Say how you feel, confirm a dose, or ask
              a question — in whichever language feels natural.
            </p>
          </div>
          <div className="order-1 flex flex-col gap-3 rounded-3xl bg-warm-white p-6 shadow-sm lg:order-2">
            <div className="self-start max-w-[85%] rounded-3xl rounded-bl-lg bg-cream px-5 py-3 text-ink">
              Good morning, Sharma ji. It&apos;s time for your morning medicine. Would you like to take it now?
            </div>
            <div className="self-end max-w-[85%] rounded-3xl rounded-br-lg bg-teal px-5 py-3 text-warm-white">
              Yes.
            </div>
            <div className="self-start max-w-[85%] rounded-3xl rounded-bl-lg bg-cream px-5 py-3 text-ink">
              Done. I&apos;ve marked your Amlodipine as taken. And how are you feeling this morning?
            </div>
            <div className="self-end max-w-[85%] rounded-3xl rounded-br-lg bg-teal px-5 py-3 text-warm-white">
              Little dizzy.
            </div>
            <div className="self-start max-w-[85%] rounded-3xl rounded-bl-lg bg-cream px-5 py-3 text-ink">
              I&apos;m sorry to hear that. Would you say the dizziness is mild, moderate, or severe?
            </div>
          </div>
        </div>
      </section>

      {/* Medication memory */}
      <section className="bg-warm-white py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-cream p-6">
            <MedicationTimeline events={medicationTimeline.slice(0, 5)} />
          </div>
          <div>
            <div className="flex items-center gap-2 text-teal-dark">
              <HeartHandshake size={22} />
              <p className="text-sm font-bold uppercase tracking-wide">Medication memory</p>
            </div>
            <h2 className="mt-3 text-3xl font-bold text-ink">MedMate remembers, so you don&apos;t have to.</h2>
            <p className="mt-4 text-lg text-muted">
              What was prescribed, who prescribed it, when it was taken, how it felt, and what changed
              afterward — connected into one clear timeline you can share with a doctor.
            </p>
          </div>
        </div>
      </section>

      {/* Family connection */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-2 text-teal-dark">
              <Users size={22} />
              <p className="text-sm font-bold uppercase tracking-wide">Family connection</p>
            </div>
            <h2 className="mt-3 text-3xl font-bold text-ink">Peace of mind for the whole family.</h2>
            <p className="mt-4 text-lg text-muted">
              Family members get a clear, data-rich view — adherence, recent symptoms, and dose changes —
              without ever needing to read the full history.
            </p>
          </div>
          <div className="rounded-3xl bg-teal p-6 text-warm-white">
            <p className="text-sm font-semibold opacity-80">Adherence this week</p>
            <p className="mt-1 text-5xl font-bold">92%</p>
            <div className="mt-5 flex items-center justify-between rounded-2xl bg-warm-white/10 px-4 py-3">
              <span>Dizziness</span>
              <span className="font-semibold">3 reports</span>
            </div>
            <div className="mt-2 flex items-center justify-between rounded-2xl bg-warm-white/10 px-4 py-3">
              <span>Amlodipine 5 mg → 10 mg</span>
              <span className="font-semibold">20 Aug</span>
            </div>
          </div>
        </div>
      </section>

      {/* Multilingual */}
      <section className="bg-warm-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <div className="mx-auto flex w-fit items-center gap-2 text-teal-dark">
            <Languages size={22} />
            <p className="text-sm font-bold uppercase tracking-wide">Multilingual</p>
          </div>
          <h2 className="mt-3 text-3xl font-bold text-ink">
            Speak naturally. In the language you&apos;re comfortable with.
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {languages.map((l) => (
              <span key={l} className="rounded-full bg-sage px-5 py-2 text-lg font-semibold text-teal-dark">
                {l}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-2xl px-5 text-center sm:px-8">
          <h2 className="text-3xl font-bold text-ink sm:text-4xl">
            Health is easier when someone remembers with you.
          </h2>
          <div className="mt-8 flex justify-center">
            <Link href="/app">
              <PrimaryAction size="lg" fullWidth={false} icon={<ArrowRight size={20} />}>
                Get started with MedMate
              </PrimaryAction>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-ink/8 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 text-sm text-muted sm:flex-row sm:justify-between sm:px-8">
          <Logo size={26} />
          <p>MedMate is a companion and tracking tool. It is not a substitute for professional medical advice.</p>
        </div>
      </footer>
    </div>
  );
}
