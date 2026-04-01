# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.82.6] - 2026-04-01

### Added

- add blueprint-aware styled wireframes to elaborate-wireframes skill ([b63074b](../../commit/b63074b))
- add design_blueprint_path to wireframe brief template in Phase 6.25 ([27e085b](../../commit/27e085b))
- add Phase 2.3 (Knowledge Bootstrap) and Phase 2.75 (Design Direction) to elaborate skill ([8e7666b](../../commit/8e7666b))
- add archetype library with 4 archetypes, parameters, and blueprint generation ([a1cec5a](../../commit/a1cec5a))
- add pick_design_direction MCP tool with browser-based visual picker ([7b249ad](../../commit/7b249ad))
- integrate knowledge artifact loading into all four hats ([0a024aa](../../commit/0a024aa))
- add knowledge-synthesize fork-context skill ([8c43474](../../commit/8c43474))
- add knowledge artifact filesystem API library ([eb3bcf8](../../commit/eb3bcf8))
- add pass-aware execution to execute skill ([6677336](../../commit/6677336))
- inject pass context into construction pipeline hooks ([f0d41d3](../../commit/f0d41d3))
- add GitHub releases, tags, and plugin zip artifacts to version bump workflow ([3df3905](../../commit/3df3905))
- make Phase 5.95 interactive with pass validation ([3f8178a](../../commit/3f8178a))
- remove hardcoded pass enum from settings schema and add dynamic pass discovery ([08a7fe1](../../commit/08a7fe1))
- replace hat override pattern with augmentation pattern ([2c9ea03](../../commit/2c9ea03))
- add first-class pass definitions and resolution library ([060c64a](../../commit/060c64a))
- add task routing heuristics to inject-context hook ([880b25e](../../commit/880b25e))
- rewrite quick mode skill with workflow-aware hat loop ([78040ef](../../commit/78040ef))
- rewrite changelog generator to use PR-level entries ([5362a5b](../../commit/5362a5b))
- add Phase 7.5 (Adversarial Spec Review) to elaborate SKILL.md ([f833992](../../commit/f833992))
- add elaborate-adversarial-review subagent skill ([c8ac9f4](../../commit/c8ac9f4))
- add autonomous elaboration mode for /autopilot ([09f4308](../../commit/09f4308))
- improve designer hat and add BDD workflow with acceptance-test-writer hat ([d15c80c](../../commit/d15c80c))
- gate visual review on settings.yml configuration ([5826823](../../commit/5826823))
- visual review & intent dashboard ([b032d62](../../commit/b032d62))
- add pre-delivery code review gate and OTel instrumentation ([7c03c50](../../commit/7c03c50))
- add ask_user_visual_question MCP tool ([d085656](../../commit/d085656))
- wire up packaging, /dashboard skill, and workspace resolution ([79c058a](../../commit/79c058a))
- add static dashboard generator ([e641de2](../../commit/e641de2))
- replace monolithic html.ts with template system ([9ae83bb](../../commit/9ae83bb))
- add mermaid rendering, dark mode, inline mockups ([f7b145e](../../commit/f7b145e))
- add MCP channel server for visual review ([998e834](../../commit/998e834))
- add @ai-dlc/shared parser package ([b89bd64](../../commit/b89bd64))
- update hats and skills for harness-enforced quality gates ([cf5312c](../../commit/cf5312c))
- add /adopt skill for reverse-engineering existing features into AI-DLC ([0f3da4b](../../commit/0f3da4b))
- add quality-gate stop hook ([b187ff3](../../commit/b187ff3))

### Fixed

