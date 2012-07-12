---
layout: post
title: "My Console Vim and Tmux Setup"
date: 2012-07-10 23:03
comments: true
categories: 
published: false
---

I've been using Vim (7.3) in the console through Tmux for close to 6-months now and it's definitely the best development setup I've ever had. Prior to this I have used (roughly in re-verse order):

* [Sublime Text 2](http://www.sublimetext.com/2)
* [MacVim](http://macvim.org/OSX/index.php)
* [Rubymine](http://www.jetbrains.com/ruby/)
* [Textmate](http://macromates.com/)
* [Eclipse (on Windows... yikes!)](http://www.eclipse.org/)

<!-- more -->

I have also installed and played with [Redcar](http://redcareditor.com/) which was pretty neat, but I've never used it for any real development. I still use Rubymine occasionally for step through debugging or major refactoring of Models or Classes (though I'm anxious to try tpope's [vim-abolish](https://github.com/tpope/vim-abolish) next time I need to do that kind of a refactoring).

### Now on to my setup!

This setup can be installed easily on a Mac OS X or Linux machine provided a few prerequisites are met (all of which I prefer to keep updated by installing the latest versions through [Homebrew](http://mxcl.github.com/homebrew/):

* Git is installed
* Vim is installed (preferably 7.3 or above)
* Tmux is installed (preferably 1.6 or above) 

**I also highly recommend checking out:**

* [iTerm 2](http://www.iterm2.com/#/section/home) (not required, but highly recommended as an alternative to the built in Terminal.app)
* [Zsh & oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh/) (follow the installation instructions for that project separately if you want to run Zsh instead of Bash for your shell)

### Enough already, show me the ~/.vimrc!

Alright, here is the gist I use to setup my entire development environment: [https://gist.github.com/2040114](https://gist.github.com/2040114)

Let me know if you have any questions or comments! I love to talk shop about Vim :)
