"use client";

import { Instagram, Phone, Shield } from "lucide-react";


export default function Footer() {
  return (
<footer className="py-6 flex justify-center gap-4 mt-auto z-20">
        <a
          href="https://wa.me/5521995017071"
          target="_blank"
          className="flex items-center gap-2 text-green-500 hover:scale-105 transition-transform duration-300"
        >
          <Phone size={40} />
        </a>
        <a
          href="https://www.instagram.com/barbeariadaneguinha01?utm_source=ig_web_button_share_sheet&igsh=MXJveHAzajNkZGYyaA=="
          target="_blank"
          className="flex items-center gap-2 text-pink-500 hover:scale-105 transition-transform duration-300"
        >
          <Instagram size={40} />
        </a>
        <a
          href="/admin"
          className="flex items-center gap-2 text-blue-500 hover:scale-105 transition-transform duration-300"
        >
          <Shield size={40} />
        </a>
      </footer>
  );
}