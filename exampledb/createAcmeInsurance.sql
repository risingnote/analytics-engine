#==================================
# Run as root
# Imaginary insurance private schema 
#==================================
drop database if exists acmeinsurance;

create database acmeinsurance;

use acmeinsurance;

drop table if exists salary;
create table salary (
  id int unsigned auto_increment not null primary key,
  name varchar(40) not null,
  salary int not null,
  dob date not null
  ); 

insert into salary() values(null, 'Wendy', 10100,  date_format('1990-02-23', '%Y-%m-%d'));
insert into salary() values(null, 'Walter', 20200,  date_format('1991-02-23', '%Y-%m-%d'));
insert into salary() values(null, 'Victor', 30300,  date_format('1992-02-23', '%Y-%m-%d'));
insert into salary() values(null, 'Truddy', 4040,  date_format('1993-02-23', '%Y-%m-%d'));

drop table if exists computerFraud;
create table computerFraud (
  id int unsigned auto_increment not null primary key,
  loss int not null,
  ipAddress int unsigned null,
  lossDate datetime not null
  ); 

# Sample data
insert into computerFraud() values(null, '45', inet_aton('100.200.127.4'), date_format('2017-01-18 15:22:03', '%Y-%m-%d %H:%i:%S'));
insert into computerFraud() values(null, '54', inet_aton('100.200.127.4'), date_format('2017-01-18 16:23:03', '%Y-%m-%d %H:%i:%S'));
insert into computerFraud() values(null, '63', inet_aton('100.200.127.4'), date_format('2017-01-18 21:24:03', '%Y-%m-%d %H:%i:%S'));
insert into computerFraud() values(null, '72', inet_aton('100.200.127.4'), date_format('2017-01-18 23:25:03', '%Y-%m-%d %H:%i:%S'));
insert into computerFraud() values(null, '101', inet_aton('100.200.127.9'), date_format('2017-01-18 23:26:03', '%Y-%m-%d %H:%i:%S'));

drop table if exists cyberAttribution;
create table cyberAttribution (
  id int unsigned auto_increment not null primary key,
  ipAddress int unsigned not null,
  attributionId int not null
  ); 

# Sample data
insert into cyberAttribution() values(null, inet_aton('100.200.127.4'), 1);
insert into cyberAttribution() values(null, inet_aton('100.200.127.5'), 1);
insert into cyberAttribution() values(null, inet_aton('100.200.127.6'), 2);
insert into cyberAttribution() values(null, inet_aton('100.200.127.7'), 2);
insert into cyberAttribution() values(null, inet_aton('100.200.127.8'), 3);
insert into cyberAttribution() values(null, inet_aton('200.200.127.1'), 4);
insert into cyberAttribution() values(null, inet_aton('200.200.127.2'), 4);
insert into cyberAttribution() values(null, inet_aton('200.200.127.3'), 5);
insert into cyberAttribution() values(null, inet_aton('200.200.127.4'), 5);
insert into cyberAttribution() values(null, inet_aton('200.200.127.5'), 6);

#=================================================================
# Schema to hold read only views, access from analytics engine.
#=================================================================
drop view if exists v_salary;

create algorithm = temptable 
  sql security definer
 view v_salary as select * from salary;

drop view if exists v_cyberFraud;

create algorithm = temptable 
  sql security definer
 view v_cyberFraud as select * from computerFraud;

drop view if exists v_attribution;

create algorithm = temptable 
  sql security definer
 view v_attribution as select * from cyberAttribution;

drop user if exists 'spdzuser_ins'@'172.0.0.0/255.0.0.0' ;
create user 'spdzuser_ins'@'172.0.0.0/255.0.0.0' 
 identified by 'inspassword' password expire never;

grant select on v_salary to 'spdzuser_ins'@'172.0.0.0/255.0.0.0' ;
grant select on v_cyberFraud to 'spdzuser_ins'@'172.0.0.0/255.0.0.0' ;
grant select on v_attribution to 'spdzuser_ins'@'172.0.0.0/255.0.0.0' ;

commit;
