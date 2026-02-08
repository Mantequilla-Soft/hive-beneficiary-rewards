import { ExternalLink, Heart, Code, Globe, Users, Server } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/50 bg-card/30 animate-[fade-in_0.5s_ease-out_0.3s_both]">
      <div className="mx-auto max-w-5xl px-3 py-6 sm:px-4 sm:py-8">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
          {/* Project Links */}
          <div>
            <h3 className="mb-3 text-xs sm:text-sm font-semibold text-foreground">Project</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <a
                  href="https://github.com/Mantequilla-Soft/hive-beneficiary-rewards"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Code className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                  <span className="truncate">GitHub</span>
                  <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                </a>
              </li>
              <li>
                <a
                  href="https://mantequilla-soft.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Globe className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                  <span className="truncate">Mantequilla Soft</span>
                  <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                </a>
              </li>
              <li>
                <a
                  href="https://proyectoaliento.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Heart className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                  <span className="truncate">Proyecto Aliento</span>
                  <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                </a>
              </li>
              <li>
                <a
                  href="https://holahive.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Globe className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                  <span className="truncate">HolaHive</span>
                  <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                </a>
              </li>
            </ul>
          </div>

          {/* Hive Ecosystem */}
          <div>
            <h3 className="mb-3 text-xs sm:text-sm font-semibold text-foreground">Hive Ecosystem</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <a
                  href="https://hive.io/eco"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Globe className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                  <span className="truncate">Hive.io</span>
                  <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                </a>
              </li>
              <li>
                <a
                  href="https://aliento.blog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Globe className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                  <span className="truncate">Aliento.blog</span>
                  <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                </a>
              </li>
              <li>
                <a
                  href="https://new.3speak.tv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Globe className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                  <span className="truncate">3Speak.tv</span>
                  <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                </a>
              </li>
              <li>
                <a
                  href="https://snapie.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Globe className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                  <span className="truncate">Snapie.io</span>
                  <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-3 text-xs sm:text-sm font-semibold text-foreground">Support Us</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <a
                  href="https://witness.aliento.blog/witness/aliento"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-muted-foreground transition-colors hover:text-emerald-400"
                >
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                  <span className="truncate">@aliento</span>
                  <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                </a>
              </li>
              <li>
                <a
                  href="https://witness.aliento.blog/witness/snapie"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-muted-foreground transition-colors hover:text-emerald-400"
                >
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                  <span className="truncate">@snapie</span>
                  <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                </a>
              </li>
              <li>
                <a
                  href="https://witness.aliento.blog/witness/threespeak"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-muted-foreground transition-colors hover:text-emerald-400"
                >
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                  <span className="truncate">@threespeak</span>
                  <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                </a>
              </li>
            </ul>
            <p className="mt-1.5 sm:mt-2 text-[9px] sm:text-xs text-muted-foreground/70">
              Vote for witnesses to secure Hive
            </p>
          </div>

          {/* API Resources */}
          <div>
            <h3 className="mb-3 text-xs sm:text-sm font-semibold text-foreground">API Resources</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <a
                  href="https://developers.hive.io/apidefinitions/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Server className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                  <span className="truncate">Hive API Docs</span>
                  <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                </a>
              </li>
              <li>
                <span className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-muted-foreground">
                  <Server className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                  <span className="truncate">api.hive.blog</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-border/30 pt-4 sm:mt-8 sm:flex-row sm:gap-4 sm:pt-6">
          <p className="text-[10px] sm:text-xs text-muted-foreground text-center sm:text-left">
            Built with love for the Hive community
          </p>
          <p className="text-[10px] sm:text-xs text-muted-foreground" suppressHydrationWarning>
            &copy; {new Date().getFullYear()} Mantequilla Soft
          </p>
        </div>
      </div>
    </footer>
  )
}
