#!/bin/bash
set -e

OUR_BLOB=$(git rev-parse HEAD:plugin/skills/compound/SKILL.md)
echo "Our SKILL.md blob: $OUR_BLOB"

COMPOUND_TREE=$(echo "100644 blob ${OUR_BLOB}	SKILL.md" | git mktree)
echo "New compound tree: $COMPOUND_TREE"

SKILLS_ENTRIES=$(git cat-file -p origin/main:plugin/skills | sed "s/d82e7c202a31c1e2cb2fd8f09e4caba54fac61ee/$COMPOUND_TREE/")
NEW_SKILLS_TREE=$(echo "$SKILLS_ENTRIES" | git mktree)
echo "New skills tree: $NEW_SKILLS_TREE"

PLUGIN_ENTRIES=$(git cat-file -p origin/main:plugin | sed "s/d6f68c7b64e946babb4313f15f98cf71325db1c0/$NEW_SKILLS_TREE/")
NEW_PLUGIN_TREE=$(echo "$PLUGIN_ENTRIES" | git mktree)
echo "New plugin tree: $NEW_PLUGIN_TREE"

ROOT_ENTRIES=$(git cat-file -p origin/main^{tree} | sed "s/7429694f735bb2f134b04264b9a73298ab7c4010/$NEW_PLUGIN_TREE/")
NEW_ROOT_TREE=$(echo "$ROOT_ENTRIES" | git mktree)
echo "New root tree: $NEW_ROOT_TREE"

HEAD_SHA=$(git rev-parse HEAD)
MAIN_SHA=$(git rev-parse origin/main)

NEW_COMMIT=$(git commit-tree "$NEW_ROOT_TREE" -p "$HEAD_SHA" -p "$MAIN_SHA" -m "merge: resolve conflicts with origin/main, preserve /reflect integration docs

Brings branch up to date with origin/main while preserving the
'Integration with /reflect' section added to plugin/skills/compound/SKILL.md.

Co-authored-by: Jason Waldrip <jwaldrip@users.noreply.github.com>")

echo "New merge commit: $NEW_COMMIT"
echo ""
echo "Run: git reset --hard $NEW_COMMIT"
echo "COMMIT=$NEW_COMMIT"
