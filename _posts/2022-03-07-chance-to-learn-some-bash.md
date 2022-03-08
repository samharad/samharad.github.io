---
layout: post
title:  "Life is Too Short for Bash"
date: 03-07-2022
---

I recently ran my first half-marathon, and afterwards purchased the right to download
the official photos of myself taken during the race.

Strangely (if unsurprisingly) this right comes with the burden of clicking one link
per photo taken, of which there are 38:

![Download links.](/assets/race-photos-email.png)

Now, since creating this markdown file and typing the above text, I could have clicked
each link, but I'd have deprived myself of a chance to practice my bash-fu.


Cut to not less than an hour later, and I have this:

```shell
#!/bin/bash

`# Download the HTML containing links to the pics`
curl -s https://www.racephotonetwork.com/QPPlus/Receipt.aspx\?OrderID\=... \
`# Parse as HTML; grab the href attribute of all <a> tags;` \
`# toss out stderr (which complains about an unescaped ampersand` \
`# in the body of the HTML)` \
| xmllint --html --xpath "//a/@href" - 2>/dev/null \
`# Replace spaces with newlines` \
| tr ' ' '\n' \
`# Strip the leading href=` \
| sed -e 's/href=//' \
`# Strip the quotation marks` \
| sed -e 's/"//g' \
`# Permitting vars as long as 300 chars,` \
`# for each line, assign the content to _` \
`# and echo the line prepended with a UUID` \
| xargs -I _ -S 300 bash -c 'echo $(uuidgen) _' \
`# Accepting 2 values per line, and in as parallel` \
`# a manner as possible, fetch the photo and save it` \
| xargs -n 2 -P 0 bash -c 'curl "$1" -o "sf-half-marathon-2022-$0.jpg"'
```

Writing this turned out to be very unpleasant, because I spent a lot of time baffled
by why the penultimate xargs command didn't work; the key lay in this man
page section for `xargs`:

```
-I replstr
 Execute utility for each input line, replacing one or more occurrences of
 replstr in up to replacements (or 5 if no -R flag is specified) arguments
 to utility with the entire line of input.  **The resulting arguments, after
 replacement is done, will not be allowed to grow beyond replsize (or 255 if
 no -S flag is specified) bytes**;
 ...
```

The unix philosophy is neat; it's unfortunate, though, that chaining these many programs together
necessitates learning (and being tripped up by) each one's quirks.

Life may be too short for bash scripting except when necessary; next time I'll use Clojure.