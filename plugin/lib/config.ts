/**
 * AI-DLC Configuration System
 *
 * Provides configuration loading with precedence:
 * 1. Intent frontmatter (highest priority)
 * 2. Repo settings (.ai-dlc/settings.yml)
 * 3. Built-in defaults (lowest priority)
 */

import { existsSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { join, dirname } from "node:path";

/**
 * Change strategy determines how git branches are organized
 */
export type ChangeStrategy = "trunk" | "unit" | "bolt" | "intent";

/**
 * VCS configuration for git or jj
 */
export interface VcsConfig {
	/** How changes are organized: trunk, unit, bolt, or intent */
	change_strategy: ChangeStrategy;
	/** Whether to create PR for elaborated intent review before planning */
	elaboration_review: boolean;
	/** Default/main branch name. 'auto' means detect from remote */
	default_branch: string;
	/** Whether to automatically merge completed unit branches */
	auto_merge?: boolean;
	/** Whether to squash commits when merging */
	auto_squash?: boolean;
}

// ============================================================================
// Provider Configuration
// ============================================================================

export type SpecProviderType = "notion" | "confluence" | "google-docs";
export type TicketingProviderType =
	| "jira"
	| "linear"
	| "github-issues"
	| "gitlab-issues";
export type DesignProviderType = "figma";
export type CommsProviderType = "slack" | "teams" | "discord";
export type VcsHostingType = "github" | "gitlab" | "bitbucket";
export type CiCdType = "github-actions" | "gitlab-ci" | "jenkins" | "circleci";

export interface ProviderEntry<T extends string> {
	type: T;
	config?: Record<string, unknown>;
}

export interface ProvidersConfig {
	specProvider?: ProviderEntry<SpecProviderType> | null;
	ticketingProvider?: ProviderEntry<TicketingProviderType> | null;
	designProvider?: ProviderEntry<DesignProviderType> | null;
	commsProvider?: ProviderEntry<CommsProviderType> | null;
	vcsHosting?: VcsHostingType | null;
	ciCd?: CiCdType | null;
}

export interface AiDlcSettings {
	git?: Partial<VcsConfig>;
	jj?: Partial<VcsConfig>;
	providers?: {
		specProvider?: ProviderEntry<SpecProviderType>;
		ticketingProvider?: ProviderEntry<TicketingProviderType>;
		designProvider?: ProviderEntry<DesignProviderType>;
		commsProvider?: ProviderEntry<CommsProviderType>;
	};
}

/**
 * Intent frontmatter with optional VCS overrides
 */
export interface IntentFrontmatter {
	workflow?: string;
	created?: string;
	status?: string;
	completed?: string;
	git?: Partial<VcsConfig>;
	jj?: Partial<VcsConfig>;
}

/**
 * Default VCS configuration values
 */
export const DEFAULT_VCS_CONFIG: VcsConfig = {
	change_strategy: "unit",
	elaboration_review: true,
	default_branch: "auto",
};

/**
 * Detect which VCS is being used in the given directory
 * @param directory - Directory to check (defaults to cwd)
 * @returns 'git' | 'jj' | null
 */
export function detectVcs(directory?: string): "git" | "jj" | null {
	const cwd = directory || process.cwd();

	try {
		// Check for jj first (it can coexist with git)
		execSync("jj root", { cwd, stdio: "pipe" });
		return "jj";
	} catch {
		// Not a jj repo
	}

	try {
		execSync("git rev-parse --git-dir", { cwd, stdio: "pipe" });
		return "git";
	} catch {
		// Not a git repo
	}

	return null;
}

/**
 * Find the repo root directory
 * @param directory - Starting directory (defaults to cwd)
 * @returns Repo root path or null
 */
export function findRepoRoot(directory?: string): string | null {
	const cwd = directory || process.cwd();
	const vcs = detectVcs(cwd);

	if (!vcs) return null;

	try {
		if (vcs === "jj") {
			return execSync("jj root", { cwd, stdio: "pipe" })
				.toString()
				.trim();
		}
		return execSync("git rev-parse --show-toplevel", { cwd, stdio: "pipe" })
			.toString()
			.trim();
	} catch {
		return null;
	}
}

/**
 * Parse YAML content using han parse yaml
 * @param content - YAML content string
 * @returns Parsed object or null
 */
function parseYaml(content: string): Record<string, unknown> | null {
	try {
		// Use han parse yaml for consistency with shell scripts
		const result = execSync("han parse yaml --json", {
			input: content,
			stdio: ["pipe", "pipe", "pipe"],
		});
		return JSON.parse(result.toString());
	} catch {
		// Fallback: try to parse as JSON (for simple cases)
		try {
			return JSON.parse(content);
		} catch {
			return null;
		}
	}
}

/**
 * Load repo-level settings from .ai-dlc/settings.yml
 * @param repoRoot - Repository root directory
 * @returns Settings object or null if not found
 */
export function loadRepoSettings(repoRoot?: string): AiDlcSettings | null {
	const root = repoRoot || findRepoRoot();
	if (!root) return null;

	const settingsPath = join(root, ".ai-dlc", "settings.yml");
	if (!existsSync(settingsPath)) return null;

	try {
		const content = readFileSync(settingsPath, "utf-8");
		const parsed = parseYaml(content);
		if (!parsed) return null;

		return parsed as AiDlcSettings;
	} catch {
		return null;
	}
}

/**
 * Load intent-level overrides from intent.md frontmatter
 * @param intentDir - Directory containing intent.md
 * @returns Partial settings from frontmatter or null
 */
export function loadIntentOverrides(
	intentDir: string,
): Pick<AiDlcSettings, "git" | "jj"> | null {
	const intentPath = join(intentDir, "intent.md");
	if (!existsSync(intentPath)) return null;

	try {
		const content = readFileSync(intentPath, "utf-8");

		// Extract frontmatter between --- markers
		const match = content.match(/^---\n([\s\S]*?)\n---/);
		if (!match) return null;

		const frontmatter = parseYaml(match[1]);
		if (!frontmatter) return null;

		const result: Pick<AiDlcSettings, "git" | "jj"> = {};

		if (frontmatter.git && typeof frontmatter.git === "object") {
			result.git = frontmatter.git as Partial<VcsConfig>;
		}
		if (frontmatter.jj && typeof frontmatter.jj === "object") {
			result.jj = frontmatter.jj as Partial<VcsConfig>;
		}

		return Object.keys(result).length > 0 ? result : null;
	} catch {
		return null;
	}
}

/**
 * Resolve the default branch name
 * If 'auto', detect from origin/HEAD or fall back to 'main'
 * @param configValue - The configured value ('auto' or explicit name)
 * @param directory - Directory to run git commands in
 * @returns Resolved branch name
 */
export function resolveDefaultBranch(
	configValue: string,
	directory?: string,
): string {
	if (configValue !== "auto") {
		return configValue;
	}

	const cwd = directory || process.cwd();

	try {
		// Try to get the default branch from origin/HEAD
		const result = execSync("git symbolic-ref refs/remotes/origin/HEAD", {
			cwd,
			stdio: "pipe",
		})
			.toString()
			.trim();

		// Result looks like: refs/remotes/origin/main
		const parts = result.split("/");
		return parts[parts.length - 1];
	} catch {
		// Fallback: check if main or master exists
		try {
			execSync("git rev-parse --verify main", { cwd, stdio: "pipe" });
			return "main";
		} catch {
			try {
				execSync("git rev-parse --verify master", { cwd, stdio: "pipe" });
				return "master";
			} catch {
				// Ultimate fallback
				return "main";
			}
		}
	}
}

/**
 * Get merged VCS settings with precedence: intent → repo → defaults
 * @param options - Optional parameters
 * @returns Complete VcsConfig for the detected VCS
 */
export function getMergedSettings(options?: {
	intentDir?: string;
	repoRoot?: string;
	vcs?: "git" | "jj";
}): VcsConfig {
	const repoRoot = options?.repoRoot || findRepoRoot();
	const vcs = options?.vcs || detectVcs() || "git";

	// Start with defaults
	const merged: VcsConfig = { ...DEFAULT_VCS_CONFIG };

	// Layer 1: Repo settings
	if (repoRoot) {
		const repoSettings = loadRepoSettings(repoRoot);
		if (repoSettings?.[vcs]) {
			Object.assign(merged, repoSettings[vcs]);
		}
	}

	// Layer 2: Intent overrides (highest priority)
	if (options?.intentDir) {
		const intentOverrides = loadIntentOverrides(options.intentDir);
		if (intentOverrides?.[vcs]) {
			Object.assign(merged, intentOverrides[vcs]);
		}
	}

	// Resolve 'auto' default_branch to actual value
	if (merged.default_branch === "auto") {
		merged.default_branch = resolveDefaultBranch("auto", repoRoot || undefined);
	}

	return merged;
}

/**
 * Get VCS config as environment variables (for shell scripts)
 * @param config - VcsConfig to export
 * @returns Object with AI_DLC_* environment variable names
 */
export function configToEnvVars(config: VcsConfig): Record<string, string> {
	return {
		AI_DLC_CHANGE_STRATEGY: config.change_strategy,
		AI_DLC_ELABORATION_REVIEW: config.elaboration_review ? "true" : "false",
		AI_DLC_DEFAULT_BRANCH: config.default_branch,
		AI_DLC_AUTO_MERGE: config.auto_merge ? "true" : "false",
		AI_DLC_AUTO_SQUASH: config.auto_squash ? "true" : "false",
	};
}

// ============================================================================
// Provider Detection & Loading
// ============================================================================

/** MCP tool hint mapping for provider types */
const PROVIDER_MCP_HINTS: Record<string, string> = {
	notion: "mcp__*notion*",
	confluence: "mcp__*confluence*",
	"google-docs": "mcp__*google*docs*",
	jira: "mcp__*jira*",
	linear: "mcp__*linear*",
	"github-issues": "gh issue",
	"gitlab-issues": "mcp__*gitlab*",
	figma: "mcp__*figma*",
	slack: "mcp__*slack*",
	teams: "mcp__*teams*",
	discord: "mcp__*discord*",
	github: "gh",
	gitlab: "mcp__*gitlab*",
	bitbucket: "mcp__*bitbucket*",
	"github-actions": "gh run",
	"gitlab-ci": "mcp__*gitlab*",
	jenkins: "mcp__*jenkins*",
	circleci: "mcp__*circleci*",
};

/**
 * Get MCP tool hint for a provider type
 */
export function getProviderMcpHint(providerType: string): string {
	return PROVIDER_MCP_HINTS[providerType] || "";
}

/**
 * Detect VCS hosting platform from git remote
 * @param directory - Directory to check (defaults to cwd)
 * @returns Platform identifier or null
 */
export function detectVcsHosting(
	directory?: string,
): VcsHostingType | null {
	const cwd = directory || process.cwd();

	try {
		const remoteUrl = execSync("git remote get-url origin", {
			cwd,
			stdio: "pipe",
		})
			.toString()
			.trim();

		if (remoteUrl.includes("github.com")) return "github";
		if (remoteUrl.includes("gitlab.com")) return "gitlab";
		if (remoteUrl.includes("bitbucket.org")) return "bitbucket";
	} catch {
		// No remote configured
	}

	return null;
}

/**
 * Detect CI/CD system from repo files
 * @param directory - Directory to check (defaults to cwd)
 * @returns CI/CD identifier or null
 */
export function detectCiCd(directory?: string): CiCdType | null {
	const cwd = directory || process.cwd();

	if (existsSync(join(cwd, ".github", "workflows"))) return "github-actions";
	if (existsSync(join(cwd, ".gitlab-ci.yml"))) return "gitlab-ci";
	if (existsSync(join(cwd, "Jenkinsfile"))) return "jenkins";
	if (existsSync(join(cwd, ".circleci"))) return "circleci";

	return null;
}

/**
 * Load providers from settings, cache, and auto-detection
 * @param options - Optional repo root
 * @returns Complete providers configuration
 */
export function loadProviders(options?: {
	repoRoot?: string;
}): ProvidersConfig {
	const repoRoot = options?.repoRoot || findRepoRoot();
	const result: ProvidersConfig = {
		specProvider: null,
		ticketingProvider: null,
		designProvider: null,
		commsProvider: null,
		vcsHosting: null,
		ciCd: null,
	};

	// Source 1: Declared providers from settings.yml
	if (repoRoot) {
		const settings = loadRepoSettings(repoRoot);
		if (settings?.providers) {
			if (settings.providers.specProvider) {
				result.specProvider = settings.providers
					.specProvider as ProviderEntry<SpecProviderType>;
			}
			if (settings.providers.ticketingProvider) {
				result.ticketingProvider = settings.providers
					.ticketingProvider as ProviderEntry<TicketingProviderType>;
			}
			if (settings.providers.designProvider) {
				result.designProvider = settings.providers
					.designProvider as ProviderEntry<DesignProviderType>;
			}
			if (settings.providers.commsProvider) {
				result.commsProvider = settings.providers
					.commsProvider as ProviderEntry<CommsProviderType>;
			}
		}
	}

	// Source 2: Cached providers from MCP discovery
	try {
		const cached = execSync("han keep load providers.json --quiet", {
			stdio: "pipe",
		})
			.toString()
			.trim();
		if (cached) {
			const cachedProviders = JSON.parse(cached) as ProvidersConfig;
			for (const key of [
				"specProvider",
				"ticketingProvider",
				"designProvider",
				"commsProvider",
			] as const) {
				if (!result[key] && cachedProviders[key]) {
					(result as Record<string, unknown>)[key] = cachedProviders[key];
				}
			}
		}
	} catch {
		// No cached providers
	}

	// Source 3: Auto-detect VCS hosting and CI/CD
	const dir = repoRoot || undefined;
	result.vcsHosting = detectVcsHosting(dir);
	result.ciCd = detectCiCd(dir);

	return result;
}