- use whole-line grep match for section detection in knowledge.sh ([36799f8](../../commit/36799f8))
- add path traversal validation to load_pass_instructions ([97e65c6](../../commit/97e65c6))
- address PR review — JSON output, path validation, misleading comment ([a34d40e](../../commit/a34d40e))
- add jq dep check and filter scaffold artifacts from discovery brief ([f591f86](../../commit/f591f86))
- address final PR review feedback ([f79e06c](../../commit/f79e06c))
- address PR review feedback on design-direction-system ([bb4abed](../../commit/bb4abed))
- clean up knowledge template syntax in discovery brief ([56b3de6](../../commit/56b3de6))
- handle non-hex colors and add missing button in editorial preview ([cc890d5](../../commit/cc890d5))
- improve greenfield flow clarity and knowledge.sh discovery ([18f6bbc](../../commit/18f6bbc))
- resolve multi-line content failure in dlc_knowledge_update_section ([9cf756f](../../commit/9cf756f))
- make tag and release creation idempotent on workflow retries ([ed1fc76](../../commit/ed1fc76))
- replace Bun runtime dependency with Node.js APIs in MCP server ([4294cc4](../../commit/4294cc4))
- update remaining spawn-logic prose to reference hat augmentation ([4350302](../../commit/4350302))
- address PR review feedback on quick mode and routing heuristics ([1c36881](../../commit/1c36881))
- resolve all biome lint errors ([f93cc22](../../commit/f93cc22))
- cross-check intent status against main before listing ([bda5c2d](../../commit/bda5c2d))
- correct false-positive path replacements in hooks ([4f93e9b](../../commit/4f93e9b))
- render changelog links on website and fix CI herestring error ([c30f400](../../commit/c30f400))
- address PR review feedback on adversarial review phase ([6a1774b](../../commit/6a1774b))
- remove dead CURRENT_BRANCH var and fix get_ai_dlc_config path in Phase 6 ([b459bcd](../../commit/b459bcd))
- address review feedback on visual review setup config ([bbd0aaf](../../commit/bbd0aaf))
- prevent empty PR when /adopt runs on default branch ([8d1e5dc](../../commit/8d1e5dc))
- restore PR_URL capture in advance/SKILL.md intent delivery path ([684909f](../../commit/684909f))
- remove stale CHANGELOG entry for telemetry.sh (library was restored) ([554c2b0](../../commit/554c2b0))
- restore telemetry calls stripped from skills and hats ([6d31262](../../commit/6d31262))
- restore telemetry.sh — incorrectly deleted during review fixes ([7efcb86](../../commit/7efcb86))
- resolve UNIT_COUNT and INTENT_TITLE variable ordering bugs ([32ad620](../../commit/32ad620))
- address remaining review issues — lock files, DAG slugs, path validation, dashboard cleanup ([badbee3](../../commit/badbee3))
- resolve merge conflict in elaborate/SKILL.md — add missing telemetry blocks and worktree fixes from main ([d744286](../../commit/d744286))
- address all review notes — security, XSS, session IDs, DAG cycles, CHANGELOG ([4604a2b](../../commit/4604a2b))
- server-side markdown rendering and wireframe fallback resolution ([d608bc6](../../commit/d608bc6))
- address all remaining review highlights ([7b78fdc](../../commit/7b78fdc))
- add git worktree prune and error logging to all worktree cleanup sites ([e8fa1ee](../../commit/e8fa1ee))
- address all outstanding review issues and expand quality gate lifecycle in website ([4c3a2fb](../../commit/4c3a2fb))
- revert planner agent type from Plan back to general-purpose ([6c94b6a](../../commit/6c94b6a))
- address final review suggestions on harness-enforced quality gates ([4addf5b](../../commit/4addf5b))
- don't escape mermaid content in intent review template ([8b6a9f2](../../commit/8b6a9f2))
- revert planner hat to general-purpose; fill in Phase 6 operation loop body ([c02ad7e](../../commit/c02ad7e))
- clarify yq JSON-style expression syntax in elaborate Step C ([28f1a48](../../commit/28f1a48))
- address new review suggestions from re-review ([8b2a267](../../commit/8b2a267))
- address remaining review notes — Phase 7 PR spec, telemetry, unit worktree note ([9696708](../../commit/9696708))
- address review issues in /adopt skill and paper ([7d9f32f](../../commit/7d9f32f))
- address review feedback on harness-enforced quality gates ([97af606](../../commit/97af606))
- update intent.md status on Teams path completion ([4569deb](../../commit/4569deb))
- resolve two bugs in quality-gate.sh ([d901754](../../commit/d901754))

