#!/bin/bash -e
#
# @license
# Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
# This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
# The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
# The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
# Code distributed by Google as part of the polymer project is also
# subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
#

# This script pushes a demo-friendly version of your element and its
# dependencies to gh-pages.

# usage gp Polymer core-item [branch]
# Run in a clean directory passing in a GitHub org and repo name
hostname=$1
org=$2
repo=$3
branch=${4:-"master"} # default to master when branch isn't specified
connectionType=${5:-"https"} # defaults to https if type is set to null

# Calculate git clone url
[ "$connectionType" = "https" ] && { url=https://$hostname/$org/$repo.git; true; } || url=git@$hostname:$org/$repo.git;

# make folder (same as input, no checking!)
mkdir $repo
git clone $url --single-branch

# switch to gh-pages branch
pushd $repo >/dev/null
git checkout --orphan gh-pages

# remove all content
git rm -rf -q .

# use bower to install runtime deployment
bower cache clean $repo # ensure we're getting the latest from the desired branch.
git show ${branch}:bower.json > bower.json
echo "{
  \"directory\": \"components\"
}
" > .bowerrc
bower install
bower install git@$hostname:$org/$repo#$branch
git checkout ${branch} -- demo
rm -rf components/$repo/demo
mv demo components/$repo/

# redirect by default to the component folder
echo "<META http-equiv="refresh" content=\"0;URL=components/$repo/\">" >index.html

# install the project's dev dependencies
if [ "$getdevdeps" = "yes" ]
then
  cd components/$repo
  bower install --config.directory="../"
  cd ../../
fi

# send it all to github
git add -A .
git commit -am 'seed gh-pages'
git push -u origin gh-pages --force
git checkout $branch

popd >/dev/null
