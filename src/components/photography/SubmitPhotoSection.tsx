'use client';

import React from 'react';
import {
  MessageCircle,
  Mail,
  CheckCircle2,
  ShieldCheck,
  Camera,
  AlertCircle,
  FileCheck2,
  Sparkles,
} from 'lucide-react';
import { InstagramIcon } from '@/components/common/Icon';
import {
  ROYAL_KORUTLA_PHONE_DISPLAY,
  ROYAL_KORUTLA_OFFICIAL_EMAIL,
  getRoyalKorutlaWhatsAppUrl,
  WHATSAPP_PREFILLED_MESSAGES,
} from '@/config/contact';

export const SubmitPhotoSection: React.FC = () => {
  const whatsappUrl = getRoyalKorutlaWhatsAppUrl(WHATSAPP_PREFILLED_MESSAGES.photoSubmission);

  const emailSubject = encodeURIComponent('[Photo Submission] Korutla Through Your Lens');
  const emailBody = encodeURIComponent(
    `Hello Royal Korutla Team,\n\nI would like to submit my photograph for "Korutla Through Your Lens".\n\n1. Photo Title: \n2. Photographer Display Name: \n3. Location in Korutla: \n4. Story / Caption: \n5. Instagram / Portfolio Link (Optional): \n\nI confirm that I took this photograph, own 100% of the copyright, and give explicit permission to Royal Korutla to display this photo publicly on the website with attribution.\n\n(Please find the high-resolution photo attached.)`
  );
  const emailUrl = `mailto:${ROYAL_KORUTLA_OFFICIAL_EMAIL}?subject=${emailSubject}&body=${emailBody}`;

  const instagramEnv = process.env.NEXT_PUBLIC_ROYAL_KORUTLA_INSTAGRAM;

  return (
    <section id="submit-photo" className="space-y-8 scroll-mt-24">
      {/* Header Card */}
      <div className="rounded-3xl p-6 sm:p-10 border border-[#E8E5DF] bg-white shadow-xs">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8E5DF] text-[#E66A32] text-xs font-bold">
            <Camera className="w-3.5 h-3.5" />
            <span>Community Submissions — Version 1</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#26352D] tracking-tight">
            Submit Your Photo to <span className="text-[#E66A32]">Korutla Through Your Lens</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#647067] leading-relaxed font-normal">
            Are you a local photographer, hobbyist, or resident with an eye for Korutla’s special moments? Share your perspective of our streets, landmarks, sunsets, celebrations, and daily life.
          </p>
        </div>

        {/* Verified Submission Channels */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. WhatsApp Submission (Verified) */}
          <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8E5DF] flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
                <MessageCircle className="w-5 h-5 fill-[#25D366]" />
              </div>
              <h3 className="text-sm font-bold text-[#26352D]">WhatsApp Submission</h3>
              <p className="text-xs text-[#647067] leading-relaxed">
                Send your high-resolution image directly as an uncompressed document or photo to our verified coordinator.
              </p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp: {ROYAL_KORUTLA_PHONE_DISPLAY}</span>
            </a>
          </div>

          {/* 2. Email Submission (Verified) */}
          <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8E5DF] flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#E66A32]/10 flex items-center justify-center text-[#E66A32]">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#26352D]">Email Submission</h3>
              <p className="text-xs text-[#647067] leading-relaxed">
                Email your original photo with title, caption, location, and your preferred public attribution credit.
              </p>
            </div>
            <a
              href={emailUrl}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#26352D] hover:bg-[#1B2721] text-white font-bold text-xs transition-colors shadow-xs"
            >
              <Mail className="w-4 h-4" />
              <span>Email: {ROYAL_KORUTLA_OFFICIAL_EMAIL}</span>
            </a>
          </div>

          {/* 3. Instagram DM (Honest Fallback if not configured) */}
          <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8E5DF] flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#E66A32]/10 flex items-center justify-center text-[#E66A32]">
                <InstagramIcon className="w-5 h-5 fill-current" />
              </div>
              <h3 className="text-sm font-bold text-[#26352D]">Instagram DM</h3>
              <p className="text-xs text-[#647067] leading-relaxed">
                {instagramEnv
                  ? 'Send a direct message with your photograph and story to our verified Instagram account.'
                  : 'Official Instagram direct messaging channel is pending administrator configuration.'}
              </p>
            </div>
            {instagramEnv ? (
              <a
                href={`https://instagram.com/${instagramEnv.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E8E5DF] text-[#26352D] hover:text-[#E66A32] font-bold text-xs transition-colors shadow-xs"
              >
                <InstagramIcon className="w-4 h-4 fill-current" />
                <span>Message on Instagram</span>
              </a>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E8E5DF] text-[11px] font-medium text-[#647067]">
                <AlertCircle className="w-3.5 h-3.5 text-[#E66A32] shrink-0" />
                <span>Use WhatsApp or Email above</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submission Checklist & Explicit Permission Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submission Checklist (Items 1-8) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E5DF] space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E8E5DF]">
            <FileCheck2 className="w-5 h-5 text-[#E66A32]" />
            <h3 className="text-base font-extrabold text-[#26352D]">What to Include with Your Submission</h3>
          </div>

          <ol className="space-y-2.5 text-xs text-[#647067] font-medium list-none">
            <li className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#FAF7F2] border border-[#E8E5DF] text-[10px] font-bold text-[#E66A32] shrink-0">1</span>
              <span><strong>The photograph:</strong> Original, clear high-resolution image of Korutla town, landmarks, events, or nature.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#FAF7F2] border border-[#E8E5DF] text-[10px] font-bold text-[#E66A32] shrink-0">2</span>
              <span><strong>Photographer display name:</strong> Your real name or professional pseudonym for attribution.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#FAF7F2] border border-[#E8E5DF] text-[10px] font-bold text-[#E66A32] shrink-0">3</span>
              <span><strong>Photo title:</strong> A short, descriptive title representing the moment.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#FAF7F2] border border-[#E8E5DF] text-[10px] font-bold text-[#E66A32] shrink-0">4</span>
              <span><strong>Optional caption / story:</strong> 1–3 sentences describing what makes this scene memorable.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#FAF7F2] border border-[#E8E5DF] text-[10px] font-bold text-[#E66A32] shrink-0">5</span>
              <span><strong>Optional location:</strong> Landmark, street name, ward number, or surrounding village.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#FAF7F2] border border-[#E8E5DF] text-[10px] font-bold text-[#E66A32] shrink-0">6</span>
              <span><strong>Optional social link:</strong> Your public Instagram handle or personal portfolio URL.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#FAF7F2] border border-[#E8E5DF] text-[10px] font-bold text-[#E66A32] shrink-0">7</span>
              <span><strong>Ownership confirmation:</strong> Confirmation that you took the photo and own the copyright.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#FAF7F2] border border-[#E8E5DF] text-[10px] font-bold text-[#E66A32] shrink-0">8</span>
              <span><strong>Explicit permission:</strong> Clear statement granting permission to display the photo on Royal Korutla with full credit.</span>
            </li>
          </ol>
        </div>

        {/* Ownership Rights & Publication Ethics */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E5DF] space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E8E5DF]">
            <ShieldCheck className="w-5 h-5 text-[#26352D]" />
            <h3 className="text-base font-extrabold text-[#26352D]">Copyright, Permissions &amp; Privacy</h3>
          </div>

          <div className="space-y-3 text-xs text-[#647067] leading-relaxed">
            <p>
              <strong className="text-[#26352D]">Photographers retain 100% ownership:</strong> Submitting a photograph does not transfer your copyright or grant commercial ownership to Royal Korutla.
            </p>
            <p>
              <strong className="text-[#26352D]">Explicit permission required:</strong> Before any image is published, our curation team records explicit permission covering your chosen attribution, caption, and social link.
            </p>
            <p>
              <strong className="text-[#26352D]">People and child safety:</strong> For photographs featuring identifiable people, consent from the subjects is required. Extra care is applied to photographs of children; parental permission is mandatory.
            </p>
            <p>
              <strong className="text-[#26352D]">Curatorial discretion:</strong> Submitting an image does not guarantee publication. Photos are curated for quality, community interest, and safety.
            </p>

            {/* Version 2 Note */}
            <div className="pt-2">
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E5DF] space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#E66A32]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Version 2 Web Upload Portal</span>
                </div>
                <p className="text-[11px] text-[#647067]">
                  Phase 1 uses verified direct coordinator channels to ensure original uncompressed files and recorded consent. A dedicated website submission portal with client-side image validation and tracking will follow in Version 2.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