### Changed

- remove workflow_mode setting — autopilot is autonomous by definition ([269e285](../../commit/269e285))
- use fully-qualified /ai-dlc:name command references ([94bbc6f](../../commit/94bbc6f))

### Other

- Apply suggestions from code review ([bf1b153](../../commit/bf1b153))
- Revert "intent: Visual Review Full Integration & Bug Fixes" ([774716e](../../commit/774716e))
- wire visual review into 4 elaboration review boundaries ([f7585a1](../../commit/f7585a1))
- integrate quality gate detection and confirmation flow ([be64bb6](../../commit/be64bb6))

## [1.83.0] - 2026-03-30

### Added

- Add pre-delivery code review gate and OTel instrumentation

## [1.82.7] - 2026-03-30

### Fixed

- Remove all Han references from documentation

## [1.82.6] - 2026-03-30

### Fixed

- Add git worktree prune and error logging to all worktree cleanup sites

## [1.82.3] - 2026-03-30

### Added

- Add Operations stage to Act 5 on home page

### Fixed

- Add pre-delivery safety net for intent.md status

## [1.82.2] - 2026-03-30

### Fixed

- Update intent.md status on Teams path completion
- Reframe passes as transitional, not recommended
- Hatted agents as proper card with expandable detail
- Reframe spec comparison as vibe coding vs spec-driven vs elaboration
- Collapse hat section into expandable deep dive

## [1.82.1] - 2026-03-30

### Fixed

- Only Docs nav item triggers mega menu dropdown
- Prevent planner hat from entering plan mode, reorder strategy options, remove auto-merge question

## [1.82.0] - 2026-03-30

### Added

- Story-driven home page and plugin lifecycle guides

## [1.81.1] - 2026-03-30

### Fixed

- Make intent strategy the default option, remove auto-merge question

## [1.81.0] - 2026-03-30

### Added

- Rename Construction Phase to Execution Phase, add configurable default passes

## [1.80.1] - 2026-03-30

### Fixed

- Remove han dependency from plugin hooks

## [1.80.0] - 2026-03-29

### Added

- Add harness framing to website/paper and update CI review workflow

## [1.79.2] - 2026-03-29

### Fixed

- Remove remaining han-plugin references from skills

## [1.79.1] - 2026-03-29

### Fixed

- Resolve 3 functional bugs and clean up 27+ stale legacy references

## [1.79.0] - 2026-03-29

### Added

