---
layout: post
title: "Insidious Bug"
---

This code tells a lie:

```js
const fs = require('fs/promises');

async function saveFavoriteColor(favoriteColor) {
  await fs.writeFile('favoriteColor.txt', favoriteColor, 'utf8');
  console.log('Saved!');
}
```

Take a moment to try and spot the lie. Is it obvious?

As a hint, this story:

Some time ago at [Red Planet Labs](https://redplanetlabs.com/), I was ramping up our chaos testing of [Rama](https://redplanetlabs.com/docs/~/index.html#gsc.tab=0), a distributed database and stream processing framework, in advance of its launch. We'd long been injecting random process kills:

```shell
kill -9 <worker-pid>
```

And when I added a forceful instance kill disturbance, I thought I was walking well-trod territory:

```shell
aws ec2 stop-instances --instance-ids <instance-id> --force
```

But immediately, I started seeing data verification failures in our distributed quality testing environments.

<details>
<summary>Reveal explanation</summary>

<br/>

In hindsight, it seems obvious: there's a buffer between the application and the physical disk, and the operating system, by default, flushes it asynchronously for reasons of efficiency.

<br/>
<br/>

When we want to ensure that our writes are truly durable before proceeding, we must explicitly instruct the OS to flush; for UNIX systems, this happens via the <a href="https://man7.org/linux/man-pages/man2/fsync.2.html">fsync</a> system call.

<br/>
<br/>

In Rama's implementation, we often wrote to disk without an explicit fsync, but assumed that what we'd written was durable after the write call returned.

<br/>
<br/>

The only way to actually exercise this bug was to terminate machines without giving them the chance to flush their buffers to disk.

<br/>
<br/>

Here's a little visualization; try "unplugging" the machine (i.e. forcefully restarting it) after a change is acknowledged as "Saved!", but before the cache is flushed to disk:

<div id="demo-fsync-app"></div>

Often, as developers, we interact with the disk via databases that by default address this issue for us (see <a href="https://postgresqlco.nf/doc/en/param/fsync/">Postgres</a>, <a href="https://dev.mysql.com/doc/refman/8.4/en/innodb-parameters.html#sysvar_innodb_flush_method">MySQL</a>) (though other databases, by default, don't (see <a href="https://www.mongodb.com/docs/manual/reference/command/fsync/">MongoDB</a>)).

<br/>
<br/>

But, regardless, it's always good to keep this one ine mind.

</details>

<script type="module" src="/assets/js/demo.js"></script>
