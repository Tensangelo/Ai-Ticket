import { GitHubIcon } from "@/assets/icons/github";
import { SourceIcon } from "@/assets/icons/source";

const GITHUB_PROFILE_URL = "https://github.com/Tensangelo";
const GITHUB_REPO_URL = "https://github.com/Tensangelo/Ai-Ticket";

export function AppFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="mx-auto flex max-w-[95%] items-center justify-center gap-2 px-3 py-3 sm:gap-4 sm:px-4 sm:py-5">
        <a
          href={GITHUB_PROFILE_URL}
          aria-label="GitHub profile"
          className="inline-flex min-h-11 min-w-11 items-center justify-center text-muted hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon width="20" height="20" className="sm:h-6 sm:w-6" />
        </a>
        <p className="max-w-[10rem] text-center text-[10px] leading-4 text-muted sm:max-w-none sm:text-xs sm:leading-5">
          © {new Date().getFullYear()} Tensangelo. All rights reserved.
        </p>
        <a
          href={GITHUB_REPO_URL}
          aria-label="Source repository"
          className="inline-flex min-h-11 min-w-11 items-center justify-center text-muted hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SourceIcon width="20" height="20" className="sm:h-6 sm:w-6" />
        </a>
      </div>
    </footer>
  );
}