- Full AI-DLC Operations Phase (steps 5-9) (#104)

## [1.78.1] - 2026-03-29

### Fixed

- Address post-merge review bugs from PR #105 (#106)

## [1.78.0] - 2026-03-28

### Added

- Check off completion criteria checkboxes on unit/intent completion

## [1.77.2] - 2026-03-28

### Fixed

- Grant write permissions to Claude interactive workflow

## [1.77.1] - 2026-03-28

### Fixed

- Grant write permissions to Claude code review workflow

## [1.77.0] - 2026-03-28

### Added

- Visual fidelity backpressure — design as a hard gate (#105)

## [1.76.2] - 2026-03-28

### Fixed

- Ensure intent and unit statuses are reliably set to completed

## [1.76.1] - 2026-03-28

### Added

- Remove han CLI dependency & improve state management (#103)

## [1.76.0] - 2026-03-28

### Added

- Add subagent-hook, context preflight, hard gates, DOT flowcharts

## [1.75.1] - 2026-03-28

### Fixed

- Comprehensive review fixes after PR merge barrage

## [1.75.0] - 2026-03-27

### Added

- Add multi-judge critique debate for high-stakes reviews (#81)

## [1.74.2] - 2026-03-27

### Fixed

- Use plain git for conflict resolution (claude-code-action doesn't support push events)

## [1.74.1] - 2026-03-27

### Fixed

- Use Agent tool for context:fork skill invocations

## [1.74.0] - 2026-03-27

### Added

- Add schema drift detection (#73)

## [1.73.0] - 2026-03-27

### Added

- Add /autopilot skill for full autonomous feature lifecycle (#70)

## [1.72.0] - 2026-03-27

### Added

- Add structured completion markers for deterministic review outcomes (#46)

## [1.71.0] - 2026-03-27

### Added

- Add node repair operator and structured completion marker (#24)

## [1.70.1] - 2026-03-27

### Fixed

- Use direct_prompt with matrix strategy for conflict resolution

## [1.70.0] - 2026-03-27

### Added

- Add git history analysis to inform planning decisions (#76)

## [1.68.1] - 2026-03-27

### Added

- Add workflow mode and granularity tuning (#62)
- Add reflect integration lifecycle (#49)

## [1.68.0] - 2026-03-27

### Added

- Add DOT flowchart process authority guideline (#47)

## [1.67.0] - 2026-03-27

### Added

- Add model profiles for cost-optimized hat routing (#45)

## [1.66.0] - 2026-03-27

### Added

- Add learning retrieval before planning (#31)

## [1.64.0] - 2026-03-27

### Added

- Add parallel review perspectives for multi-file units (#29)

## [1.63.0] - 2026-03-27

### Added

- Add anti-rationalization tables and red flags to all 13 hats (#28)
- Add goal-backward verification and three-level artifact checks (#26)

## [1.62.3] - 2026-03-27

### Fixed

- Use @claude mention bot for conflict resolution instead of direct action

## [1.62.0] - 2026-03-27

### Added

- Add data-driven configuration pattern (#99)

## [1.61.0] - 2026-03-27

### Added

- Add two-stage review (spec compliance then code quality) (#51)

## [1.60.0] - 2026-03-27

### Added

- Add visual brainstorming companion guidance (#53)

## [1.59.1] - 2026-03-27

### Fixed

- Add allowed_bots to claude-code-review workflow

## [1.59.0] - 2026-03-27

### Added

- Add context budget monitor hook (#33)

## [1.58.2] - 2026-03-27

### Added

- Extract reference material to companion file (#25)

## [1.58.1] - 2026-03-27

### Added

- Extract reference material to companion file (#30)

## [1.58.0] - 2026-03-27

### Added

- Add structured completion markers (#32)

## [1.57.0] - 2026-03-27

### Added

- Add confidence-scored findings and anti-pattern scan (#27)

## [1.56.1] - 2026-03-27

### Added

- Lazy learnings pointer replaces eager injection (#34)

## [1.56.0] - 2026-03-27

### Added

- Add /compound skill for capturing structured learnings (#35)

## [1.55.0] - 2026-03-27

### Added

- Add anti-patterns guidance for completion criteria (#36)

## [1.54.0] - 2026-03-27

### Added

- Add /pressure-testing skill for hat evaluation (#37)

## [1.53.1] - 2026-03-27

### Added

- Disable-model-invocation on infrequently-used skills (#38)

## [1.53.0] - 2026-03-27

### Added

- Add wave-based parallel execution (#55)

## [1.52.0] - 2026-03-27

### Added

- Add structured session handoff for bolt continuity (#56)

## [1.51.2] - 2026-03-27

### Fixed

- Allow bot actors in Claude Code mention workflow

## [1.51.1] - 2026-03-27

### Added

- Role-scoped subagent context (#39)

## [1.51.0] - 2026-03-27

### Added

- Add brownfield codebase mapping to discovery (#40)

## [1.50.0] - 2026-03-27

### Added

- Aggregate compound learnings into reflection (#41)

## [1.49.0] - 2026-03-27

### Added

- Add hard-gate synchronization points (#43)

## [1.48.0] - 2026-03-27

### Added

- Add automated spec review before construction (#44)

## [1.47.0] - 2026-03-27

### Added

- Add verification-before-completion requirement (#52)

## [1.46.0] - 2026-03-27

### Added

- Add /seed skill for forward-looking ideas (#58)

## [1.45.0] - 2026-03-27

### Added

- Add comprehensive pre-delivery checklist (#98)

## [1.44.3] - 2026-03-27

### Added

- Interpolate default branch name into elaboration git strategy questions (#101)

## [1.44.2] - 2026-03-27

### Added

- Add Claude Code GitHub Workflow (#102)

## [1.44.0] - 2026-03-27

### Added

- Add file-based state persistence (#60)

## [1.43.0] - 2026-03-27

### Added

- Add prompt injection guard and workflow enforcement hooks (#61)

## [1.42.0] - 2026-03-27

### Added

- Add /quick mode for trivial tasks (#63)

## [1.41.0] - 2026-03-27

### Added

- Add no-verify parallel commit strategy for agent teams (#64)

## [1.40.0] - 2026-03-27

### Added

- Add catalog of specialized review agents (#67)

## [1.39.0] - 2026-03-27

### Added

- Add /backlog skill for parking lot ideas (#68)

## [1.38.0] - 2026-03-27

### Added

- Add /ideate skill for adversarial improvement ideas (#69)

## [1.37.0] - 2026-03-27

### Added

- Add plan deepening with parallel research agents (#71)

## [1.36.0] - 2026-03-27

### Added

- Add spec flow analysis (#77)

## [1.35.0] - 2026-03-27

### Added

- Add per-project review agent configuration (#78)

## [1.34.0] - 2026-03-27

### Added

- Add chain-of-verification (CoVe) for evidence-based reviews (#83)

## [1.33.0] - 2026-03-27

### Added

- Add relevance-ranked learning search (#94)

## [1.32.0] - 2026-03-27

### Added

- Add version-aware building with rollback guidance (#95)

## [1.31.0] - 2026-03-27

### Added

- Add rule-based decision filtering (#96)

## [1.30.0] - 2026-03-27

### Added

- Document master + overrides configuration precedence pattern (#97)

## [1.29.0] - 2026-03-26

### Added

- Add last_updated timestamp to unit frontmatter (#12)

## [1.28.2] - 2026-03-26

### Fixed

- Commit unit/intent status changes to git (#17)

## [1.28.1] - 2026-03-26

### Added

- Add clear workflow mode labels and guidance (#15)

## [1.28.0] - 2026-03-26

### Added

- Auto-cleanup worktrees at completion milestones (#23)

## [1.27.0] - 2026-03-26

### Added

- Add design-specific unit template sections (#19)

## [1.26.0] - 2026-03-26

### Added

- Add /followup skill for post-completion changes (#14)

## [1.25.0] - 2026-03-26

### Added

- Include design units in wireframe generation (#18)

## [1.24.0] - 2026-03-26

### Added

- Add design-focused success criteria guidance (#20)

## [1.23.0] - 2026-03-26

### Added

- Auto-route discipline: design to design workflow (#21)

## [1.22.0] - 2026-03-26

### Added

- Detect and remove merged worktrees (#11)

## [1.21.0] - 2026-03-26

### Added

- Add OTEL reporting for AI-DLC workflow events (#16)

## [1.20.17] - 2026-03-23

### Added

- Add intent: Remove han dependency & improve state management (#9)

## [1.20.13] - 2026-03-10

### Added

- Fix source error for claude marketplace (#8)

## [1.20.12] - 2026-03-10

### Fixed

- Skip auto-merge question for unit strategy

## [1.20.7] - 2026-03-06

### Fixed

- Resolve worktree paths from main repo root, add cleanup

## [1.20.5] - 2026-03-04

### Fixed

- Prevent elaboration review PR from closing linked issues

## [1.20.4] - 2026-03-04

### Fixed

- Skip delivery prompt for unit-based change strategy

## [1.20.3] - 2026-03-04

### Fixed

- Enforce full unit display during elaboration review

## [1.20.2] - 2026-03-04

### Fixed

- Add continuation signals after fork subagent invocations

## [1.20.1] - 2026-03-04

### Fixed

- Add strict ASCII wireframe alignment rules to discovery skill

## [1.20.0] - 2026-03-04

### Added

- Extract elaborate phases into fork subagent skills

## [1.19.2] - 2026-03-04

### Fixed

- Enforce gitignore for .ai-dlc/worktrees before worktree creation

## [1.19.0] - 2026-03-03

### Added

- Split elaborate into orchestrator + elaborator agent, add changelog page, update docs

## [1.18.0] - 2026-03-03

### Added

- Add greenfield project detection and UI mockup generation

## [1.17.2] - 2026-03-02

### Fixed

- Scope changelog generation to only include commits since previous version

## [1.17.1] - 2026-03-02

### Fixed

- Create intent worktree before discovery to avoid artifacts on main

## [1.17.0] - 2026-03-02

### Added

- Allow agent invocation of elaborate, resume, and refine skills

## [1.16.0] - 2026-03-02

### Added

- Discovery scratchpad, design subagents, hybrid change strategy

## [1.15.0] - 2026-02-25

### Added

- Per-unit workflows with design discipline support

## [1.14.0] - 2026-02-25

### Added

- Add design asset handling, color matching, and annotation awareness

## [1.13.0] - 2026-02-25

### Added

- Cowork-aware handoff with local folder and zip options

## [1.12.0] - 2026-02-25

### Added

- Block /reset, /refine, /setup, /resume in cowork mode

## [1.11.0] - 2026-02-25

### Added

- Block /construct in cowork mode

## [1.10.0] - 2026-02-25

### Added

- Improve cowork mode with CLAUDE_CODE_IS_COWORK detection and Explore subagents

## [1.9.0] - 2026-02-25

### Added

- Add wireframe generation phase and move worktrees into project

## [1.8.3] - 2026-02-24

### Fixed

- Improve ticket description formatting and structure

## [1.8.1] - 2026-02-24

### Added

- Unit targeting, enriched change strategies, remove bolt strategy

## [1.7.0] - 2026-02-20

### Added

- Add completion announcements, risk descriptions, iteration cap, and bolt terminology

## [1.6.1] - 2026-02-20

### Fixed

- Move iteration.json initialization from elaboration to construction

## [1.6.0] - 2026-02-20

### Added

- Add NFR prompts, cross-cutting concerns, integrator hat, delivery prompts, and /refine skill

## [1.5.0] - 2026-02-20

### Added

- Add /setup skill and enforce ticket creation during elaboration

## [1.4.5] - 2026-02-20

### Fixed

- Make testing non-negotiable, remove per-intent testing config

## [1.4.4] - 2026-02-20

### Fixed

- Make subagent context hook load state from correct branch

## [1.4.3] - 2026-02-15

### Fixed

- Namespace intent branches as ai-dlc/{slug}

## [1.4.2] - 2026-02-15

### Fixed

- Remove elaborator from construction workflows and improve intent discovery

## [1.4.1] - 2026-02-13

### Fixed

- Update plugin install commands to use Claude Code native /plugin CLI

## [1.4.0] - 2026-02-13

### Added

- Add provider integration, cowork support, and three-tier instruction merge

## [1.3.0] - 2026-02-13

### Added

- Providers, cowork support, and plugin reorganization

## [1.2.1] - 2026-02-12

### Fixed

- Session retrospective — branch ordering, team mode hats, workflow transitions, merge strategy

## [1.2.0] - 2026-02-11

### Added

- Add domain discovery, spec validation, and deep research to elaboration

## [1.1.1] - 2026-02-11

### Added

- Add automatic version bump and changelog pipeline (#3)
- Optimize session start hook performance (#1)
- Fix scroll spy, theme toggle, and remove trailing slashes
- Improve paper typography and add designer guide
- Transform AI-DLC into comprehensive methodology site
- Add interactive workflow visualizer
- Add interactive Big Picture methodology diagram
- Add SEO feeds, sitemap, and structured data
- Add responsive layout, dark mode, and core pages
- Migrate AI-DLC plugin to repository root
- Initial repository setup

### Fixed

- Simplify version bump to direct push (#6)
- Use PR-based merge for version bump workflow (#4)
- Remove duplicate H1 headers from docs pages
- Remove 2026 from landing page hero
