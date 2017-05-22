#==================================
# Run as root
# Imaginary bank private schema 
#==================================
drop database if exists acmebank;

create database acmebank;

use acmebank;

drop table if exists salary;
create table salary (
  id int unsigned auto_increment not null primary key,
  name varchar(40) not null,
  salary int not null,
  dob date not null
  ); 

insert into salary() values(null, 'Alice', 10000,  date_format('1990-02-23', '%Y-%m-%d'));
insert into salary() values(null, 'Bob', 20000,  date_format('1991-02-23', '%Y-%m-%d'));
insert into salary() values(null, 'Carol', 30000,  date_format('1992-02-23', '%Y-%m-%d'));
insert into salary() values(null, 'Dave', 4000,  date_format('1993-02-23', '%Y-%m-%d'));

drop table if exists cyberFraud;
create table cyberFraud (
  id int unsigned auto_increment not null primary key,
  amount int not null,
  ipAddress int unsigned null,
  incidentDate datetime not null
  ); 

# Sample data
insert into cyberFraud() values(null, '12', inet_aton('100.200.127.4'), date_format('2017-01-18 15:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '25', inet_aton('100.200.127.5'), date_format('2017-01-18 20:22:03', '%Y-%m-%d %H:%i:%S'));
insert into cyberFraud() values(null, '53', inet_aton('100.200.127.6'), date_format('2017-01-18 23:22:03', '%Y-%m-%d %H:%i:%S'));

#=================================================================
# Schema to hold read only views, access from analytics engine.
#=================================================================
drop view if exists v_salary;

create algorithm = temptable 
  sql security definer
  view v_salary as select * from salary;

drop view if exists v_cyberFraud;

create algorithm = temptable
 sql security invoker
 view v_cyberFraud as select * from cyberFraud;

drop user if exists 'spdzuser_bank'@'172.17.0.%' ;
create user 'spdzuser_bank'@'172.17.0.%' 
 identified by 'bankpassword' password expire never;


grant select on v_salary to 'spdzuser_bank'@'172.17.0.%' ;

grant select on v_cyberFraud to 'spdzuser_bank'@'172.17.0.%' ;

commit;







