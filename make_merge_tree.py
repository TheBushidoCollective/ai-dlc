#!/usr/bin/env python3
"""
Creates a new commit that merges origin/main with our compound/SKILL.md changes.
Strategy: take origin/main's tree, but replace plugin/skills/compound/SKILL.md
with our version (which includes the /reflect integration section).
"""
import subprocess


def git(*args, input=None):
    result = subprocess.run(
        ['git'] + list(args),
        input=input,
        capture_output=True,
        text=True
    )
    if result.returncode != 0:
        raise RuntimeError(f"git {' '.join(args)} failed: {result.stderr}")
    return result.stdout.strip()


def mktree(entries):
    """entries: list of (mode, type, sha, name)"""
    lines = '\n'.join(f'{mode} {typ} {sha}\t{name}' for mode, typ, sha, name in entries)
    return git('mktree', input=lines + '\n')


def ls_tree(ref):
    """Returns list of (mode, type, sha, name)"""
    output = git('ls-tree', ref)
    entries = []
    for line in output.split('\n'):
        if not line.strip():
            continue
        meta, name = line.split('\t', 1)
        mode, typ, sha = meta.split()
        entries.append((mode, typ, sha, name))
    return entries


# Get tree info
main_ref = 'origin/main'
our_skill_blob = git('rev-parse', 'HEAD:plugin/skills/compound/SKILL.md')
print(f'Our SKILL.md blob: {our_skill_blob}')

# Build compound tree: origin/main's compound tree but with our SKILL.md
compound_entries = ls_tree(f'{main_ref}:plugin/skills/compound')
compound_entries = [(m, t, our_skill_blob if n == 'SKILL.md' else s, n) for m, t, s, n in compound_entries]
new_compound_tree = mktree(compound_entries)
print(f'New compound tree: {new_compound_tree}')

# Build skills tree: origin/main's skills tree but with new compound
skills_entries = ls_tree(f'{main_ref}:plugin/skills')
skills_entries = [(m, t, new_compound_tree if n == 'compound' else s, n) for m, t, s, n in skills_entries]
new_skills_tree = mktree(skills_entries)
print(f'New skills tree: {new_skills_tree}')

# Build plugin tree: origin/main's plugin tree but with new skills
plugin_entries = ls_tree(f'{main_ref}:plugin')
plugin_entries = [(m, t, new_skills_tree if n == 'skills' else s, n) for m, t, s, n in plugin_entries]
new_plugin_tree = mktree(plugin_entries)
print(f'New plugin tree: {new_plugin_tree}')

# Build root tree: origin/main's root tree but with new plugin
root_entries = ls_tree(f'{main_ref}^{{tree}}')
root_entries = [(m, t, new_plugin_tree if n == 'plugin' else s, n) for m, t, s, n in root_entries]
new_root_tree = mktree(root_entries)
print(f'New root tree: {new_root_tree}')

# Create the merge commit
# Parents: current HEAD + origin/main
head_sha = git('rev-parse', 'HEAD')
main_sha = git('rev-parse', 'origin/main')
print(f'HEAD: {head_sha}')
print(f'origin/main: {main_sha}')

commit_message = """merge: resolve conflicts with origin/main, preserve /reflect integration docs

Brings branch up to date with origin/main while preserving the
'Integration with /reflect' section added to plugin/skills/compound/SKILL.md.

Co-authored-by: Jason Waldrip <jwaldrip@users.noreply.github.com>"""

new_commit = git(
    'commit-tree',
    new_root_tree,
    '-p', head_sha,
    '-p', main_sha,
    '-m', commit_message
)
print(f'New merge commit: {new_commit}')
print(f'\nTo complete: git update-ref refs/heads/eco/compound-reflect-docs {new_commit}')
print(f'COMMIT_SHA={new_commit}')
