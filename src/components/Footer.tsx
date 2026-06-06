import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[#F8FAFB] px-6 pb-6 pt-12 select-none">
      <div className="max-w-7xl mx-auto bg-[#1A1A1A] text-white rounded-[32px] p-10 md:p-20 shadow-xl overflow-hidden relative">
        
        {/* Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 pb-12">
          
          {/* Column 1: Info and Socials */}
          <div className="space-y-6">
            <p className="text-gray-400 text-xs font-semibold leading-relaxed max-w-xs">
              We offer a wide range of premium rental properties and smart lease agreements to fit your lifestyle. Discover verified, high-fidelity listings in Sri Lanka.
            </p>
            <div className="flex items-center space-x-3.5 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black hover:bg-[#1A1A1A] hover:text-white transition shadow-sm" aria-label="Facebook">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M9 8H7v3h2v9h3v-9h3.6l.4-3h-4V6.5c0-.8.2-1 1-1h3V2.1C16.4 2 15 2 13.5 2 10.5 2 9 3.5 9 6.5V8z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black hover:bg-[#1A1A1A] hover:text-white transition shadow-sm" aria-label="Linkedin">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black hover:bg-[#1A1A1A] hover:text-white transition shadow-sm" aria-label="Play">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Extra Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">Extra links</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-gray-400">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/search" className="hover:text-white transition">Buyers</Link></li>
              <li><Link href="/search" className="hover:text-white transition">Sellers</Link></li>
              <li><Link href="#" className="hover:text-white transition">Our team</Link></li>
              <li><Link href="#" className="hover:text-white transition">About Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">Contact</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-gray-400">
              <li>123 Example Road, Colombo 03, Sri Lanka</li>
              <li><a href="mailto:email@example.com" className="hover:text-white transition">email@example.com</a></li>
              <li><a href="tel:5555555555" className="hover:text-white transition">(555) 555-5555</a></li>
            </ul>
          </div>

        </div>

      </div>
    </footer>
  );
}


