import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = fileURLToPath(new URL("../", import.meta.url));
const fonts = join(root, ".vinext/fonts");
if (!existsSync(fonts)) throw new Error("Run npm run build:pages first to cache the site's Geist fonts.");

const temporary = mkdtempSync(join(tmpdir(), "jon-social-card-"));
const escapeXml = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
try {
  const config = join(temporary, "fonts.conf");
  writeFileSync(config, `<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "urn:fontconfig:fonts.dtd">
<fontconfig><include>/etc/fonts/fonts.conf</include><dir>${escapeXml(fonts)}</dir><cachedir>${escapeXml(temporary)}</cachedir></fontconfig>`);
  execFileSync("rsvg-convert", [
    "--format", "png",
    "--output", join(root, "public/images/jon-kinney-social.png"),
    join(root, "design/social-card.svg"),
  ], { env: { ...process.env, FONTCONFIG_FILE: config }, stdio: "inherit" });
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
