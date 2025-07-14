import {GithubIcon, LinkedinIcon} from 'lucide-react'
const Footer = () => {
  return (
    <footer className="bg-black text-white px-6 py-10 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold">GhostNote</h2>
          <p className="mt-2 text-sm text-gray-400">Whispers of anonymous thoughts.</p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col space-y-2 text-sm">
          <span className="uppercase text-gray-500 font-medium tracking-wide">Navigation</span>
          <a href="/" className="hover:text-gray-300">Home</a>
          <a href="/about" className="hover:text-gray-300">About</a>
          <a href="/contact" className="hover:text-gray-300">Contact</a>
        </div>

        {/* Social */}
        <div className="flex flex-col space-y-2 text-sm">
          <span className="uppercase text-gray-500 font-medium tracking-wide">Connect</span>
          <div className="flex space-x-4 mt-1">
            <a href="https://github.com/upper-m00n" className="hover:grayscale-0 grayscale transition-all">
              <GithubIcon/>
            </a>
            <a href="https://www.linkedin.com/in/ashutosh-sharma-063727144/" className="hover:grayscale-0 grayscale transition-all">
                <LinkedinIcon/>
              </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800 mt-10 pt-6 text-sm text-center text-gray-500">
        © {new Date().getFullYear()} GhostNote. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
