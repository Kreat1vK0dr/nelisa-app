CREATE DATABASE nelisa;
CREATE USER daniel@localhost IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON nelisa.* TO daniel@localhost;
FLUSH PRIVILEGES;



create table sales_raw(
    day varchar(9) not null,
    date DATE,
    item varchar(30),
    quantity numeric(10,0),
    price numeric(10,2)

);
