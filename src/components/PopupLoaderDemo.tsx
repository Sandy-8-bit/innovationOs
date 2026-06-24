/**
 * PopupLoaderDemo.tsx
 * ─────────────────────────────────────────────────────────────
 * Drop-in usage file to preview all Popup + Loader variants.
 * Just render <PopupLoaderDemo /> on any page.
 * ─────────────────────────────────────────────────────────────
 */

import React, { useState } from "react";
import {
  Popup,
  PopupPrimaryButton,
  PopupSecondaryButton,
  PopupDangerButton,
  type PopupVariant,
} from "./ui/Popup";
import { Loader, type LoaderVariant, type LoaderSize } from "./ui/Loader";

// ─── Section wrapper ──────────────────────────────────────────────────────────

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <section className="mb-10">
    <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-4">
      {title}
    </h2>
    {children}
  </section>
);

// ─── Demo ─────────────────────────────────────────────────────────────────────

export const PopupLoaderDemo: React.FC = () => {
  const [activePopup, setActivePopup] = useState<PopupVariant | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleConfirm = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setConfirmLoading(false);
      setActivePopup(null);
    }, 1800);
  };

  const openOverlay = () => {
    setOverlayVisible(true);
    setTimeout(() => setOverlayVisible(false), 2200);
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA] px-8 py-10 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Page header */}
        <div className="mb-10 border-b border-slate-200 pb-6">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#2563EB] mb-1">
            Cortexa UI
          </p>
          <h1 className="text-2xl font-bold text-slate-800">
            Popup + Loader — usage demo
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            All variants extracted from the Cortexa design language.
          </p>
        </div>

        {/* ── Popup triggers ─────────────────────────────────────────── */}
        <Section title="Popup variants">
          <div className="flex flex-wrap gap-3">
            {(
              [
                { variant: "default", label: "Info popup" },
                { variant: "success", label: "Success popup" },
                { variant: "warning", label: "Warning popup" },
                { variant: "danger",  label: "Danger popup" },
              ] as { variant: PopupVariant; label: string }[]
            ).map(({ variant, label }) => (
              <button
                key={variant}
                onClick={() => setActivePopup(variant)}
                className="px-4 py-2 text-[13px] font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
              >
                {label}
              </button>
            ))}
          </div>
        </Section>

        {/* ── Loader: spinner ───────────────────────────────────────── */}
        <Section title="Loader — spinner (all sizes)">
          <div className="flex flex-wrap items-center gap-8 p-5 bg-white rounded-xl border border-slate-100 shadow-sm">
            {(["xs", "sm", "md", "lg", "xl"] as LoaderSize[]).map((size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <Loader variant="spinner" size={size} color="blue" />
                <span className="text-[11px] text-slate-400">{size}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Loader: dots ──────────────────────────────────────────── */}
        <Section title="Loader — dots">
          <div className="flex flex-wrap items-center gap-8 p-5 bg-white rounded-xl border border-slate-100 shadow-sm">
            {(["sm", "md", "lg"] as LoaderSize[]).map((size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <Loader variant="dots" size={size} color="blue" />
                <span className="text-[11px] text-slate-400">{size}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Loader: pulse ─────────────────────────────────────────── */}
        <Section title="Loader — pulse">
          <div className="flex flex-wrap items-center gap-8 p-5 bg-white rounded-xl border border-slate-100 shadow-sm">
            {(["sm", "md", "lg"] as LoaderSize[]).map((size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <Loader variant="pulse" size={size} color="blue" />
                <span className="text-[11px] text-slate-400">{size}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Loader: bar ───────────────────────────────────────────── */}
        <Section title="Loader — progress bar">
          <div className="p-5 bg-white rounded-xl border border-slate-100 shadow-sm">
            <Loader variant="bar" color="blue" className="w-full" />
          </div>
        </Section>

        {/* ── Loader with label ─────────────────────────────────────── */}
        <Section title="Loader — with label">
          <div className="flex flex-wrap items-center gap-8 p-5 bg-white rounded-xl border border-slate-100 shadow-sm">
            <Loader variant="spinner" size="md" color="blue" label="Syncing..." />
            <Loader variant="dots" size="md" color="blue" label="Processing" />
            <Loader variant="pulse" size="md" color="blue" label="Live" />
          </div>
        </Section>

        {/* ── Loader: colors on dark bg ─────────────────────────────── */}
        <Section title="Loader — white variant (on blue)">
          <div className="flex flex-wrap items-center gap-8 p-5 bg-[#2563EB] rounded-xl">
            <Loader variant="spinner" size="md" color="white" label="Loading" />
            <Loader variant="dots" size="md" color="white" />
            <Loader variant="pulse" size="sm" color="white" />
          </div>
        </Section>

        {/* ── Loader: overlay trigger ───────────────────────────────── */}
        <Section title="Loader — full overlay">
          <button
            onClick={openOverlay}
            className="px-4 py-2 text-[13px] font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors shadow-sm shadow-blue-900/20"
          >
            Trigger overlay (2s)
          </button>
        </Section>
      </div>

      {/* ── Popup: default ────────────────────────────────────────────── */}
      <Popup
        open={activePopup === "default"}
        onClose={() => setActivePopup(null)}
        title="Patient workflow updated"
        description="The scheduling queue has been recalculated. Changes will take effect within 30 seconds."
        variant="default"
        footer={
          <>
            <PopupSecondaryButton onClick={() => setActivePopup(null)}>
              Dismiss
            </PopupSecondaryButton>
            <PopupPrimaryButton
              onClick={handleConfirm}
              disabled={confirmLoading}
            >
              {confirmLoading ? (
                <Loader variant="spinner" size="xs" color="white" />
              ) : null}
              Confirm
            </PopupPrimaryButton>
          </>
        }
      />

      {/* ── Popup: success ────────────────────────────────────────────── */}
      <Popup
        open={activePopup === "success"}
        onClose={() => setActivePopup(null)}
        title="Workflow saved successfully"
        description="Your automation playbook is active and will run on the next trigger cycle."
        variant="success"
        footer={
          <PopupPrimaryButton
            onClick={() => setActivePopup(null)}
            className="bg-emerald-500 hover:bg-emerald-600 shadow-emerald-900/20"
          >
            Done
          </PopupPrimaryButton>
        }
      />

      {/* ── Popup: warning ────────────────────────────────────────────── */}
      <Popup
        open={activePopup === "warning"}
        onClose={() => setActivePopup(null)}
        title="Rate limit approaching"
        description="You have used 85% of your monthly API quota. Consider upgrading your plan to avoid service interruption."
        variant="warning"
        footer={
          <>
            <PopupSecondaryButton onClick={() => setActivePopup(null)}>
              Ignore
            </PopupSecondaryButton>
            <PopupPrimaryButton
              onClick={() => setActivePopup(null)}
              className="bg-amber-500 hover:bg-amber-600 shadow-amber-900/20"
            >
              Upgrade plan
            </PopupPrimaryButton>
          </>
        }
      >
        <div className="mt-1 p-3 bg-amber-50 border border-amber-100 rounded-lg text-[13px] text-amber-800">
          Current usage: <strong>8,521 / 10,000</strong> requests this month.
        </div>
      </Popup>

      {/* ── Popup: danger ─────────────────────────────────────────────── */}
      <Popup
        open={activePopup === "danger"}
        onClose={() => setActivePopup(null)}
        title="Delete this playbook?"
        description="This action cannot be undone. All associated tasks and run history will be permanently removed."
        variant="danger"
        footer={
          <>
            <PopupSecondaryButton onClick={() => setActivePopup(null)}>
              Cancel
            </PopupSecondaryButton>
            <PopupDangerButton
              onClick={handleConfirm}
              disabled={confirmLoading}
            >
              {confirmLoading ? (
                <Loader variant="spinner" size="xs" color="white" />
              ) : null}
              Delete playbook
            </PopupDangerButton>
          </>
        }
      />

      {/* ── Overlay loader ────────────────────────────────────────────── */}
      <Loader
        variant="overlay"
        visible={overlayVisible}
        label="Syncing workflows…"
        size="lg"
      />
    </div>
  );
};

export default PopupLoaderDemo;
