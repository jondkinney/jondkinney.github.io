---
layout: post
title: "Rails in the Entreprise"
date: 2008-09-16 16:20
comments: true
categories: 
- Rails
alias: /articles/2008/09/16/rails-in-the-enterprise/
---

The first website that I built for Inacom using <a href="http://rubyonrails.org/">ruby on rails</a> in 2006 was deployed to <a href="http://www.ubuntu.com/">Ubuntu</a> 6.06 LTS server and I hand rolled my own install for everything (it was painful). We had <a href="http://www.mysql.com/">MySQL</a> on the same 256 MB VM as the rails code was running from, and we setup a proxy with <a href="http://www.apache.org/">Apache</a> and <a href="http://mongrel.rubyforge.org/">Mongrel</a>. Deploying from <a href="http://www.capify.org/">Capistrano</a> 1.4 made things a bit easier once everything was setup, but the initial build was not an easy task. It was also my first time doing what some would consider fairly heavy Linux command line system administration, so that didn't speed up the process either.

<!-- more -->

Fast forward 2 years and now I'm deploying servers in a mater of minutes, not days thanks to the deprec gem (using mongrel and nginx) and <a href="http://www.vmware.com/products/vi/vc/">VMWare Virtual Center</a> which allows us to store templates of our production rails servers. But VMWare VC isn't the only Enterprise product that we've integrated with our rails development, we can deploy to Windows with <a href="http://www.iis.net/">IIS</a> (though it still isn't highly recommended because of performance concerns), <a href="http://www.apple.com/server/macosx/">OS X Server</a>, and our de-facto favorite Linux Ubuntu.

Not only can we deploy the rails code on a solid hosted virtual private server (VPS), but we can also tie into a lot of the existing corporate Microsoft stack. This very blog has a <a href="http://www.microsoft.com/sqlserver/2008/en/us/default.aspx">SQL Server</a> back end and authenticates against Inacom's <a href="http://www.microsoft.com/windowsserver2008/en/us/active-directory.aspx">Active Directory</a> with SSL over the LDAP protocol.

The bottom line is that Rails is ready for the enterprise, and it's only getting better. Rails 2.2 will be thread safe, a feature that has been cause for some concern over the years, and it should allow for much better raw performance.

To check out some of the "rails applications that scale" see <a href="http://www.softwaredeveloper.com/features/best-ruby-on-rails-061307/">Rails in Action</a>: The 56 Best RoR Driven Sites.

In the next few articles we'll be detailing how we setup our production Linux server for this blog on Ubuntu 8.04 LTS and got it communicating with SQL Server via <a href="http://www.freetds.org/">FreeTDS</a> and the new awesome <a href="http://rubyforge.org/projects/odbc-rails/">ActiveRecord ODBC adaptor</a> written by Tim Haynes. But next, check out how we set up Active Directory authentication for this blog with a small mod to the the restful_authentication plugin.
