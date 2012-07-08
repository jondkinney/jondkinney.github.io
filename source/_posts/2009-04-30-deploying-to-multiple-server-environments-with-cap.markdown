---
layout: post
title: "Deploying to Multiple Server Environments with Cap"
date: 2009-04-30 16:49
comments: false
categories: 
- Rails
- Linux
alias: /articles/2009/04/30/deploying-to-multiple-server-environments-with-cap/
---

Most anytime I develop a web application I need to deploy to multiple server environments. For me this used to mean maintaining two separate deploy.rb scripts, and I would rename one while deploying to staging, and then rename the other when I needed to deploy to production. After about three deploys I said, the hell with this! And I figured out how to allow the specification of your deployment at the command line during the cap deploy task.

<!-- more -->

Now I know what you're thinking, why not create your own cap task that is called cap deploy_production and cap deploy_staging (or whatever), but I didn't want to muck around with that. Here is how I get Capistrano to prompt ME!

```ruby
default_run_options[:pty] = true
ssh_options[:forward_agent] = true
# also had to set up id_ras keys for the deploy user on the production box (to itself). And setup the tunnel definition as well in ~/.subversion/config
# Local => rs_ssh = /opt/local/bin/ssh -p 2384 -l jkinney
# Production => rs_ssh = /usr/bin/ssh -p 2384 -l jkinney

set :gems_for_project, %w(highline,will_paginate,etc...) # list of gems to be installed

# Make terminal prompt us for the location we want to deploy to
set :deploy_location, Proc.new { deploy_location = Capistrano::CLI.ui.ask "Enter deploy location (stage/prod)" }

if "#{deploy_location}" == "prod"
  set :domain, "209.41.75.42"
else
  # I have ssh setup on a non-standard port for my staging box, since it's exposed to the world. Our production box required VPN or local netowrk access.
  ssh_options[:port] = 2384
  set :domain, "YOUR STAGING IP HERE"
  # note that your staging could be on the same server, just setup your application names differently then so you aren't overwriting things.
end

# prompts for a release tag, if that is your sort of thing...
set :release_tag, Proc.new { release_tag = Capistrano::CLI.ui.ask "Enter a release tag to deploy (type trunk or leave blank and hit enter to deploy from trunk)" }

role :app, domain
role :web, domain
role :db,  domain, :primary => true

set :application, "jonkinneydotcom"

set :user, "deploy"
set :password, "secret"
set :deploy_to, "/var/www/apps/#{application}"

set :rails_env, "production"

# I thought this was automatic, but I seem to need to require it to cleanup my releases
set :keep_releases, 4
after "deploy", "deploy:cleanup"

# this is using subversion, I am transitioning to GIT and will post updates when I have a modified deploy.rb
set :repo_location, "/var/svn/your_subversion_repo"
set :repository, "svn+ssh://#{domain}#{repo_location}/#{application}/trunk"

namespace :deploy do
  desc "restart passenger"
  task :restart, :roles => :app, :except => {:no_release => true} do
    run "touch #{current_path}/tmp/restart.txt"
  end

  [:start, :stop].each do |t|
    desc "#{t} task is a no-op with passenger"
    task t, :roles => :app do; end
  end
  
  task :after_symlink do
    run "chmod -R a+rw #{release_path}/public"

    #rcov messes with deployed apps...remove it in production
    run "rm -rf #{release_path}/vendor/plugins/rails_rcov" 
    
    # OPTIONAL: symlink files from the FTP site's home directory to the rails_root 
    # keep them protected and use send_file to present them to the logged in user 
    # (this is more secure than hiding them in a public directory with directory listing off)
    # run "rm -rf #{release_path}/admin_files" 
    # run "ln -s #{deploy_to}/#{shared_dir}/admin_files #{release_path}"    

    #symlink the files from outside the deploy path so we can keep all the uploaded images!
    # This will allow images uploaded through an asset manager to be retained between deployments
    run "rm -rf #{release_path}/public/assets" 
    run "ln -s #{deploy_to}/#{shared_dir}/assets #{release_path}/public/assets"

    # setup database for production environment (database.yml should be ignored in svn)
    db_params = {
      "adapter"=>"mysql",
      "database"=>"yourapp_production",
      "username"=>"root",
      "password"=>"secret",
      "host"=>"localhost",
    }

    # OPTIONAL: Deploy to production with a sqlite3 database...because we don't need anything elaborage. 
    # And that way we can reset the db every hour or whatever with a cron job
    # db_params = {
    #   "adapter"=>"sqlite3",
    #   "database"=>"db/production.sqlite3.db",
    #   "timeout"=>"5000"
    # }

    db_params.each do |param, default_val|
      set "db_#{param}".to_sym,
      #if you want to be prompted uncomment the line below this and comment out the one directly below that
      # lambda { Capistrano::CLI.ui.ask "Enter database #{param}" do |q| q.default=default_val end}
      param = default_val
    end
    
    # builds the database.yml
    database_configuration = "production:\n"
    db_params.each do |param, default_val|
      val=self.send("db_#{param}")
      database_configuration<<"  #{param}: #{val}\n"
    end
    
    run "mkdir -p #{deploy_to}/#{shared_dir}/config"
    
    put database_configuration, "#{deploy_to}/#{shared_dir}/config/database.yml"    

    #symlink the database.yml
    run "ln -s #{deploy_to}/#{shared_dir}/config/database.yml #{deploy_to}/current/config"
    
    #symlink the production database
    run "ln -s #{deploy_to}/#{shared_dir}/config/production.sqlite3.db #{deploy_to}/current/db"
  end
end

# This is what asks you if you're sure you want to deploy to production?!?!?
before "deploy:update_code", "user_confirmation_for_production_deployment"
task :user_confirmation_for_production_deployment, roles => :app do
  if "#{deploy_location}" == 'prod'
    message = "You are deploying to PRODUCTION. continue(y/n):"
    answer = Capistrano::CLI.ui.ask(message)   
    abort "deployment to production was stopped" unless answer == 'y'
  end
end



######################Custom cap tasks that I find useful
desc "Configure VHost"
task :config_vhost do
  vhost_config =<<-EOF
<VirtualHost *:80>
  ServerName jonkinney.com
  ServerAlias www.jonkinney.com
  DocumentRoot #{deploy_to}/current/public
</VirtualHost>
  EOF
  put vhost_config, "#{deploy_to}/#{shared_dir}/config/vhost_config"
  sudo "mv #{deploy_to}/#{shared_dir}/config/vhost_config /etc/apache2/sites-available/#{application}"
  sudo "a2ensite #{application}"
  sudo "/etc/init.d/apache2 reload"
end

desc "create assets directory"
task :create_assets_directory do
  sudo "mkdir -p #{deploy_to}/#{shared_dir}/assets"
  sudo "chmod -R 777 #{deploy_to}/#{shared_dir}/assets"
  sudo "chown -R deploy:www-data #{deploy_to}/#{shared_dir}/assets"
end

desc "make current development database the production database"
task :upload_dev_db_to_prod do
  put(File.read("db/development.sqlite3.db"), "#{deploy_to}/#{shared_dir}/config/production.sqlite3.db")
end

desc "run remote command"
task :show, :roles => :app do
  run <<-COMMAND
    /var/www/apps/#{application}/current/script/runner -e production 'require "pp"; pp #{command}'
  COMMAND
end

desc "run remote rake db:migrate RAILS_ENV=production"
task :remote_db_migrate do
  run("cd #{deploy_to}/current; /usr/bin/rake db:migrate RAILS_ENV=production")
end
```

Hopefully this has been helpful. I know Capistrano can be somewhat of a black box for people, so if you have issues with my deploy.rb or need any help feel free to contact me or post in the comments!
