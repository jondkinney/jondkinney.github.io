---
layout: post
title: "Logging Cron Jobs on Ubuntu"
date: 2009-04-01 15:53
comments: false
categories: 
- Linux
- Rails 
alias: /articles/2009/04/01/logging-cron-jobs-on-ubuntu/
---

I am running a VPS over at [SilverRack.com](http://silverrack.com) and I love it. Dave (the owner) has been very helpful and responsive anytime I've had questions or issues, and I highly recommend their service. Also if you're a member of a local Ruby user group then you can get $10 off the standard 256mb slice making it extremely affordable to have your very own server! I also have an unlimited Dreamhost account, but I like having root access and full reign of my server.

###Enable the cron.log for Ubuntu

By default, Ubuntu disables the cron log, so you need to turn it on, and additionally create the log file before you can start tailing that log.

<!-- more -->

Use these steps to get your log on:

Create the cron.log file
```bash
touch /var/log/cron.log
```

Edit /etc/syslog.conf and uncomment the line starting with `cron.*` 
```bash
vim /etc/syslog.conf 
```

Restart sysklogd

```bash
$ /etc/init.d/sysklogd restart
```

Restart cron

```bash
$ /etc/init.d/cron restart
```

Then to watch your cron jobs execute this command:

```bash
$ tail -f /var/log/cron.log
```
