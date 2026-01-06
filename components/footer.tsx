import { ExternalLink, Heart, Code, Globe, Users, Server } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border/50 bg-card/30 animate-[fade-in_0.5s_ease-out_0.3s_both]">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Project Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Project</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/Mantequilla-Soft/hive-beneficiary-rewards"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Code className="h-4 w-4" />
                  GitHub Repository
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://mantequilla-soft.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Globe className="h-4 w-4" />
                  Mantequilla Soft
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://proyectoaliento.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Heart className="h-4 w-4" />
                  Proyecto Aliento
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://holahive.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Globe className="h-4 w-4" />
                  HolaHive.com
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Hive Ecosystem */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Hive Ecosystem</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://hive.io/eco"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Globe className="h-4 w-4" />
                  Hive.io
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://aliento.blog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Globe className="h-4 w-4" />
                  Aliento.blog
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://new.3speak.tv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Globe className="h-4 w-4" />
                  3Speak.tv
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://snapie.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Globe className="h-4 w-4" />
                  Snapie.io
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Support Us</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://witness.aliento.blog/witness/aliento"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-emerald-400"
                >
                  <Users className="h-4 w-4" />
                  Vote @aliento Witness
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://witness.aliento.blog/witness/snapie"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-emerald-400"
                >
                  <Users className="h-4 w-4" />
                  Vote @snapie Witness
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://witness.aliento.blog/witness/threespeak"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-emerald-400"
                >
                  <Users className="h-4 w-4" />
                  Vote @threespeak Witness
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
            <p className="mt-2 text-xs text-muted-foreground/70">Your witness vote helps secure the Hive blockchain</p>
          </div>

          {/* API Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">API Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://developers.hive.io/apidefinitions/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Server className="h-4 w-4" />
                  Hive API Docs
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Server className="h-4 w-4" />
                  api.hive.blog
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/30 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">Built with love for the Hive community</p>
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Mantequilla Soft</p>
        </div>
      </div>
    </footer>
  )
}
