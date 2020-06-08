# eMammal lite

## Installation instructions for development environment

1. Dependencies:

    * Ruby 2.6.5

    * MySQL

1. Set up `secrets.yml` file [(rails documentation reference)](https://guides.rubyonrails.org/upgrading_ruby_on_rails.html#config-secrets-yml)
  
    1. Create `secrets.yml` file in `config` folder

    1. Generate keys for `development` and `test` sections by running `rake secret` in console. Copy and paste each key to `secrets.yml`

1. Set up `database.yml` [(rails documentation reference)](https://edgeguides.rubyonrails.org/configuring.html#configuring-a-mysql-or-mariadb-database)

    1. Create `database.yml` file in `config` folder

    1. Paste the following default development configuration for MySQL into this file:

    ```yml
    development:
      adapter: mysql2
      encoding: utf8mb4
      database: emmamal-lite_development
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
