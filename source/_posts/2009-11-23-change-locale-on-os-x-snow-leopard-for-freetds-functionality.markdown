---
layout: post
title: "Change Locale on OS X Snow Leopard for FreeTDS Functionality"
date: 2009-11-23 15:29
comments: false
categories: 
- OS X
- Rails
alias: /articles/2009/11/23/change-locale-on-os-x-snow-leopard-for-freetds-functionality
---

Recently I've been trying to get my new unibody macbook pro connecting to SQL Server 2005 with FreeTDS. I was following the [great guide](http://www.metaskills.net/2009/9/5/the-ultimate-os-x-snow-leopard-stack-for-rails-development-x86_64-macports-ruby-1-8-1-9-sql-server-more) from Ken Collins, author of the [rails-sqlserver activerecord adapter](http://github.com/rails-sqlserver/2000-2005-adapter) that I use but no matter what configuration settings I edited I couldn't get my machine to connect to the SQL Server. 

<!-- more -->

When checking the event viewer on the Windows Server 2k8 box I received the following error:

```ruby
"The login packet used to open the connection is structurally invalid; 
the connection has been closed. 
Please contact the vendor of the client library."
```

I was pretty sure it had to do with my locale because if that was incorrect it would make sense that the packets might be structurally invalid. My locale was set to `en_US.us-ascii` the default setting apparently after a clean OS X Snow Leopard install. The problem was that I couldn't figure out how to change it. Then I ran across [this archived post](http://lists.ibiblio.org/pipermail/freetds/2007q4/022436.html) and I was able to temporarily change my locale by typing:

```bash
export LC_ALL=en_US.UTF-8
```

I was able to verify my locale settings by typing `locale` in a terminal window which yielded the following:

```bash
LANG=
LC_COLLATE="en_US.UTF-8"
LC_CTYPE="en_US.UTF-8"
LC_MESSAGES="en_US.UTF-8"
LC_MONETARY="en_US.UTF-8"
LC_NUMERIC="en_US.UTF-8"
LC_TIME="en_US.UTF-8"
LC_ALL="en_US.UTF-8"
```

The problem is if I opened a new terminal window my locale was back to the default ascii junk. To make this change permanent I simply had to edit my ~/.profile and add the export statement that we set earlier to the bottom of the file.

```bash
export LC_ALL=en_US.UTF-8
```

Now when I open a new window and type `locale` it says `en_US.UTF-8` for everything. At this point I was able to continue following Ken's guide for testing the TSQL commands and getting ruby-dbi and everything else wired up.
