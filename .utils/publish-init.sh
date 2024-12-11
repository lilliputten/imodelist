#!/bin/sh
# @desc Initialize publish syncing repository
# @changed 2024.12.11, 02:49

scriptsPath=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")
rootPath=`dirname "$scriptsPath"`
prjPath="$rootPath" # `pwd`

# Import config variables (expected variable `$PUBLISH_FOLDER`)...
test -f "$scriptsPath/config.sh" && . "$scriptsPath/config.sh"
test -f "$scriptsPath/config-local.sh" && . "$scriptsPath/config-local.sh"

# Check basic required variables...
test -f "$rootPath/config-check.sh" && . "$rootPath/config-check.sh" --omit-publish-folder-check

# Publish folder should be absent...
if [ -d "$PUBLISH_FOLDER" ]; then
  echo "Publish folder already exists!"
  echo "Remove it first for re-initializing using command:"
  echo "'rm -Rf "$PUBLISH_FOLDER" ".gitmodules" ".git/modules/$PUBLISH_FOLDER"'"
  echo "or"
  echo "'sh utils/publish-uninit.sh'."
  exit # Successfull exit
fi

echo "Initializing publish folder & submodule for '$PUBLISH_FOLDER'..."

DIST_REPO=`git config --get remote.origin.url`

echo "Init publish submodule with $DIST_REPO ..."
touch ".gitmodules" && \
  git submodule add -f "$DIST_REPO" "$PUBLISH_FOLDER" && \
  git rm --cached -f "$PUBLISH_FOLDER" ".gitmodules" && \
  test ! -z "$PUBLISH_BRANCH" && ( \
    echo "Switch to branch '$PUBLISH_BRANCH' ..." && \
    cd "$PUBLISH_FOLDER" && \
    git checkout "$PUBLISH_BRANCH" && \
    cd .. \
  ) && \
  echo OK
