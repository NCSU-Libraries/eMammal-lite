# eMammal Lite

A web application for identifying and exploring camera trap images from the eMammal project

## About eMammal Lite

eMammal Lite is a web application that provides a fun and engaging way to explore over 4,000 candid images of wildlife from around the world and participate in camera trapping and animal identification methods used by ecological researchers. Each image in this collection helps scientists and conservationists document wildlife that may otherwise go unseen and while taking a photo with a camera trap is easily done with modern photography hardware, it is up to a human to provide the actual identification of what tripped the camera. It takes a lot of time and effort for researchers to analyze and identify each photo from a project. eMammal Lite asks the user to help out by identifying, or tagging, animals captured in camera trap photos. The application also provides a photo archive to explore the entire collection of images and data and a stats page that allows users to compare their identification abilities with others.

This application utilizes information from a database of camera trap images and associated metadata provided by researchers from the [eMammal](https://emammal.si.edu/) camera trapping project—a tool for collecting, archiving, and sharing camera trapping images and data. Imagery and data from this database are used to create interfaces for users to 1) identify animals in a flashcard-like game and 2) view, explore, and search the entire collection of images. User-generated data collected from the gaming interface is used to create a stats interface for users to explore user-generated statistics such as personal and global identification accuracy and score.

To view eMammal Lite, visit <https://eml.lib.ncsu.edu/>

## Installation instructions for development environment

1. Dependencies:

    * Ruby 2.6.5

    * MySQL

1. Use `bundler` to install gems ([Installing and using Bundler](https://bundler.io/)):

    ```bash
    bundle install
    ```

1. Set up `secrets.yml` file ([Rails documentation reference](https://guides.rubyonrails.org/upgrading_ruby_on_rails.html#config-secrets-yml))
  
    1. Create `secrets.yml` file in `config` folder

    1. Generate keys for `development` and `test` sections by running `rake secret` in console. Copy and paste each key to `secrets.yml`

1. Set up `database.yml` ([Rails documentation reference](https://edgeguides.rubyonrails.org/configuring.html#configuring-a-mysql-or-mariadb-database))

    1. Create `database.yml` file in `config` folder

    1. Paste the following default development configuration for MySQL into this file:

    ```yml
    development:
      adapter: mysql2
      encoding: utf8mb4
      database: emammal-lite_development
      pool: 5
      username: root
      password:
      socket: /tmp/mysql.sock
    ```

1. Start MySQL server:

    ```bash
    mysql.server start
    ```

1. Set up development database:

    ```bash
    bundle e rails db:setup
    ```

## Run development environment

1. Start the development server:

    ```bash
    bundle e rails s
    ```

## Authors

Walt Gurley

Maris Hall
